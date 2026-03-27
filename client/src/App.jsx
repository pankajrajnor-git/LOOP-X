import { useState, useEffect, useCallback } from 'react';
import './App.css';

import MetricGauge from './components/MetricGauge';
import MetricsChart from './components/MetricsChart';
import PredictionPanel from './components/PredictionPanel';
import AnomalyFeed from './components/AnomalyFeed';
import ActionLog from './components/ActionLog';
import SimulationControls from './components/SimulationControls';
import LiveLogs from './components/LiveLogs';
import TrafficChart from './components/TrafficChart';
import ChatbotWindow from './components/ChatbotWindow';
import { ShieldCheck, ServerCrash, Database, AlertTriangle } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [actions, setActions] = useState([]);
  const [status, setStatus] = useState({ status: 'healthy', message: 'Connecting...' });
  const [connected, setConnected] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [mRes, hRes, pRes, aRes, actRes, sRes] = await Promise.all([
        fetch(`${API}/metrics`),
        fetch(`${API}/metrics/history?n=60`),
        fetch(`${API}/predict`),
        fetch(`${API}/anomalies?n=50`),
        fetch(`${API}/actions?n=50`),
        fetch(`${API}/status`),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (hRes.ok) setHistory(await hRes.json());
      if (pRes.ok) setPredictions(await pRes.json());
      if (aRes.ok) setAnomalies(await aRes.json());
      if (actRes.ok) setActions(await actRes.json());
      if (sRes.ok) setStatus(await sRes.json());
      setConnected(true);
    } catch (err) {
      setConnected(false);
      setStatus({ status: 'critical', message: 'Backend disconnected' });
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return (
    <>
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="24" height="24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div className="header-title">LOOP X</div>
            <div className="header-subtitle">Predictive Autonomous Monitoring System</div>
          </div>
        </div>
        <div className="header-right">
          <div className={`status-badge ${status.status}`} style={{ cursor: 'default' }}>
            <div className="status-dot" />
            {status.status} — {status.message}
          </div>
        </div>
      </header>

      {/* DASHBOARD */}
      <main className="dashboard">
        {/* Row 1: Gauges */}
        <div className="dashboard-grid">
          <MetricGauge label="CPU Usage" value={metrics?.cpu} />
          <MetricGauge label="Memory Usage" value={metrics?.memory} />
          <MetricGauge label="Disk Usage" value={metrics?.disk} />
          <MetricGauge label="Network Sent" value={Math.min(100, (metrics?.network_sent || 0) / 100)} unit=" MB" />
        </div>

        {/* Row 2: Expanded Health Stats */}
        <div className="dashboard-grid">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
             <ShieldCheck size={32} color="#34d399" />
             <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '12px', fontWeight: 700 }}>OVERALL HEALTH</div>
             <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f1f5f9' }}>98%</div>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
             <ServerCrash size={32} color="#f87171" />
             <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '12px', fontWeight: 700 }}>SYS FAILURES</div>
             <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f1f5f9' }}>0</div>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
             <Database size={32} color="#38bdf8" />
             <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '12px', fontWeight: 700 }}>DB STATUS</div>
             <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#38bdf8' }}>SYNCED</div>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
             <AlertTriangle size={32} color="#fb923c" />
             <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '12px', fontWeight: 700 }}>TRAFFIC THREATS</div>
             <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fb923c' }}>0</div>
          </div>
        </div>

        {/* Row 2: Charts & Predictions */}
        <div className="dashboard-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MetricsChart history={history} />
            <TrafficChart history={history} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PredictionPanel predictions={predictions} />
            <LiveLogs history={history} />
          </div>
        </div>

        <div className="dashboard-row-3">
          <AnomalyFeed anomalies={anomalies} />
          <ActionLog actions={actions} />
          <SimulationControls simulation={status.simulation} onRefresh={fetchAll} />
        </div>
      </main>

      <ChatbotWindow />
    </>
  );
}

export default App;
