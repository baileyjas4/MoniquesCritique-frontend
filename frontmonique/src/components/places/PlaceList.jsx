import PlaceCard from './PlaceCard';
import './PlaceList.css';

const PlaceList = ({ places, loading }) => {
  if (loading) {
    return (
      <div className="place-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading places...</p>
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <div className="place-list-empty">
        <p>No places found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="place-list">
      {places.map((place) => (
        <PlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
};

export default PlaceList;
