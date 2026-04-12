// frontend/src/components/map/ReportsMap.jsx
// Interactive Leaflet map showing all reports with custom markers

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { damageColor, damageEmoji, capitalize, formatDate } from '../../utils/helpers';
import StatusBadge from '../ui/StatusBadge';

// Fix default icon path issue with Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Creates a custom SVG circle marker for a given damage type.
 */
const createMarkerIcon = (damageType) => {
  const color = damageColor[damageType] || '#6b7280';
  const emoji = damageEmoji[damageType] || '📍';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
      <circle cx="18" cy="18" r="18" fill="${color}" fill-opacity="0.2"/>
      <circle cx="18" cy="18" r="13" fill="${color}"/>
      <text x="18" y="23" text-anchor="middle" font-size="13">${emoji}</text>
      <path d="M18 36 L12 24 L24 24 Z" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44],
  });
};

const ReportsMap = ({ reports = [], center = [19.076, 72.8777], zoom = 11, height = '500px', onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize map once
  useEffect(() => {
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line

  // Update markers whenever reports change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    reports.forEach((report) => {
      if (!report.latitude || !report.longitude) return;

      const marker = L.marker([report.latitude, report.longitude], {
        icon: createMarkerIcon(report.damage_type),
      });

      marker.bindPopup(`
        <div style="min-width:200px; font-family: 'Poppins', sans-serif;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:1.2rem">${damageEmoji[report.damage_type]}</span>
            <strong style="font-size:0.95rem;color:#0f172a;">${capitalize(report.damage_type)}</strong>
          </div>
          <p style="font-size:0.82rem;color:#475569;margin-bottom:8px;line-height:1.4">${report.description?.slice(0, 100)}${report.description?.length > 100 ? '...' : ''}</p>
          <div style="display:flex;flex-direction:column;gap:4px;font-size:0.78rem;color:#94a3b8;">
            ${report.address ? `<span>📍 ${report.address}</span>` : ''}
            <span>👤 ${report.reporter_name}</span>
            <span>📅 ${formatDate(report.created_at)}</span>
          </div>
        </div>
      `);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(report));
      }

      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    // Fit map to markers if there are any
    if (reports.length > 0) {
      const validReports = reports.filter((r) => r.latitude && r.longitude);
      if (validReports.length > 0) {
        const bounds = L.latLngBounds(validReports.map((r) => [r.latitude, r.longitude]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [reports, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%', borderRadius: 'var(--radius-lg)', zIndex: 1 }}
    />
  );
};

export default ReportsMap;
