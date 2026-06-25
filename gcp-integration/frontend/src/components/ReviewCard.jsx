import React from 'react';

export default function ReviewCard({ review, delay }) {
  const getSentimentClass = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'badge-success';
      case 'negative': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  return (
    <div 
      className="review-card animate-fade-in" 
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="review-header">
        <span className="review-id">ID: #{review.id.toString().padStart(4, '0')}</span>
        <div className="review-badges">
          <span className={`badge ${getSentimentClass(review.sentiment)}`}>
            {review.sentiment}
          </span>
          <span className={`badge ${getUrgencyClass(review.urgency)}`}>
            {review.urgency} Urgency
          </span>
        </div>
      </div>
      
      <p className="review-text">"{review.text}"</p>
      
      <div className="review-footer">
        {review.entities.map((entity, i) => (
          <span key={i} className="entity-tag">
            {entity}
          </span>
        ))}
      </div>
    </div>
  );
}
