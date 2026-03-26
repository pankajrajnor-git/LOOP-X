import React, { useState } from 'react';
import { MessageSquare, X, Terminal, Server, Shield, RefreshCw, GitBranch, Database, AlertOctagon } from 'lucide-react';

export default function ChatbotWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([
    { role: 'bot', text: 'LOOP X Assistant online. Select an action to execute.' }
  ]);

  const executeAction = (actionName, simulateText) => {
    setLogs(prev => [...prev, { role: 'user', text: `Execute: ${actionName}` }]);
    setTimeout(() => {
      setLogs(prev => [...prev, { role: 'bot', text: simulateText }]);
    }, 600);
  };

  const actions = [
    { id: 'restart', icon: <RefreshCw size={14}/>, label: 'Server Restart', text: 'Initiating rolling restart across web nodes... Success.' },
    { id: 'github', icon: <GitBranch size={14}/>, label: 'GitHub Checks', text: 'Running tests on main branch... All 143 checks passed.' },
    { id: 'deploy', icon: <Server size={14}/>, label: 'Live Deployments', text: 'Checking deployment pipeline... Version v2.4.1 is stable.' },
    { id: 'logs', icon: <Terminal size={14}/>, label: 'Fetch Core Logs', text: 'Tailing core engine logs... No critical errors found in last 1hr.' },
    { id: 'security', icon: <Shield size={14}/>, label: 'Run Security Updates', text: 'Applying latest CVE patches to the kernel... Patched 4 packages.' },
    { id: 'dbHealth', icon: <Database size={14}/>, label: 'Database Integrity', text: 'Running DB checksums... Replica sync is 100%. Latency 2ms.' },
    { id: 'traffic', icon: <AlertOctagon size={14}/>, label: 'Scan Suspicious Traffic', text: 'Analyzing packet drops... Blocked 12 malicious IPs automatically.' },
  ];

  if (!isOpen) {
    return (
      <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="chatbot-window card">
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="#38bdf8" />
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>LOOP X Assistant</span>
        </div>
        <button className="chatbot-close" onClick={() => setIsOpen(false)}><X size={16}/></button>
      </div>

      <div className="chatbot-messages">
        {logs.map((L, i) => (
          <div key={i} className={`chat-bubble ${L.role}`}>
            {L.text}
          </div>
        ))}
      </div>

      <div className="chatbot-actions">
        {actions.map(a => (
          <button key={a.id} className="chatbot-action-btn" onClick={() => executeAction(a.label, a.text)}>
            {a.icon} {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
