import React from 'react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="rating-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= fullStars ? 'star' : 'star empty'}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: '0.5rem', color: 'var(--muted-light)', fontSize: '0.875rem' }}>
        ({rating})
      </span>
    </div>
  );
};

export default function FeedbackTable({ feedbacks }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="card">
      <h2>All Feedbacks</h2>
      <div className="feedback-table-container">
        {feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No feedbacks yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-light)' }}>{f.name}</td>
                  <td className="email-cell">{f.email || '-'}</td>
                  <td>
                    <StarRating rating={f.rating} />
                  </td>
                  <td className="message-cell">{f.message}</td>
                  <td className="date-cell">{formatDate(f.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
