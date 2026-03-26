import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, ChevronDown, ChevronRight } from 'lucide-react';

export default function MetricsChart({ history }) {
  // Set to false by default so hero charts are visible
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!history || history.length === 0) return (
    <div className="card" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <div className="card-title">
          <Activity size={16} />
          System Metrics Live
        </div>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </div>
      {!isCollapsed && <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Waiting for data...</div>}
    </div>
  );

  return (
    <div className="card">
      <div 
        className="card-header" 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        style={{ cursor: 'pointer', marginBottom: isCollapsed ? 0 : '10px' }}
      >
        <div className="card-title">
          <Activity size={16} color="#34d399" />
          System Metrics Live
        </div>
        {isCollapsed ? <ChevronRight size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
      </div>
      
      {!isCollapsed && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#6b7280" fontSize={10} tickFormatter={(tick) => {
                const d = new Date(tick);
                return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
              }} />
              <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '0.8rem', fontWeight: 600 }}
              />
              <Line 
                isAnimationActive={false}
                type="monotone" dataKey="cpu" stroke="#38bdf8" 
                strokeWidth={2.5} dot={false} activeDot={{ r: 4 }}
              />
              <Line 
                isAnimationActive={false}
                type="monotone" dataKey="memory" stroke="#f43f5e" 
                strokeWidth={2.5} dot={false} activeDot={{ r: 4 }}
              />
              <Line 
                isAnimationActive={false}
                type="monotone" dataKey="disk" stroke="#34d399" 
                strokeWidth={2.5} dot={false} activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
