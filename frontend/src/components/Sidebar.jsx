import { CheckCircle2, Circle, LayoutGrid, X } from 'lucide-react';
import { DIFFICULTIES, TOPICS, normalizeTag } from '../constants/problemFilters';

const SECTION_LABEL = 'mb-2.5 px-1 text-[11px] font-semibold tracking-[0.08em] text-[var(--ca-text-muted)]';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', icon: LayoutGrid },
  { value: 'solved', label: 'Solved', icon: CheckCircle2 },
  { value: 'unsolved', label: 'Unsolved', icon: Circle },
];

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-150 ${
        active
          ? 'bg-[var(--ca-accent-soft)] text-[var(--ca-text-primary)]'
          : 'text-[var(--ca-text-secondary)] hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)]'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Filter sidebar. Same component renders as a fixed column on desktop
 * and as a slide-over drawer on mobile (controlled via `mobileOpen`).
 */
function Sidebar({ filters, onChange, mobileOpen, onCloseMobile }) {
  const content = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-5">
      {/* Problems */}
      <div>
        <p className={SECTION_LABEL}>PROBLEMS</p>
        <div className="flex flex-col gap-0.5">
          {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => (
            <FilterButton
              key={value}
              active={filters.status === value}
              onClick={() => onChange({ ...filters, status: value })}
            >
              <Icon size={15} strokeWidth={2.25} className="shrink-0" />
              {label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className={SECTION_LABEL}>DIFFICULTY</p>
        <div className="flex flex-col gap-0.5">
          {DIFFICULTIES.map(({ value, label, dot }) => (
            <FilterButton
              key={value}
              active={filters.difficulty === value}
              onClick={() => onChange({ ...filters, difficulty: filters.difficulty === value ? 'all' : value })}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
              {label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div>
        <p className={SECTION_LABEL}>TOPICS</p>
        <div className="flex flex-col gap-0.5">
          {TOPICS.map((topic) => {
            const value = normalizeTag(topic);
            const active = normalizeTag(filters.tag) === value;
            return (
              <FilterButton
                key={topic}
                active={active}
                onClick={() => onChange({ ...filters, tag: active ? 'all' : topic })}
              >
                {topic}
              </FilterButton>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: sticky column */}
      <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[220px] shrink-0 border-r border-[var(--ca-border)] bg-[var(--ca-bg)] lg:block">
        {content}
      </aside>

      {/* Mobile: slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-[var(--ca-border)] bg-[var(--ca-bg-elevated)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--ca-border)] px-4 py-3.5">
              <span className="text-sm font-semibold text-[var(--ca-text-primary)]">Filters</span>
              <button type="button" onClick={onCloseMobile} className="text-[var(--ca-text-muted)] hover:text-[var(--ca-text-primary)]">
                <X size={18} />
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
