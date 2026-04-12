// frontend/src/utils/helpers.js

/** Format ISO date string to readable format */
export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/** Format ISO date with time */
export const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Capitalize first letter */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');

/** Damage type emoji map */
export const damageEmoji = {
  pothole: '🕳️',
  crack: '〰️',
  flooding: '🌊',
  collapse: '⚠️',
  other: '🔧',
};

/** Damage type color for markers */
export const damageColor = {
  pothole: '#ef4444',
  crack: '#f59e0b',
  flooding: '#3b82f6',
  collapse: '#8b5cf6',
  other: '#6b7280',
};

/** Status icon map */
export const statusIcon = {
  pending: '🟡',
  in_progress: '🔵',
  resolved: '🟢',
  rejected: '🔴',
};

/** Get user's current GPS coordinates */
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(`Location error: ${err.message}`)),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

/** Truncate long text */
export const truncate = (str, max = 80) =>
  str?.length > max ? str.slice(0, max) + '...' : str;

/** Download JSON data as a file */
export const downloadJSON = (data, filename = 'export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
