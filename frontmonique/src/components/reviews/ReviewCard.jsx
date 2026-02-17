import { useState } from 'react';
import Avatar from '../common/Avatar';
import './ReviewCard.css';

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === review.user?._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(review._id);
    } catch (err) {
      alert('Failed to delete review');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`review-card ${review.isBlogPost ? 'blog-post' : ''}`}>
      <div className="review-header">
        <div className="review-author">
          <Avatar user={review.user} size="medium" />
          <div className="author-info">
            <div className="author-name">{review.user?.name || 'Anonymous'}</div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <div className="review-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="review-content">
        {review.isBlogPost && <span className="blog-badge">Blog Post</span>}
        <p>{review.content}</p>
      </div>

      {isOwner && (
        <div className="review-actions">
          <button onClick={() => onEdit(review)} disabled={isDeleting}>
            Edit
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="delete">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
