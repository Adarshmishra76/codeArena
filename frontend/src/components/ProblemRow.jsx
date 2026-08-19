import { NavLink } from 'react-router';
import { ChevronRight } from 'lucide-react';

const DIFFICULTY_STYLES = {
  easy: { color: 'var(--ca-easy)', bg: 'var(--ca-easy-soft)', label: 'Easy' },
  medium: { color: 'var(--ca-medium)', bg: 'var(--ca-medium-soft)', label: 'Medium' },
  hard: { color: 'var(--ca-hard)', bg: 'var(--ca-hard-soft)', label: 'Hard' },
};

/** ✓ / ○ / ◐ status glyph, drawn as a small precise SVG rather than the raw characters. */
function StatusGlyph({ status }) {
  if (status === 'solved') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Solved">
        <circle cx="8" cy="8" r="7" fill="var(--ca-easy-soft)" stroke="var(--ca-easy)" strokeWidth="1.3" />
        <path d="M5 8.2l2 2 4-4.4" stroke="var(--ca-easy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'attempted') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="In progress">
        <circle cx="8" cy="8" r="7" stroke="var(--ca-accent)" strokeWidth="1.3" fill="none" />
        <path d="M8 1a7 7 0 010 14z" fill="var(--ca-accent)" opacity="0.85" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Unsolved">
      <circle cx="8" cy="8" r="7" stroke="var(--ca-text-muted)" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function ProblemRow({ index, problem, status }) {
  const difficultyKey = (problem.difficulty || 'easy').toLowerCase();
  const diff = DIFFICULTY_STYLES[difficultyKey] || DIFFICULTY_STYLES.easy;

  return (
    <NavLink
      to={`/problem/${problem._id}`}
      className="group flex items-center gap-3 border-b border-[var(--ca-border-soft)] px-3 py-3 text-sm transition-colors duration-150 last:border-b-0 hover:bg-[var(--ca-surface-hover)] sm:gap-4 sm:px-4"
    >
      <span className="shrink-0">
        <StatusGlyph status={status} />
      </span>

      <span className="w-6 shrink-0 ca-font-display text-[13px] text-[var(--ca-text-muted)] sm:w-8">
        {index}.
      </span>

      {/* Title + (mobile-only) meta stacked underneath */}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-[var(--ca-text-primary)] transition-colors duration-150 group-hover:text-[var(--ca-accent)]">
          {problem.title}
        </span>
        <span className="mt-1 flex items-center gap-2 sm:hidden">
          <span
            className="rounded-md px-1.5 py-0.5 text-[11px] font-medium"
            style={{ color: diff.color, backgroundColor: diff.bg }}
          >
            {diff.label}
          </span>
          <span className="truncate text-[11px] text-[var(--ca-text-muted)]">{problem.tags}</span>
        </span>
      </span>

      <span
        className="hidden shrink-0 rounded-md px-2 py-0.5 text-xs font-medium sm:inline-block"
        style={{ color: diff.color, backgroundColor: diff.bg }}
      >
        {diff.label}
      </span>

      <span className="hidden shrink-0 text-xs text-[var(--ca-text-muted)] md:inline-block md:w-32">
        {problem.tags}
      </span>

      <ChevronRight size={16} className="shrink-0 text-[var(--ca-text-muted)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--ca-text-primary)]" />
    </NavLink>
  );
}

export default ProblemRow;
