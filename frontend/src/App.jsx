import React, { useEffect, useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackTable from './components/FeedbackTable';
import StatsCards from './components/StatsCards';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total:0, avgRating:0, positive:0, negative:0 });
  const [filterRating, setFilterRating] = useState('');

  const fetchAll = async (ratingFilter) => {
    try {
      let url = `${API}/api/feedback`;
      if (ratingFilter) url += `?rating=${ratingFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/feedback/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll(filterRating);
    fetchStats();
  }, [filterRating]);

  const onNewFeedback = () => {
    setFilterRating(''); // reset any filter
    fetchAll('');
    fetchStats();
  };

  return (
    <div className="container">
      <h1>Feedback Dashboard</h1>
      <StatsCards stats={stats} />
      <div className="main">
        <div className="left">
          <FeedbackForm apiUrl={API} onSuccess={onNewFeedback} />
        </div>
        <div className="right">
          <div className="controls">
            <label>
              Filter by rating:
              <select value={filterRating} onChange={(e)=>setFilterRating(e.target.value)}>
                <option value="">All</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </label>
            <button onClick={() => {
              // export CSV
              const rows = [
                ['Name','Email','Rating','Message','CreatedAt'],
                ...feedbacks.map(f => [f.name, f.email || '', f.rating, (f.message||'').replace(/\n/g,' '), new Date(f.createdAt).toLocaleString()])
              ];
              const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'feedbacks.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}>Export CSV</button>
          </div>

          <FeedbackTable feedbacks={feedbacks} />
        </div>
      </div>

      <footer style={{marginTop:20, fontSize:12}}>Tip: Set <code>VITE_API_URL</code> to your backend base URL when deploying.</footer>
    </div>
  );
}
