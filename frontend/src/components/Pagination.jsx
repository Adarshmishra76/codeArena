import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Builds a compact page list with ellipses, e.g. 1 … 4 5 6 … 12 */
function getPageList(current, total) {
  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= total; p += 1) {
    if (p === 1 || p === total || Math.abs(p - current) <= windowSize) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return pages;
}

function Pagination({ page, totalPages, totalItems, pageSize, onChange }) {
  if (totalItems === 0) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);
  const pages = getPageList(page, totalPages);

  return (
    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-xs text-[var(--ca-text-muted)]">
        Showing <span className="text-[var(--ca-text-secondary)]">{rangeStart}–{rangeEnd}</span> of{' '}
        <span className="text-[var(--ca-text-secondary)]">{totalItems}</span>
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--ca-text-secondary)] transition-colors duration-150 hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)] disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </button>

          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-[var(--ca-text-muted)]">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 ca-font-display text-[13px] transition-colors duration-150 ${
                  p === page
                    ? 'bg-[var(--ca-accent)] text-white'
                    : 'text-[var(--ca-text-secondary)] hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)]'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onChange(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--ca-text-secondary)] transition-colors duration-150 hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)] disabled:pointer-events-none disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </nav>
      )}
    </div>
  );
}

export default Pagination;
