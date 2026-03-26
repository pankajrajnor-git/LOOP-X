import React from 'react';
import { Wrench, Zap, ClipboardList } from 'lucide-react';

export default function ActionLog({ actions }) {
  const reversed = [...(actions || [])].reverse();

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Wrench size={16} />
          Self-Healing Actions
        </div>
        {actions && actions.length > 0 && (
          <span style={{
            fontSize: '0.7rem',
            color: '#38bdf8',
            fontWeight: 600,
            background: 'rgba(56,189,248,0.1)',
            padding: '3px 10px',
            borderRadius: 100,
          }}>
            {actions.length} actions
          </span>
        )}
      </div>
      <div className="action-list">
        {reversed.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={40} />
            <p>No healing actions taken yet</p>
          </div>
        ) : (
          <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '20px' }}>
            {reversed.slice(0, 50).map((a, i) => (
              <div key={i} className="action-item">
                <div className={`action-icon ${a.trigger}`}>
                  {a.trigger === 'prediction' ? <Zap size={16} /> : <Wrench size={16} />}
                </div>
                <div className="action-content">
                  <div className="action-desc">{a.description}</div>
                  <div className="action-reason">{a.reason}</div>
                </div>
                <span className={`action-status-badge ${a.status}`}>
                  {a.status === 'simulated' ? '🛡️ Dry-Run' : '✅ Done'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
