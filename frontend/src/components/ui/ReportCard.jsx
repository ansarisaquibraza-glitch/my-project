// frontend/src/components/ui/ReportCard.jsx
import StatusBadge from './StatusBadge';
import { formatDate, damageEmoji, capitalize, truncate } from '../../utils/helpers';

const ReportCard = ({ report, onClick }) => {
  return (
    <div
      className="glass-card"
      style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={() => onClick?.(report)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Image */}
      {report.image_url && (
        <div style={{ marginBottom: '0.875rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '160px' }}>
          <img
            src={report.image_url}
            alt="Road damage"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
        <span className={`damage-pill damage-${report.damage_type}`}>
          {damageEmoji[report.damage_type]} {capitalize(report.damage_type)}
        </span>
        <StatusBadge status={report.status} />
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
        {truncate(report.description, 100)}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>📍 {truncate(report.address || `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`, 30)}</span>
        <span>{formatDate(report.created_at)}</span>
      </div>
    </div>
  );
};

export default ReportCard;
