import { SearchX } from 'lucide-react';
import ProblemRow from './ProblemRow';

function ProblemList({ problems, getStatus, startIndex }) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-[var(--ca-border)] bg-[var(--ca-surface)] px-6 py-16 text-center">
        <SearchX size={22} className="text-[var(--ca-text-muted)]" />
        <p className="text-sm font-medium text-[var(--ca-text-primary)]">No problems match your filters</p>
        <p className="text-xs text-[var(--ca-text-muted)]">Try clearing a filter or searching a different term.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--ca-border)] bg-[var(--ca-surface)]">
      {problems.map((problem, i) => (
        <ProblemRow
          key={problem._id}
          index={startIndex + i}
          problem={problem}
          status={getStatus(problem)}
        />
      ))}
    </div>
  );
}

export default ProblemList;
