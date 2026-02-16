import { useNavigate } from 'react-router-dom';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/places/${place._id}`);
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

  return (
    <div className="place-card" onClick={handleClick}>
      <div className="place-card-image">
        {place.category === 'restaurant' && '🍽️'}
        {place.category === 'cafe' && '☕'}
        {place.category === 'bar' && '🍸'}
        {place.category === 'bakery' && '🥐'}
        {place.category === 'food-truck' && '🚚'}
        {!['restaurant', 'cafe', 'bar', 'bakery', 'food-truck'].includes(place.category) && '🍴'}
      </div>
      <div className="place-card-content">
        <div className="place-card-header">
          <h3 className="place-card-name">{place.name}</h3>
          <span className="place-card-category">{place.category}</span>
        </div>

        <div className="place-card-location">
          <span>📍</span>
          <span>{place.location?.city || 'Location not specified'}</span>
        </div>

        {place.averageRating > 0 && (
          <div className="place-card-rating">
            <span className="rating-stars">{renderStars(place.averageRating)}</span>
            <span className="rating-value">{place.averageRating.toFixed(1)}</span>
            <span className="rating-count">({place.reviewCount} reviews)</span>
          </div>
        )}

        {place.priceRange && (
          <div className="place-card-price">{place.priceRange}</div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
