import { useState } from 'react';
import externalPlacesService from '../../services/externalPlacesService';
import LoadingSpinner from '../common/LoadingSpinner';
import './ExternalPlaceSearch.css';

function ExternalPlaceSearch({ onPlaceImported }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const places = await externalPlacesService.searchPlaces(query, location);
      setResults(places);
      if (places.length === 0) {
        setError('No places found. Try a different search.');
      }
    } catch (err) {
      setError('Failed to search places. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (place) => {
    setImporting(place.externalId);
    setError('');
    
    try {
      const importedPlace = await externalPlacesService.importPlace(place.externalId);
      if (onPlaceImported) {
        onPlaceImported(importedPlace);
      }
      // Remove from results after successful import
      setResults(results.filter(p => p.externalId !== place.externalId));
    } catch (err) {
      setError('Failed to import place. Please try again.');
      console.error('Import error:', err);
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="external-place-search">
      <h2>Search for Places</h2>
      <p className="search-description">
        Search for restaurants, cafes, and bars from Foursquare and add them to your collection
      </p>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="What are you looking for? (e.g., pizza, coffee)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Location (e.g., New York, NY)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading && <LoadingSpinner />}

      {results.length > 0 && (
        <div className="search-results">
          <h3>Found {results.length} places</h3>
          <div className="results-grid">
            {results.map((place) => (
              <div key={place.externalId} className="result-card">
                <div className="result-info">
                  <h4>{place.name}</h4>
                  <p className="result-category">{place.category.replace('_', ' ')}</p>
                  <p className="result-address">
                    {place.location.address}
                    {place.location.city && `, ${place.location.city}`}
                    {place.location.state && `, ${place.location.state}`}
                  </p>
                </div>
                <button
                  onClick={() => handleImport(place)}
                  disabled={importing === place.externalId}
                  className="import-button"
                >
                  {importing === place.externalId ? 'Adding...' : 'Add to Database'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExternalPlaceSearch;
