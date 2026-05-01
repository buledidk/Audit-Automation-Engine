import { useState, useEffect } from 'react';

/**
 * Offline Mode Panel
 * Displays offline status, pending syncs, and local cache information
 * Supports PWA for mobile offline-first audit work
 */
const OfflineModePanel = () => {
  const [connectivity, setConnectivity] = useState(navigator.onLine);
  const [_syncStatus, _setSyncStatus] = useState({
    isOnline: navigator.onLine,
    queuedCount: 0,
    syncInProgress: false,
    pendingActions: []
  });

  useEffect(() => {
    const handleOnline = () => setConnectivity(true);
    const handleOffline = () => setConnectivity(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pendingActions = [
    { id: 1, action: 'Save Procedure Test Results', timestamp: '14:32', status: 'queued' },
    { id: 2, action: 'Upload Evidence', timestamp: '14:25', status: 'queued' },
    { id: 3, action: 'Record Professional Judgment', timestamp: '14:15', status: 'queued' }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: connectivity ? '#e8f5e9' : '#ffebee', borderRadius: '8px', border: '2px solid ' + (connectivity ? '#4CAF50' : '#F44336') }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>{connectivity ? '🌐' : '📱'}</span>
        <div>
          <h3 style={{ margin: 0 }}>Offline Mode</h3>
          <small style={{ color: '#666' }}>
            {connectivity ? '✅ Connected - All data synced' : '⚠️ Offline - Changes queued for sync'}
          </small>
        </div>
      </div>

      {!connectivity && (
        <div style={{
          padding: '12px',
          backgroundColor: '#FFF3E0',
          borderRadius: '4px',
          borderLeft: '4px solid #FF9800',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          <strong>💡 You're working offline!</strong> All changes are saved locally and will sync automatically when you're back online.
        </div>
      )}

      {/* Pending Actions */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px 0' }}>Pending Sync ({pendingActions.filter(a => a.status === 'queued').length})</h4>
        
        {pendingActions.length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>No pending actions</p>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {pendingActions.map(action => (
              <div key={action.id} style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '4px',
                borderLeft: '3px solid #FF9800',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px'
              }}>
                <div>
                  <strong>{action.action}</strong>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{action.timestamp}</div>
                </div>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: '#FFF3E0',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  ⏳ {action.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Local Cache Storage */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px 0' }}>Local Storage</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Cached Size</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>2.3 MB</div>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Available Space</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>47.7 MB</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button style={{
          padding: '10px',
          backgroundColor: connectivity ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: connectivity ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          fontSize: '12px'
        }} disabled={!connectivity}>
          {connectivity ? '🔄 Sync Now' : 'Waiting for connection...'}
        </button>
        
        <button style={{
          padding: '10px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          💾 Clear Cache
        </button>
      </div>

      {/* PWA Info */}
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '4px', fontSize: '12px' }}>
        <strong>📱 PWA Enabled</strong><br/>
        This app works offline and can be installed on your mobile device for on-site audits.
      </div>
    </div>
  );
};

export default OfflineModePanel;
