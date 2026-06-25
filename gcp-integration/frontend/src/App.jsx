import React from 'react';
import { LayoutDashboard, BarChart3, Settings, Activity } from 'lucide-react';
import './index.css';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="logo-container">
          <div className="logo-icon">
            <Activity size={24} color="white" />
          </div>
          <div className="logo-text">
            <span>noon</span>
            <span className="text-gradient"> Insights</span>
          </div>
        </div>
        
        <ul className="nav-links">
          <li className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </li>
          <li className="nav-item">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </li>
          <li className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="header-title">
            <h1>Product Intelligence</h1>
            <p>Real-time AI analysis of customer feedback</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary">
              Run Analysis
            </button>
          </div>
        </header>

        {/* Dashboard View */}
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
