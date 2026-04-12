// frontend/src/components/map/LocationPicker.jsx
// Allows user to click on the map to set report coordinates

import { useEffect, useRef } from 'react';
import L from 'leaflet';

const LocationPicker = ({ lat, lng, onChange, height = '300px' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const initialLat = lat || 19.076;
    const initialLng = lng || 72.8777;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Place initial marker if coordinates exist
    if (lat && lng) {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapInstanceRef.current);
      markerRef.current.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        onChange({ lat: pos.lat, lng: pos.lng });
      });
    }

    // Click on map to set/move marker
    mapInstanceRef.current.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng]);
      } else {
        markerRef.current = L.marker([clickLat, clickLng], { draggable: true }).addTo(mapInstanceRef.current);
        markerRef.current.on('dragend', (ev) => {
          const pos = ev.target.getLatLng();
          onChange({ lat: pos.lat, lng: pos.lng });
        });
      }
      onChange({ lat: clickLat, lng: clickLng });
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line

  // Update marker when lat/lng props change from geolocation
  useEffect(() => {
    if (!mapInstanceRef.current || !lat || !lng) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapInstanceRef.current);
      markerRef.current.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        onChange({ lat: pos.lat, lng: pos.lng });
      });
    }
    mapInstanceRef.current.setView([lat, lng], 15);
  }, [lat, lng]); // eslint-disable-line

  return (
    <div>
      <div
        ref={mapRef}
        style={{ height, width: '100%', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)' }}
      />
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
        🖱️ Click on the map to set location · Drag the pin to adjust
      </p>
    </div>
  );
};

export default LocationPicker;
