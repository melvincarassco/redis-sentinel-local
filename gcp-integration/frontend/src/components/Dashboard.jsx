import React from 'react';
import { TrendingUp, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import ReviewCard from './ReviewCard';
import './Dashboard.css';

const mockReviews = [
  {
    id: 1,
    text: "The new wireless earbuds are decent, but the battery life is much shorter than advertised. It dies after 3 hours. Also, the case feels a bit cheap.",
    sentiment: "Negative",
    urgency: "High",
    entities: ["Battery Life", "Build Quality"]
  },
  {
    id: 2,
    text: "Absolutely love the fast shipping! The UI on the noon app made it so easy to find what I needed. Will definitely order again.",
    sentiment: "Positive",
    urgency: "Low",
    entities: ["Shipping", "App UX"]
  },
  {
    id: 3,
    text: "I want a feature where I can track my refund status in real-time. Right now, it just says 'processing' for days and I have to call support.",
    sentiment: "Neutral",
    urgency: "Medium",
    entities: ["Refunds", "Feature Request"]
  }
];

export default function Dashboard() {
  return (
    <div className="dashboard-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
      
      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Total Reviews Analyzed</span>
            <div className="icon-wrapper blue"><MessageSquare size={18} /></div>
          </div>
          <div className="metric-value">12,482</div>
          <div className="metric-trend positive">
            <TrendingUp size={16} />
            <span>+14% from last week</span>
          </div>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Average Sentiment</span>
            <div className="icon-wrapper purple"><Sparkles size={18} /></div>
          </div>
          <div className="metric-value">68% Positive</div>
          <div className="metric-progress-bar">
            <div className="progress-fill" style={{ width: '68%' }}></div>
          </div>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Critical Issues</span>
            <div className="icon-wrapper red"><AlertCircle size={18} /></div>
          </div>
          <div className="metric-value">34</div>
          <div className="metric-trend negative">
            <TrendingUp size={16} />
            <span>+2% from last week</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <div className="reviews-section glass-panel">
          <div className="section-header">
            <h2>Recent AI Inferences</h2>
            <p>Live stream of reviews processed by Vertex AI</p>
          </div>
          
          <div className="reviews-list">
            {mockReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} delay={index * 0.1} />
            ))}
          </div>
        </div>
        
        <div className="side-panel">
          <div className="keywords-section glass-panel">
            <div className="section-header">
              <h2>Top Entities</h2>
            </div>
            <div className="keywords-list">
              <div className="keyword-item">
                <span>Shipping Speed</span>
                <span className="keyword-count">1,204</span>
              </div>
              <div className="keyword-item">
                <span>Battery Life</span>
                <span className="keyword-count">845</span>
              </div>
              <div className="keyword-item">
                <span>App Checkout</span>
                <span className="keyword-count">622</span>
              </div>
              <div className="keyword-item">
                <span>Refund Process</span>
                <span className="keyword-count">431</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
