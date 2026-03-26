import React from 'react';

const circumference = 2 * Math.PI * 48;

function getColor(value) {
  if (value > 90) return '#f87171';
  if (value > 75) return '#fb923c';
  if (value > 60) return '#fbbf24';
  return '#34d399';
}

export default function MetricGauge({ label, value, unit = '%', icon }) {
  const safeVal = Math.min(100, Math.max(0, value || 0));
  const offset = circumference - (safeVal / 100) * circumference;
  const color = getColor(safeVal);

  return (
    <div className="card">
      <div className="gauge-container">
        <div className="gauge-ring">
          <svg viewBox="0 0 120 120">
            <circle className="gauge-bg" cx="60" cy="60" r="48" />
            <circle
              className="gauge-fill"
              cx="60"
              cy="60"
              r="48"
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="gauge-value" style={{ color }}>
            {safeVal.toFixed(1)}
            <span style={{ fontSize: '0.6rem', marginLeft: '1px' }}>{unit}</span>
          </div>
        </div>
        <div className="gauge-label">{label}</div>
      </div>
    </div>
  );
}
