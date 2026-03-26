import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Globe, ChevronDown, ChevronRight } from 'lucide-react';

export default function TrafficChart({ history }) {
  // Set to false by default so hero charts are visible
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!history || history.length === 0) return (
    <div className="card" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <div className="card-title">
          <Globe size={16} />
          Network Traffic
        </div>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </div>
      {!isCollapsed && <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>Waiting for data...</div>}
    </div>
  );

  const data = history.map(h => ({
    timestamp: h.timestamp,
    Sent: h.network_sent,
    Received: h.network_recv
  }));

  return (
    <div className="card">
      <div 
        className="card-header" 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        style={{ cursor: 'pointer', marginBottom: isCollapsed ? 0 : '10px' }}
      >
        <div className="card-title">
          <Globe size={16} color="#38bdf8" />
          Network Traffic
        </div>
        {isCollapsed ? <ChevronRight size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
      </div>
      
      {!isCollapsed && (
        <div className="chart-container" style={{ height: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRecv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#6b7280" fontSize={10} tickFormatter={(tick) => {
                const d = new Date(tick);
                return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
              }} />
              <YAxis stroke="#6b7280" fontSize={10} hide />
              <Tooltip 
                contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '0.8rem', fontWeight: 600 }}
              />
              <Area isAnimationActive={false} type="monotone" dataKey="Received" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRecv)" />
              <Area isAnimationActive={false} type="monotone" dataKey="Sent" stroke="#a78bfa" fillOpacity={1} fill="url(#colorSent)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
