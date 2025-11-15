import React from 'react';

export default function StatsCards({ stats }) {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const formatRating = (rating) => {
    if (!rating || rating === 0) return '0.00';
    return rating.toFixed(2);
  };

  return (
    <div className="stats">
      <div className="stat card">
        <span className="stat-icon">📊</span>
        <div className="stat-value">{formatNumber(stats.total)}</div>
        <div className="stat-label">Total Feedbacks</div>
      </div>
      <div className="stat card">
        <span className="stat-icon">⭐</span>
        <div className="stat-value">{formatRating(stats.avgRating)}</div>
        <div className="stat-label">Average Rating</div>
      </div>
      <div className="stat card">
        <span className="stat-icon">👍</span>
        <div className="stat-value">{formatNumber(stats.positive)}</div>
        <div className="stat-label">Positive (4+)</div>
      </div>
      <div className="stat card">
        <span className="stat-icon">👎</span>
        <div className="stat-value">{formatNumber(stats.negative)}</div>
        <div className="stat-label">Negative (&lt;3)</div>
      </div>
    </div>
  );
}
