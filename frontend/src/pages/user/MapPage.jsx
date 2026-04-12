// frontend/src/pages/user/MapPage.jsx
import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import ReportsMap from '../../components/map/ReportsMap';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { damageEmoji, capitalize, damageColor, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DAMAGE_TYPES = ['', 'pothole', 'crack', 'flooding', 'collapse', 'other'];

const MapPage = () => {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [typeF, setTypeF]       = useState('');
  const [statusF, setStatusF]   = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    reportsAPI.getAll({ limit: 500, damage_type: typeF, status: statusF })
      .then(({ data }) => setReports(data))
      .catch(() => toast.error('Failed to load map data'))
      .finally(() => setLoading(false));
  }, [typeF, statusF]);

  // Legend items
  const legend = DAMAGE_TYPES.filter(Boolean).map((t) => ({ type: t, color: damageColor[t] }));

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="page-header" style={{ margin: 0 }}>
            <h1 className="page-title">🗺️ Live Damage Map</h1>
            <p className="page-subtitle">{reports.length} reports across the city</p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={typeF}
              onChange={(e) => setTypeF(e.target.value)}
              style={{ width: '150px', margin: 0 }}
            >
              {DAMAGE_TYPES.map((t) => (
                <option key={t} value={t}>{t ? `${damageEmoji[t]} ${capitalize(t)}` : 'All Types'}</option>
              ))}
            </select>
            <select
              className="form-select"
              value={statusF}
              onChange={(e) => setStatusF(e.target.value)}
              style={{ width: '150px', margin: 0 }}
            >
              <option value="">All Statuses</option>
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">🔵 In Progress</option>
              <option value="resolved">🟢 Resolved</option>
            </select>
          </div>
        </div>

        {/* Map */}
        <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
          {loading ? (
            <div className="loading-container" style={{ height: '520px' }}>
              <div className="spinner" /><p>Loading map data...</p>
            </div>
          ) : (
            <ReportsMap
              reports={reports}
              height="520px"
              onMarkerClick={setSelected}
            />
          )}
        </div>

        {/* Legend */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legend:</span>
          {legend.map(({ type, color }) => (
            <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {damageEmoji[type]} {capitalize(type)}
            </span>
          ))}
        </div>
      </div>

      {/* Marker Click Detail */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Report Details">
        {selected && (
          <div>
            {selected.image_url && (
              <img src={selected.image_url} alt="damage" style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: '220px', objectFit: 'cover', marginBottom: '1rem' }} />
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
              <span className={`damage-pill damage-${selected.damage_type}`}>
                {damageEmoji[selected.damage_type]} {capitalize(selected.damage_type)}
              </span>
              <StatusBadge status={selected.status} />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {selected.description}
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.4rem' }}>
              {selected.address && <span>📍 {selected.address}</span>}
              <span>👤 Reported by: {selected.reporter_name}</span>
              <span>📅 {formatDate(selected.created_at)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapPage;
