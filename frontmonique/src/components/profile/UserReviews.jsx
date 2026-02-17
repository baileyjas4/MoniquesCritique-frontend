import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import './UserReviews.css';

const UserReviews = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className="user-reviews-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-reviews-error">
        <p>Failed to load reviews: {error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="user-reviews-empty">
        <p>No reviews yet. Start exploring and share your experiences!</p>
      </div>
    );
  }

  return (
    <div className="user-reviews">
      <h3>My Reviews ({reviews.length})</h3>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review._id} className="user-review-card">
            <Link 
              to={`/places/${review.place._id}`} 
              className="place-link"
              state={{ from: 'reviews', tab: 'reviews' }}
            >
              <h4>{review.place.name}</h4>
            </Link>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="review-excerpt">{review.content}</p>
            <div className="review-meta">
              {review.isBlogPost && <span className="blog-badge">Blog Post</span>}
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;
