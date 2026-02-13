import React from 'react';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          {review.user?.profilePic && (
            <img src={review.user.profilePic} alt={review.user?.name} className="reviewer-avatar" />
          )}
          <div>
            <div className="reviewer-name">{review.user?.name || 'Usuario Anónimo'}</div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
        </div>
        {renderStars(review.rating)}
      </div>
      
      {review.title && <div className="review-title">{review.title}</div>}
      
      <div className="review-comment">{review.comment}</div>
      
      <div className="review-footer">
        <div className="helpful-count">
          👍 {review.helpfulCount} personas encontraron útil esto
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
