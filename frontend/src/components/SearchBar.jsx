import { Search, X } from 'lucide-react';

function SearchBar({ value, onChange }) {
  return (
    <div className="group relative">
      <Search
        size={17}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ca-text-muted)] transition-colors duration-150 group-focus-within:text-[var(--ca-accent)]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search problems..."
        className="w-full rounded-xl border border-[var(--ca-border)] bg-[var(--ca-surface)] py-3 pl-10 pr-10 text-sm text-[var(--ca-text-primary)] placeholder:text-[var(--ca-text-muted)] outline-none transition-all duration-150 focus:border-[var(--ca-accent-border)] focus:ring-2 focus:ring-[var(--ca-accent)]/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ca-text-muted)] transition-colors duration-150 hover:text-[var(--ca-text-primary)]"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
