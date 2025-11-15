import React, { useEffect, useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackTable from './components/FeedbackTable';
import StatsCards from './components/StatsCards';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgRating: 0, positive: 0, negative: 0 });
  const [filterRating, setFilterRating] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAll = async (ratingFilter) => {
    try {
      let url = `${API}/api/feedback`;
      if (ratingFilter) url += `?rating=${ratingFilter}`;
      console.log('Fetching feedbacks from:', url);
      const res = await fetch(url);
      
      if (!res.ok) {
        console.error('Failed to fetch feedbacks:', res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      console.error('API URL:', API);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const url = `${API}/api/feedback/stats`;
      console.log('Fetching stats from:', url);
      const res = await fetch(url);
      
      if (!res.ok) {
        console.error('Failed to fetch stats:', res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      console.error('API URL:', API);
    }
  };

  useEffect(() => {
    fetchAll(filterRating);
    fetchStats();
  }, [filterRating]);

  const onNewFeedback = () => {
    setFilterRating('');
    fetchAll('');
    fetchStats();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Rating', 'Message', 'CreatedAt'],
      ...feedbacks.map(f => [
        f.name,
        f.email || '',
        f.rating,
        (f.message || '').replace(/\n/g, ' '),
        new Date(f.createdAt).toLocaleString()
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Debug: Log API URL on mount
  useEffect(() => {
    console.log('Current API URL:', API);
    console.log('Environment variable VITE_API_URL:', import.meta.env.VITE_API_URL);
  }, []);

  return (
    <div className="container">
      <h1>📝 Feedback Dashboard</h1>
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.1)', 
          border: '1px solid rgba(99, 102, 241, 0.3)', 
          padding: '0.75rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          🔧 <strong>Debug Mode:</strong> API URL = <code>{API}</code>
        </div>
      )}
      <StatsCards stats={stats} />
      <div className="main">
        <div className="left">
          <FeedbackForm apiUrl={API} onSuccess={onNewFeedback} />
        </div>
        <div className="right">
          <div className="controls">
            <label>
              <span>Filter by rating:</span>
              <select 
                value={filterRating} 
                onChange={(e) => setFilterRating(e.target.value)}
                disabled={loading}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </label>
            <button 
              onClick={handleExportCSV} 
              disabled={loading || feedbacks.length === 0}
              className="secondary"
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--muted-light)' }}>Loading feedbacks...</p>
            </div>
          ) : (
            <FeedbackTable feedbacks={feedbacks} />
          )}
        </div>
      </div>

      <footer>
        <p>💡 Tip: Set <code>VITE_API_URL</code> to your backend base URL when deploying.</p>
      </footer>
    </div>
  );
}
