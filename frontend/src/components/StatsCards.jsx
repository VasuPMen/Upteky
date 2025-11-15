import React from 'react';

export default function StatsCards({ stats }) {
  return (
    <div className="stats">
      <div className="stat card">
        <h3>Total</h3>
        <p>{stats.total ?? 0}</p>
      </div>
      <div className="stat card">
        <h3>Average Rating</h3>
        <p>{stats.avgRating ?? 0}</p>
      </div>
      <div className="stat card">
        <h3>Positive (4+)</h3>
        <p>{stats.positive ?? 0}</p>
      </div>
      <div className="stat card">
        <h3>Negative (&lt;3)</h3>
        <p>{stats.negative ?? 0}</p>
      </div>
    </div>
  );
}
