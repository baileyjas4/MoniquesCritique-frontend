import { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SortControls from '../components/search/SortControls';
import PlaceList from '../components/places/PlaceList';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('rating');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    // TODO: Implement API call in next task
    console.log('Searching for:', searchQuery, 'with filters:', filters, 'sorted by:', sortBy);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: Implement API call in next task
    console.log('Filters changed:', newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // TODO: Implement API call in next task
    console.log('Sort changed:', newSort);
  };

  return (
    <div className="search">
      <div className="search-header">
        <h1>Discover Great Places</h1>
        <p>Find the perfect spot for your next meal</p>
      </div>

      <div className="search-controls">
        <SearchBar onSearch={handleSearch} initialQuery={query} />
      </div>

      <div className="search-content">
        <aside className="search-sidebar">
          <FilterPanel onFilterChange={handleFilterChange} initialFilters={filters} />
        </aside>

        <div className="search-results">
          <div className="results-header">
            <div className="results-count">
              {loading ? 'Searching...' : `${results.length} places found`}
            </div>
            <SortControls sortBy={sortBy} onSortChange={handleSortChange} />
          </div>

          <PlaceList places={results} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Search;
