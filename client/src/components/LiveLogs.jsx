import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronRight, Activity } from 'lucide-react';

export default function LiveLogs({ history }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const reversed = [...(history || [])].reverse();

  return (
    <div className="card">
      <div 
        className="card-header" 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        style={{ cursor: 'pointer', marginBottom: isCollapsed ? 0 : '10px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="card-title" style={{ gap: '8px' }}>
            <Terminal size={16} />
            System Internal Logs
          </div>
          <div className="status-badge healthy" style={{ padding: '2px 8px', fontSize: '0.6rem', border: 'none', background: 'rgba(52, 211, 153, 0.1)' }}>
            <div className="status-dot" style={{ width: 6, height: 6 }} />
            Live
          </div>
        </div>
        {isCollapsed ? <ChevronRight size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
      </div>
      
      {!isCollapsed && (
        <div className="action-list" style={{ maxHeight: '140px', overflowY: 'auto' }}>
          {reversed.length === 0 ? (
            <div className="empty-state">
              <p>Waiting for system events...</p>
            </div>
          ) : (
            reversed.map((log, idx) => (
              <div key={idx} style={{ 
                fontSize: '0.75rem', 
                padding: '8px 12px', 
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                display: 'flex',
                gap: '10px'
              }}>
                <span style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>INFO</span>
                <span style={{ color: '#9ca3af' }}>
                  Metrics snapshot: CPU {log.cpu}% | RAM {log.memory}% | Disk {log.disk}%
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
