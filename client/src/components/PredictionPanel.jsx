import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronDown, ChevronRight, BrainCircuit } from 'lucide-react';

export default function PredictionPanel({ predictions }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!predictions || predictions.length === 0) {
    return (
      <div className="card" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <BrainCircuit size={16} />
            Predictive Engine
          </div>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </div>
        {!isCollapsed && (
          <div className="empty-state">
            <Minus size={40} />
            <p>Collecting data for predictions...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div 
        className="card-header" 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        style={{ cursor: 'pointer', marginBottom: isCollapsed ? 0 : '10px' }}
      >
        <div className="card-title">
          <BrainCircuit size={16} color="#c084fc" />
          Predictive Engine
        </div>
        {isCollapsed ? <ChevronRight size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
      </div>
      
      {!isCollapsed && predictions.map((pred, idx) => (
        <div key={idx} className={`prediction-item ${pred.breach_predicted ? 'breach' : ''}`}>
          <div className="prediction-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="prediction-metric">{pred.metric}</span>
            <span className={`prediction-trend ${pred.trend}`}>
              {pred.trend === 'rising' && <TrendingUp size={12} style={{ marginRight: 4 }} />}
              {pred.trend === 'falling' && <TrendingDown size={12} style={{ marginRight: 4 }} />}
              {pred.trend === 'stable' && <Minus size={12} style={{ marginRight: 4 }} />}
              {pred.trend}
            </span>
          </div>
          <div className="prediction-details" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div className="prediction-stat">
              <span className="prediction-stat-label" style={{ display: 'block' }}>Current</span>
              <span className="prediction-stat-value">{pred.current_value}%</span>
            </div>
            <div className="prediction-stat" style={{ textAlign: 'center' }}>
              <span className="prediction-stat-label" style={{ display: 'block' }}>Moving Avg</span>
              <span className="prediction-stat-value">{pred.moving_average}%</span>
            </div>
            <div className="prediction-stat" style={{ textAlign: 'right' }}>
              <span className="prediction-stat-label" style={{ display: 'block' }}>Rate</span>
              <span className="prediction-stat-value">{pred.rate_per_interval}%/s</span>
            </div>
          </div>
          {pred.breach_predicted && pred.warning && (
            <div className="prediction-warning">
              <AlertTriangle size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              {pred.warning}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
