// frontend/src/pages/admin/AdminReports.jsx
// Full admin table with status editing, deletion, export

import { useState } from 'react';
import useReports from '../../hooks/useReports';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { reportsAPI } from '../../services/api';
import { formatDate, damageEmoji, capitalize, truncate, downloadJSON } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'in_progress', 'resolved', 'rejected'];

const AdminReports = () => {
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState('');
  const [typeF, setTypeF]       = useState('');
  const [editModal, setEditModal] = useState(null); // report being edited
  const [editForm, setEditForm]   = useState({ status: '', admin_notes: '' });
  const [saving, setSaving]       = useState(false);
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const { reports, pagination, loading, updateParams, setPage, deleteReport, updateStatus, refetch } = useReports({
    search: debouncedSearch,
    status: statusF,
    damage_type: typeF,
    limit: 15,
  });

  const openEdit = (report) => {
    setEditForm({ status: report.status, admin_notes: report.admin_notes || '' });
    setEditModal(report);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStatus(editModal.id, editForm.status, editForm.admin_notes);
      setEditModal(null);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await reportsAPI.export();
      downloadJSON(data, `smartroad-reports-${Date.now()}.json`);
      toast.success('✅ Exported successfully');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="page-header" style={{ margin: 0 }}>
            <h1 className="page-title">📋 Manage Reports</h1>
            <p className="page-subtitle">{pagination.total} total reports in the system</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Exporting...' : '⬇️ Export JSON'}
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '180px' }}>
            <span className="search-icon">🔍</span>
            <input
              className="form-input search-input"
              placeholder="Search by name, description, address..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); updateParams({ search: e.target.value }); }}
              style={{ margin: 0 }}
            />
          </div>
          <select className="form-select" value={statusF} onChange={(e) => { setStatusF(e.target.value); updateParams({ status: e.target.value }); }} style={{ width: 150, margin: 0 }}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
          </select>
          <select className="form-select" value={typeF} onChange={(e) => { setTypeF(e.target.value); updateParams({ damage_type: e.target.value }); }} style={{ width: 150, margin: 0 }}>
            <option value="">All Types</option>
            {['pothole','crack','flooding','collapse','other'].map((t) => (
              <option key={t} value={t}>{damageEmoji[t]} {capitalize(t)}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{r.reporter_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.reporter_email}</div>
                        </td>
                        <td>
                          <span className={`damage-pill damage-${r.damage_type}`}>
                            {damageEmoji[r.damage_type]} {capitalize(r.damage_type)}
                          </span>
                        </td>
                        <td style={{ maxWidth: '220px' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{truncate(r.description, 70)}</span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '140px' }}>
                          {truncate(r.address || `${r.latitude?.toFixed(4)},${r.longitude?.toFixed(4)}`, 30)}
                        </td>
                        <td><StatusBadge status={r.status} /></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(r.created_at)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)} title="Edit status">✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(r)} title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Edit Status Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Update Report Status">
        {editModal && (
          <div>
            <div style={{ padding: '0.875rem', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>{capitalize(editModal.damage_type)} — {editModal.reporter_name}</strong>
              {truncate(editModal.description, 120)}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Admin Notes (optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Add notes for the reporter..."
                value={editForm.admin_notes}
                onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Saving...' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm Delete">
        {confirmDelete && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this <strong>{capitalize(confirmDelete.damage_type)}</strong> report by{' '}
              <strong>{confirmDelete.reporter_name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  await deleteReport(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                🗑️ Delete Report
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminReports;
