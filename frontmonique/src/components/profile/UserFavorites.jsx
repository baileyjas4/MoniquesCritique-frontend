import PlaceCard from '../places/PlaceCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './UserFavorites.css';

const UserFavorites = ({ favorites, loading, error, onRemoveFavorite }) => {
  if (loading) {
    return (
      <div className="user-favorites-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-favorites-error">
        <p>Failed to load favorites: {error}</p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="user-favorites-empty">
        <p>No favorites yet. Start exploring and save your favorite places!</p>
      </div>
    );
  }

  return (
    <div className="user-favorites">
      <h3>My Favorites ({favorites.length})</h3>
      <div className="favorites-grid">
        {favorites.map((place) => (
          <PlaceCard
            key={place._id}
            place={place}
            isFavorite={true}
            onToggleFavorite={() => onRemoveFavorite(place._id)}
            source="favorites"
            sourceTab="favorites"
          />
        ))}
      </div>
    </div>
  );
};

export default UserFavorites;
