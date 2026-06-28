import React from 'react';

const Pagination = ({ page, totalPages, onPageChange, totalItems, pageSize = 10 }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-3 mt-2">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{from}</span>–<span className="font-medium">{to}</span> of{' '}
        <span className="font-medium">{totalItems}</span> items
      </p>
      <div className="flex items-center gap-1">
        <button
          className="btn-icon text-gray-500 hover:text-gray-800 disabled:opacity-30"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {start > 1 && (
          <>
            <PageBtn num={1} current={page} onClick={onPageChange} />
            {start > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {pages.map((p) => (
          <PageBtn key={p} num={p} current={page} onClick={onPageChange} />
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
            <PageBtn num={totalPages} current={page} onClick={onPageChange} />
          </>
        )}

        <button
          className="btn-icon text-gray-500 hover:text-gray-800 disabled:opacity-30"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
};

const PageBtn = ({ num, current, onClick }) => (
  <button
    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
      num === current
        ? 'bg-primary-800 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={() => onClick(num)}
  >
    {num}
  </button>
);

export default Pagination;
