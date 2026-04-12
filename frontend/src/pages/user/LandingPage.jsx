// frontend/src/pages/user/LandingPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { reportsAPI } from '../../services/api';
import './LandingPage.css';

const features = [
  { icon: '📍', title: 'GPS Auto-Detection', desc: 'One tap to detect your exact location using device GPS.' },
  { icon: '📷', title: 'Photo Upload', desc: 'Attach images to help authorities understand the severity.' },
  { icon: '🗺️', title: 'Interactive Map', desc: 'See all reported damage across your city on a live map.' },
  { icon: '📊', title: 'Real-Time Tracking', desc: 'Track your report status from pending to resolved.' },
  { icon: '🔔', title: 'Status Updates', desc: 'Get notified when authorities update your report.' },
  { icon: '⚡', title: 'Fast & Reliable', desc: 'Built for speed — submit a report in under 60 seconds.' },
];

const LandingPage = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });

  useEffect(() => {
    reportsAPI.getStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero bg-gradient-hero">
        <div className="container hero-inner">
          <div className="hero-text fade-in">
            <span className="hero-badge">🇮🇳 Civic Tech Platform</span>
            <h1 className="hero-title">
              Report Road Damage.
              <span className="hero-title-accent"> Drive Change.</span>
            </h1>
            <p className="hero-sub">
              SmartRoad empowers citizens to report potholes, cracks, and road hazards
              directly to authorities — with real-time tracking and transparency.
            </p>
            <div className="hero-actions">
              <Link to="/report" className="btn btn-accent btn-lg">
                🚀 Report Damage Now
              </Link>
              <Link to="/map" className="btn btn-outline btn-lg">
                🗺️ View Live Map
              </Link>
            </div>
          </div>

          {/* Live Stats */}
          <div className="hero-stats slide-up">
            <div className="stats-card glass-card">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-text">Total Reports</div>
            </div>
            <div className="stats-card glass-card">
              <div className="stat-num" style={{ color: 'var(--status-resolved)' }}>{stats.resolved}</div>
              <div className="stat-text">Resolved</div>
            </div>
            <div className="stats-card glass-card">
              <div className="stat-num" style={{ color: 'var(--status-pending)' }}>{stats.pending}</div>
              <div className="stat-text">Pending</div>
            </div>
            <div className="stats-card glass-card">
              <div className="stat-num" style={{ color: 'var(--accent)' }}>
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </div>
              <div className="stat-text">Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why SmartRoad?</h2>
            <p className="section-sub">Everything you need to make your city's roads safer.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card glass-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', title: 'Spot Damage', desc: 'Notice a pothole, crack, or hazard on the road.', icon: '👀' },
              { step: '02', title: 'Submit Report', desc: 'Fill the quick form, upload a photo, pin the location.', icon: '📝' },
              { step: '03', title: 'We Notify Authorities', desc: 'Your report is instantly forwarded to city officials.', icon: '📨' },
              { step: '04', title: 'Track Progress', desc: 'Monitor real-time status updates until resolved.', icon: '✅' },
            ].map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-num">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card-heavy">
            <h2>Ready to make your roads safer?</h2>
            <p>Join thousands of citizens already improving city infrastructure.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/report" className="btn btn-accent btn-lg">
                📍 Report an Issue
              </Link>
              <Link to="/signup" className="btn btn-outline btn-lg">
                ✨ Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
