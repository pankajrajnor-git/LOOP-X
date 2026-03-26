import React from 'react';
import { Cpu, HardDrive, StopCircle, Play, Square } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function SimulationControls({ simulation, onRefresh }) {
  const handleCPU = async () => {
    const action = simulation?.cpu_stress_active ? 'stop' : 'start';
    try {
      await fetch(`${API}/simulate/cpu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('CPU simulation error:', err);
    }
  };

  const handleMemory = async () => {
    const action = simulation?.memory_stress_active ? 'stop' : 'start';
    try {
      await fetch(`${API}/simulate/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Memory simulation error:', err);
    }
  };

  const handleStopAll = async () => {
    try {
      await fetch(`${API}/simulate/stop-all`, { method: 'POST' });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Stop all error:', err);
    }
  };

  const cpuActive = simulation?.cpu_stress_active;
  const memActive = simulation?.memory_stress_active;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Play size={16} />
          Demo Simulation
        </div>
      </div>
      <div className="sim-controls">
        <button
          className={`sim-btn ${cpuActive ? 'active' : ''}`}
          onClick={handleCPU}
        >
          <Cpu size={20} />
          <div className="sim-btn-label">
            {cpuActive ? 'Stop CPU Stress' : 'Simulate CPU Stress'}
            <div className="sim-btn-status">
              {cpuActive
                ? `🔴 Running — ${simulation?.cpu_threads || 0} threads`
                : 'Creates high CPU load to trigger detection'}
            </div>
          </div>
          {cpuActive ? <Square size={16} /> : <Play size={16} />}
        </button>

        <button
          className={`sim-btn ${memActive ? 'active' : ''}`}
          onClick={handleMemory}
        >
          <HardDrive size={20} />
          <div className="sim-btn-label">
            {memActive ? 'Stop Memory Stress' : 'Simulate Memory Stress'}
            <div className="sim-btn-status">
              {memActive
                ? `🔴 Running — ${simulation?.memory_blocks_mb || 0} MB allocated`
                : 'Allocates memory to trigger prediction'}
            </div>
          </div>
          {memActive ? <Square size={16} /> : <Play size={16} />}
        </button>

        {(cpuActive || memActive) && (
          <button className="stop-all-btn" onClick={handleStopAll}>
            <StopCircle size={18} />
            Stop All Simulations
          </button>
        )}
      </div>
    </div>
  );
}
