// frontend/src/components/charts/StatsCards.jsx
const cards = [
  { key: 'total',       label: 'Total Reports', icon: '📋', color: 'var(--primary)',          bg: 'rgba(37,99,235,0.08)'   },
  { key: 'pending',     label: 'Pending',        icon: '⏳', color: 'var(--status-pending)',   bg: 'rgba(245,158,11,0.08)'  },
  { key: 'in_progress', label: 'In Progress',    icon: '🔧', color: 'var(--status-progress)',  bg: 'rgba(59,130,246,0.08)'  },
  { key: 'resolved',    label: 'Resolved',       icon: '✅', color: 'var(--status-resolved)',  bg: 'rgba(16,185,129,0.08)'  },
];

const StatsCards = ({ stats = {} }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
    {cards.map(({ key, label, icon, color, bg }) => (
      <div
        key={key}
        className="glass-card stat-card"
        style={{ background: bg, borderLeft: `3px solid ${color}` }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
        <div className="stat-value" style={{ color }}>{stats[key] ?? '—'}</div>
        <div className="stat-label" style={{ color }}>{label}</div>
      </div>
    ))}
  </div>
);

export default StatsCards;
