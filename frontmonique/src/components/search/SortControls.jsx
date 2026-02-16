import './SortControls.css';

const SortControls = ({ sortBy, onSortChange }) => {
  return (
    <div className="sort-controls">
      <label htmlFor="sort">Sort by:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="rating">Highest Rated</option>
        <option value="name">Name (A-Z)</option>
        <option value="reviewCount">Most Reviewed</option>
      </select>
    </div>
  );
};

export default SortControls;
