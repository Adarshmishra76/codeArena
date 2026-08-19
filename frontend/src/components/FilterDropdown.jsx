import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Generic dashboard-style filter dropdown.
 * `options` is an array of { value, label, dot? } — `dot` renders a small
 * colored indicator (used for difficulty).
 */
function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-accent)]/40 ${
          value !== 'all'
            ? 'border-[var(--ca-accent-border)] bg-[var(--ca-accent-soft)] text-[var(--ca-text-primary)]'
            : 'border-[var(--ca-border)] bg-[var(--ca-surface)] text-[var(--ca-text-secondary)] hover:border-[var(--ca-text-muted)] hover:text-[var(--ca-text-primary)]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selected.dot }} />}
        {selected?.label || label}
        <ChevronDown size={14} className={`text-[var(--ca-text-muted)] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-20 max-h-72 w-52 overflow-y-auto rounded-xl border border-[var(--ca-border)] bg-[var(--ca-surface)] py-1.5 shadow-xl shadow-black/40"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors duration-150 ${
                  value === opt.value
                    ? 'text-[var(--ca-accent)]'
                    : 'text-[var(--ca-text-secondary)] hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)]'
                }`}
              >
                {opt.dot && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: opt.dot }} />}
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterDropdown;
