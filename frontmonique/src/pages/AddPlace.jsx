import { useNavigate } from 'react-router-dom';
import ExternalPlaceSearch from '../components/search/ExternalPlaceSearch';
import './AddPlace.css';

function AddPlace() {
  const navigate = useNavigate();

  const handlePlaceImported = (place) => {
    // Show success message and navigate to the place details
    alert(`Successfully added ${place.name}!`);
    navigate(`/places/${place._id}`);
  };

  return (
    <div className="add-place-page">
      <ExternalPlaceSearch onPlaceImported={handlePlaceImported} />
    </div>
  );
}

export default AddPlace;
