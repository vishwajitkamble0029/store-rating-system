import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        className="btn-secondary px-3 py-1.5"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      {pages.map((p, idx) => (
        <React.Fragment key={p}>
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-2 text-gray-400">…</span>}
          <button
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              p === page ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {p}
          </button>
        </React.Fragment>
      ))}
      <button
        className="btn-secondary px-3 py-1.5"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
