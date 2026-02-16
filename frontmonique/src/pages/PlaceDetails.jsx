import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PlaceDetails.css';

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch place details from API in next task
    setLoading(false);
  }, [id]);

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
      </div>
    );
  }

  if (!place) {
    return (
      <div className="place-details">
        <div className="no-place">
          <h2>Place not found</h2>
          <p>The place you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="place-details">
      <div className="place-details-header">
        <h1>{place.name}</h1>
        <span className="place-category">{place.category}</span>
      </div>

      <div className="place-details-content">
        <div className="place-info-section">
          <h2>Information</h2>
          <div className="place-info-grid">
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{place.location?.city}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Price Range:</span>
              <span className="info-value">{place.priceRange}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rating:</span>
              <span className="info-value">{place.averageRating.toFixed(1)} ⭐</span>
            </div>
            <div className="info-item">
              <span className="info-label">Reviews:</span>
              <span className="info-value">{place.reviewCount}</span>
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
          <h2>Reviews</h2>
          <p>Reviews will be loaded here...</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
