import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder, MdLocationOn } from 'react-icons/md';
import CategoryIcon from '../common/CategoryIcon';
import './PlaceCard.css';

const PlaceCard = ({ place, isFavorite, onToggleFavorite, source, sourceTab }) => {
  const navigate = useNavigate();
  
  // Handle both database places (_id) and external places (externalId)
  const placeId = place._id || place.externalId;
  const isExternal = !place._id && place.externalId;

  const handleClick = () => {
    if (isExternal) {
      // For external places, navigate to a preview page or import first
      navigate(`/places/external/${place.externalId}`);
    } else {
      navigate(`/places/${place._id}`, { state: { from: source, tab: sourceTab } });
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite && !isExternal) {
      onToggleFavorite(place._id);
    }
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

  const imageUrl = place.images?.[0] || place.photos?.[0];

  return (
    <div className="place-card" onClick={handleClick}>
      {onToggleFavorite && !isExternal && (
        <button
          className={`favorite-icon ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <MdFavorite size={24} /> : <MdFavoriteBorder size={24} />}
        </button>
      )}
      <div className="place-card-image">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={place.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.place-card-icon-fallback').style.display = 'flex';
            }}
          />
        ) : null}
        <div className="place-card-icon-fallback" style={{ display: imageUrl ? 'none' : 'flex' }}>
          <CategoryIcon category={place.category} size={48} />
        </div>
      </div>
      <div className="place-card-content">
        <div className="place-card-header">
          <h3 className="place-card-name">{place.name}</h3>
          <span className="place-card-category">{place.category}</span>
        </div>

        <div className="place-card-location">
          <MdLocationOn size={18} />
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
