import React from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Database, ServerCrash } from 'lucide-react';

export default function SystemDetailsModal({ activeModal, onClose }) {
  if (!activeModal) return null;

  const getDetails = () => {
    switch(activeModal) {
      case 'health':
        return {
          title: 'Overall System Health',
          icon: <ShieldCheck size={40} color="#34d399" />,
          desc: 'The entire infrastructure is currently operating within expected parameters. Redundancy is active and all primary services are online.',
          stats: [{ label: 'Score', value: '98/100' }, { label: 'Uptime', value: '99.99%' }]
        };
      case 'failures':
        return {
          title: 'System Failures',
          icon: <ServerCrash size={40} color="#f87171" />,
          desc: 'A history of hard crashes and unrecoverable errors. The self-healing engine has successfully prevented any major failures today.',
          stats: [{ label: 'Recent Failures', value: '0' }, { label: 'Prevented', value: '14' }]
        };
      case 'database':
        return {
          title: 'Database Health',
          icon: <Database size={40} color="#38bdf8" />,
          desc: 'Primary nodes and read replicas are fully synchronized. Query latency is optimal and under threshold limits.',
          stats: [{ label: 'Replication Lag', value: '0ms' }, { label: 'Connections', value: '1,420' }]
        };
      case 'traffic':
        return {
          title: 'Traffic Security',
          icon: <AlertTriangle size={40} color="#fb923c" />,
          desc: 'Real-time packet inspection is active. DDoS protection is standing by. Unusual incoming traffic patterns are isolated.',
          stats: [{ label: 'Suspicious IPs Blocked', value: '45' }, { label: 'Active Threats', value: '0' }]
        };
      default: return null;
    }
  };

  const data = getDetails();
  if (!data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20}/></button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {data.icon}
          <h2 style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 800 }}>{data.title}</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '20px', textAlign: 'center' }}>
          {data.desc}
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {data.stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px 20px', borderRadius: '10px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '5px' }}>{s.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
