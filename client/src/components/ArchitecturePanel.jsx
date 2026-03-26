import React from 'react';
import { ChevronDown } from 'lucide-react';

const layers = [
  {
    cls: 'monitoring',
    num: '1',
    name: 'Monitoring Layer',
    desc: 'CPU, RAM, Disk, Network — collects metrics via psutil',
  },
  {
    cls: 'detection',
    num: '2',
    name: 'Detection Engine',
    desc: 'Threshold checks + Z-score anomaly detection',
  },
  {
    cls: 'prediction',
    num: '3',
    name: 'Predictive Engine',
    desc: 'Moving average, trend analysis, breach forecasting',
  },
  {
    cls: 'decision',
    num: '4',
    name: 'Decision Engine',
    desc: 'Maps anomalies & predictions → healing actions',
  },
  {
    cls: 'action',
    num: '5',
    name: 'Action Layer',
    desc: 'Auto-restart, cleanup, scaling (dry-run mode)',
  },
];

export default function ArchitecturePanel() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          LOOP X Engine Architecture
        </div>
      </div>
      <div className="arch-flow">
        {layers.map((layer, i) => (
          <React.Fragment key={layer.cls}>
            <div className={`arch-layer ${layer.cls}`}>
              <div className="arch-layer-num">{layer.num}</div>
              <div className="arch-layer-info">
                <div className="arch-layer-name">{layer.name}</div>
                <div className="arch-layer-desc">{layer.desc}</div>
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="arch-arrow">
                <ChevronDown size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
