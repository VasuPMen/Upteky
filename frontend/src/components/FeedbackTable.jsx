import React from 'react';

export default function FeedbackTable({ feedbacks }) {
  return (
    <div className="card">
      <h2>All Feedbacks</h2>
      <div style={{overflowX:'auto'}}>
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Message</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 && (
              <tr><td colSpan="5" style={{textAlign:'center'}}>No feedbacks yet</td></tr>
            )}
            {feedbacks.map(f => (
              <tr key={f._id}>
                <td>{f.name}</td>
                <td>{f.email || '-'}</td>
                <td>{f.rating}</td>
                <td style={{maxWidth:300, whiteSpace:'pre-wrap'}}>{f.message}</td>
                <td>{new Date(f.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
