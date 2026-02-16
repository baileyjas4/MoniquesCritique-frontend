import { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    location: initialFilters.location || '',
    priceRange: initialFilters.priceRange || '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      category: '',
      location: '',
      priceRange: ''
    };
    setFilters(emptyFilters);
  };

  const hasActiveFilters = filters.category || filters.location || filters.priceRange;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Cafe</option>
          <option value="bar">Bar</option>
          <option value="bakery">Bakery</option>
          <option value="food-truck">Food Truck</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          placeholder="City or area"
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="priceRange">Price Range</label>
        <select
          id="priceRange"
          value={filters.priceRange}
          onChange={(e) => handleChange('priceRange', e.target.value)}
        >
          <option value="">Any Price</option>
          <option value="$">$ - Budget</option>
          <option value="$$">$$ - Moderate</option>
          <option value="$$$">$$$ - Upscale</option>
          <option value="$$$$">$$$$ - Fine Dining</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
