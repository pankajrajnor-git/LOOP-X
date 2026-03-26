import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function AnomalyFeed({ anomalies }) {
  const reversed = [...(anomalies || [])].reverse();

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <ShieldAlert size={16} />
          Anomaly Alerts
        </div>
        {anomalies && anomalies.length > 0 && (
          <span style={{
            fontSize: '0.7rem',
            color: '#f87171',
            fontWeight: 600,
            background: 'rgba(248,113,113,0.1)',
            padding: '3px 10px',
            borderRadius: 100,
          }}>
            {anomalies.length} detected
          </span>
        )}
      </div>
      <div className="anomaly-list">
        {reversed.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={40} />
            <p>No anomalies detected — system is healthy</p>
          </div>
        ) : (
          <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '20px' }}>
            {reversed.slice(0, 50).map((a, i) => (
              <div key={i} className="anomaly-item">
                <div className={`anomaly-severity ${a.severity}`} />
                <div className="anomaly-content">
                  <div className="anomaly-message">{a.message}</div>
                  <div className="anomaly-time">
                    {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : '—'}
                  </div>
                </div>
                <span className="anomaly-type-badge">{a.type?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
