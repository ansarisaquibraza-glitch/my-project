// frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import StatsCards from '../../components/charts/StatsCards';
import DamageTypeChart from '../../components/charts/DamageTypeChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    reportsAPI.getStats()
      .then(({ data }) => setStatsData(data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-container"><div className="spinner" /><p>Loading dashboard...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">⚙️ Admin Dashboard</h1>
          <p className="page-subtitle">Overview of all road damage reports across the system.</p>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: '2rem' }}>
          <StatsCards stats={statsData?.stats} />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              🍩 Damage Type Distribution
            </h3>
            <DamageTypeChart byType={statsData?.byType || {}} />
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              📈 Monthly Report Trend
            </h3>
            <MonthlyTrendChart monthly={statsData?.monthly || {}} />
          </div>
        </div>

        {/* Resolution Rate Banner */}
        {statsData?.stats?.total > 0 && (
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(37,99,235,0.06))', borderLeft: '3px solid var(--status-resolved)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--status-resolved)', lineHeight: 1 }}>
                  {Math.round((statsData.stats.resolved / statsData.stats.total) * 100)}%
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--status-resolved)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Resolution Rate
                </div>
              </div>
              <div style={{ height: 48, width: 1, background: 'var(--border)' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{statsData.stats.resolved}</strong> out of{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{statsData.stats.total}</strong> reports have been resolved.
                  {' '}<strong style={{ color: 'var(--status-pending)' }}>{statsData.stats.pending}</strong> are still pending action.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
