import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdAutoAwesome } from 'react-icons/md';
import CategoryIcon from '../common/CategoryIcon';
import './RecommendationCard.css';

const RecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/places/${recommendation.place._id}`);
  };

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

  const imageUrl = recommendation.place.images?.[0] || recommendation.place.photos?.[0];

  return (
    <div className="recommendation-card" onClick={handleClick}>
      <div className="recommendation-badge">
        <MdAutoAwesome size={16} />
        <span>Recommended for you</span>
      </div>

      {imageUrl ? (
        <div className="recommendation-image">
          <img 
            src={imageUrl} 
            alt={recommendation.place.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.recommendation-icon-fallback').style.display = 'flex';
            }}
          />
          <div className="recommendation-icon-fallback" style={{ display: 'none' }}>
            <CategoryIcon category={recommendation.place.category} size={64} />
          </div>
        </div>
      ) : (
        <div className="recommendation-icon-fallback">
          <CategoryIcon category={recommendation.place.category} size={64} />
        </div>
      )}

      <div className="recommendation-content">
        <div className="recommendation-header">
          <h3>{recommendation.place.name}</h3>
          <span className="recommendation-category">{recommendation.place.category}</span>
        </div>

        <div className="recommendation-details">
          <div className="detail-item">
            <MdLocationOn size={18} className="detail-icon" />
            <span>{recommendation.place.location?.city || 'Location not specified'}</span>
          </div>

          {recommendation.place.averageRating > 0 && (
            <div className="detail-item">
              <span className="rating-stars">{renderStars(recommendation.place.averageRating)}</span>
              <span className="rating-value">{recommendation.place.averageRating.toFixed(1)}</span>
              <span className="rating-count">({recommendation.place.reviewCount} reviews)</span>
            </div>
          )}

          {recommendation.place.priceRange && (
            <div className="detail-item">
              <span className="price-range">{recommendation.place.priceRange}</span>
            </div>
          )}
        </div>

        {recommendation.explanation && (
          <div className="recommendation-explanation">
            <p>{recommendation.explanation}</p>
          </div>
        )}

        <div className="recommendation-score">
          <span className="score-label">Match Score:</span>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${recommendation.matchScore || 0}%` }}
            />
          </div>
          <span className="score-value">{recommendation.matchScore || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
