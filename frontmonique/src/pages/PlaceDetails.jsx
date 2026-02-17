import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import placesService from '../services/placesService';
import { reviewsService } from '../services/reviewsService';
import { favoritesService } from '../services/favoritesService';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import './PlaceDetails.css';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlaceDetails();
    fetchReviews();
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await placesService.getPlaceById(id);
      setPlace(data);
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Failed to load place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await reviewsService.getReviewsByPlace(id);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const favorites = await favoritesService.getUserFavorites();
      setIsFavorite(favorites.some(place => place._id === id));
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await favoritesService.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      alert('Failed to update favorite');
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      if (editingReview) {
        await reviewsService.updateReview(editingReview._id, reviewData);
      } else {
        await reviewsService.createReview(reviewData);
      }
      setShowReviewForm(false);
      setEditingReview(null);
      fetchReviews();
      fetchPlaceDetails(); // Refresh to update rating
    } catch (err) {
      throw new Error(err.message || 'Failed to submit review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsService.deleteReview(reviewId);
      fetchReviews();
      fetchPlaceDetails(); // Refresh to update rating
    } catch (err) {
      throw new Error('Failed to delete review');
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  if (loading) {
    return (
      <div className="place-details">
        <div className="loading">Loading place details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="place-details">
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="place-details">
        <div className="no-place">
          <h2>Place not found</h2>
          <p>The place you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/search')}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('½');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars.join('');
  };

  const userHasReviewed = user && reviews.some(r => r.user?._id === (user._id || user.userId));

  // Determine back button text based on where user came from
  const getBackButtonText = () => {
    const from = location.state?.from;
    if (from === 'favorites') {
      return '← Back to Favorites';
    }
    if (from === 'reviews') {
      return '← Back to Reviews';
    }
    if (from === 'search') {
      return '← Back to Search';
    }
    return '← Back';
  };

  const handleBackClick = () => {
    const tab = location.state?.tab;
    const viewMode = location.state?.viewMode;
    
    if (tab) {
      // Navigate back to profile with the tab state
      navigate('/profile', { state: { tab } });
    } else if (viewMode) {
      // Navigate back to search with the view mode preserved in URL
      const searchParams = new URLSearchParams(window.location.search);
      navigate(-1);
    } else {
      // Use browser back
      navigate(-1);
    }
  };

  return (
    <div className="place-details">
      <button className="back-button" onClick={handleBackClick}>
        {getBackButtonText()}
      </button>

      <div className="place-details-header">
        <div>
          <h1>{place.name}</h1>
          <span className="place-category">{place.category}</span>
        </div>
        {user && (
          <button
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? (
              <>
                <MdFavorite size={20} /> Favorited
              </>
            ) : (
              <>
                <MdFavoriteBorder size={20} /> Add to Favorites
              </>
            )}
          </button>
        )}
      </div>

      {place.images && place.images.length > 0 && (
        <div className="place-photos">
          <img 
            src={place.images[0]} 
            alt={place.name} 
            className="place-photo-main"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}

      <div className="place-details-content">
        <div className="place-info-section">
          <h2>Information</h2>
          <div className="place-info-grid">
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">
                {place.location?.city || 'Not specified'}
                {place.location?.address && `, ${place.location.address}`}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Price Range:</span>
              <span className="info-value">{place.priceRange || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rating:</span>
              <span className="info-value">
                {place.averageRating > 0 ? (
                  <>
                    {renderStars(place.averageRating)} {place.averageRating.toFixed(1)}
                  </>
                ) : (
                  'No ratings yet'
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Reviews:</span>
              <span className="info-value">{place.reviewCount || 0}</span>
            </div>
          </div>
        </div>

        {place.description && (
          <div className="place-description-section">
            <h2>About</h2>
            <p>{place.description}</p>
          </div>
        )}

        <div className="place-reviews-section">
          <div className="reviews-header">
            <h2>Reviews ({reviews.length})</h2>
            {user && !userHasReviewed && !showReviewForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="review-form-container">
              <ReviewForm
                placeId={id}
                onSubmit={handleSubmitReview}
                onCancel={handleCancelReview}
                initialData={editingReview}
              />
            </div>
          )}

          <ReviewList
            reviews={reviews}
            loading={reviewsLoading}
            error=""
            currentUserId={user?._id || user?.userId}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
