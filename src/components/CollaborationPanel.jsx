import { useState } from 'react';

/**
 * Collaboration & Annotations Panel
 * Enable real-time collaboration with auditors and reviewers
 * Support for annotations, comments, and version tracking
 */
const CollaborationPanel = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Senior Auditor',
      timestamp: '2026-03-19 14:32',
      text: 'Receivables confirmation completed. All 50 items reconciled successfully.',
      procedure: 'Receivables Confirmations',
      resolved: false
    },
    {
      id: 2,
      author: 'Mark Chen',
      role: 'Manager',
      timestamp: '2026-03-19 13:15',
      text: 'Please verify allowance for doubtful debts is adequate. Need supporting detail.',
      procedure: 'Allowance Review',
      resolved: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        author: 'Current User',
        role: 'Auditor',
        timestamp: new Date().toLocaleString(),
        text: newComment,
        procedure: selectedProcedure || 'General',
        resolved: false
      }]);
      setNewComment('');
      setSelectedProcedure('');
    }
  };

  const toggleResolved = (id) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, resolved: !c.resolved } : c
    ));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h3>💬 Collaboration & Annotations</h3>

      {/* Add Comment Section */}
      <div style={{
        padding: '16px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        marginBottom: '20px',
        borderLeft: '4px solid #2196F3'
      }}>
        <h4 style={{ marginTop: 0 }}>Add Comment</h4>
        
        <div style={{ marginBottom: '12px' }}>
          <select
            value={selectedProcedure}
            onChange={(e) => setSelectedProcedure(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginBottom: '8px'
            }}
          >
            <option value="">Select Procedure (Optional)</option>
            <option value="Cash Confirmations">Cash Confirmations</option>
            <option value="Receivables Confirmations">Receivables Confirmations</option>
            <option value="Inventory Count">Inventory Count</option>
            <option value="Fixed Assets Review">Fixed Assets Review</option>
          </select>
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
          style={{
            width: '100%',
            height: '80px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontFamily: 'inherit',
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={handleAddComment}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Post Comment
        </button>
      </div>

      {/* Comments Timeline */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {comments.map(comment => (
          <div
            key={comment.id}
            style={{
              padding: '16px',
              backgroundColor: comment.resolved ? '#f0f0f0' : 'white',
              borderRadius: '4px',
              borderLeft: `4px solid ${comment.resolved ? '#4CAF50' : '#FF9800'}`,
              opacity: comment.resolved ? 0.7 : 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div>
                <strong>{comment.author}</strong>
                <span style={{ marginLeft: '8px', color: '#666', fontSize: '12px' }}>({comment.role})</span>
              </div>
              <button
                onClick={() => toggleResolved(comment.id)}
                style={{
                  padding: '4px 12px',
                  backgroundColor: comment.resolved ? '#4CAF50' : '#e0e0e0',
                  color: comment.resolved ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {comment.resolved ? '✅ Resolved' : 'Mark Resolved'}
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              📅 {comment.timestamp} | 📋 {comment.procedure}
            </div>

            <p style={{ margin: '8px 0', color: '#333' }}>{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Collaboration Stats */}
      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <small style={{ color: '#666' }}>
          📊 Total Comments: {comments.length} | ✅ Resolved: {comments.filter(c => c.resolved).length} | ⏳ Pending: {comments.filter(c => !c.resolved).length}
        </small>
      </div>
    </div>
  );
};

export default CollaborationPanel;
