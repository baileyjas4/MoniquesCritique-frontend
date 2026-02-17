import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './ReviewList.css';

const ReviewList = ({ reviews, loading, error, currentUserId, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="review-list-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-list-error">
        <p>Failed to load reviews: {error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list-empty">
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReviewList;
