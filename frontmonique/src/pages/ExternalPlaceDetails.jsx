import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import externalPlacesService from '../services/externalPlacesService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './PlaceDetails.css';

function ExternalPlaceDetails() {
  const { externalId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAndImportPlace();
  }, [externalId]);

  const fetchAndImportPlace = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Auto-import the place (will return existing if already imported)
      const importedPlace = await externalPlacesService.importPlace(externalId);
      
      // Redirect to the regular place details page
      navigate(`/places/${importedPlace._id}`, { replace: true });
    } catch (err) {
      console.error('Error importing place:', err);
      setError('Failed to load place details. Please try again.');
      setLoading(false);
    }
  };

  if (loading && !error) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="place-details">
        <div className="place-details-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate(-1)} className="back-button">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // This component now just handles the auto-import and redirect
  // Users won't actually see this page - they'll be redirected to PlaceDetails
  return <LoadingSpinner />;
}

export default ExternalPlaceDetails;
