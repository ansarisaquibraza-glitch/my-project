// frontend/src/components/ui/Pagination.jsx
const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Showing {start}–{end} of {total} results
      </p>
      <div className="pagination">
        <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
