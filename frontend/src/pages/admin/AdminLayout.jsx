// frontend/src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const links = [
  { to: '/admin',         label: 'Dashboard',  icon: '📊', end: true },
  { to: '/admin/reports', label: 'Reports',     icon: '📋' },
  { to: '/admin/map',     label: 'Map View',    icon: '🗺️' },
];

const AdminLayout = () => (
  <div className="admin-layout page-wrapper" style={{ paddingTop: 'var(--navbar-height)' }}>
    {/* Sidebar */}
    <aside className="admin-sidebar glass-card">
      <div className="sidebar-header">
        <span style={{ fontSize: '1.3rem' }}>⚙️</span>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Admin Panel</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Main content */}
    <main className="admin-main">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
