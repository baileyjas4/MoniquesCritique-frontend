import { MdRestaurant } from 'react-icons/md';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="food-spinner">
        <MdRestaurant size={48} />
      </div>
      <p className="loading-text">Finding delicious places...</p>
    </div>
  );
};

export default LoadingSpinner;