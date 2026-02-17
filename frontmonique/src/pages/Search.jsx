import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdMyLocation, MdViewList, MdMap } from 'react-icons/md';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SortControls from '../components/search/SortControls';
import PlaceList from '../components/places/PlaceList';
import Map from '../components/common/Map';
import externalPlacesService from '../services/externalPlacesService';
import './Search.css';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL parameters
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('price') || ''
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'list'); // 'list' or 'map'
  const [gettingLocation, setGettingLocation] = useState(false);

  // Fetch places whenever search parameters change
  useEffect(() => {
    fetchPlaces();
  }, [query, filters, sortBy]);

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    if (filters.priceRange) params.set('price', filters.priceRange);
    if (sortBy !== 'rating') params.set('sort', sortBy);
    if (viewMode !== 'list') params.set('view', viewMode);
    
    setSearchParams(params, { replace: true });
  }, [query, filters, sortBy, viewMode]);

  const fetchPlaces = async () => {
    // Don't search if no query
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Build location string from filters
      const location = filters.location || '';

      // Search Foursquare API
      const data = await externalPlacesService.searchPlaces(query, location, 50);
      
      // Apply client-side filtering for category and price
      let filteredData = data;
      
      if (filters.category) {
        filteredData = filteredData.filter(place => place.category === filters.category);
      }
      
      if (filters.priceRange) {
        filteredData = filteredData.filter(place => place.priceRange === filters.priceRange);
      }

      // Apply sorting
      if (sortBy === 'rating') {
        filteredData.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sortBy === 'name') {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
      }

      setResults(filteredData);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load places. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleMarkerClick = (place) => {
    if (place.externalId) {
      navigate(`/places/external/${place.externalId}`, { state: { from: 'search', viewMode: 'map' } });
    } else {
      navigate(`/places/${place._id}`, { state: { from: 'search', viewMode: 'map' } });
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get city name
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
          );
          const data = await response.json();
          
          // Extract city and state from the response
          const place = data.features.find(f => f.place_type.includes('place'));
          const region = data.features.find(f => f.place_type.includes('region'));
          
          if (place && region) {
            const locationString = `${place.text}, ${region.properties.short_code.split('-')[1]}`;
            setFilters(prev => ({ ...prev, location: locationString }));
          } else if (place) {
            setFilters(prev => ({ ...prev, location: place.place_name }));
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setError('Could not determine your location name');
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while getting your location.');
        }
      }
    );
  };

  return (
    <div className="search">
      <div className="search-header">
        <h1>Discover Great Places</h1>
        <p>Search for restaurants, cafes, and bars from Foursquare</p>
      </div>

      <div className="search-controls">
        <SearchBar onSearch={handleSearch} initialQuery={query} />
        <button 
          onClick={handleUseMyLocation} 
          disabled={gettingLocation}
          className="location-button"
          title="Use my current location"
        >
          <MdMyLocation size={20} />
          {gettingLocation ? 'Getting location...' : 'Use My Location'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-content">
        <aside className="search-sidebar">
          <FilterPanel onFilterChange={handleFilterChange} initialFilters={filters} />
        </aside>

        <div className="search-results">
          <div className="results-header">
            <div className="results-count">
              {loading ? 'Searching...' : `${results.length} places found`}
            </div>
            <div className="view-controls">
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <MdViewList size={20} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                List
              </button>
              <button
                className={`view-button ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <MdMap size={20} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Map
              </button>
            </div>
            <SortControls sortBy={sortBy} onSortChange={handleSortChange} />
          </div>

          {viewMode === 'list' ? (
            <PlaceList places={results} loading={loading} />
          ) : (
            <div className="map-view">
              <Map places={results} onMarkerClick={handleMarkerClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
