import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import ProblemList from '../components/ProblemList';
import Pagination from '../components/Pagination';

import { DIFFICULTIES, TOPICS, normalizeTag, DUMMY_PROBLEMS } from '../constants/problemFilters';

const PAGE_SIZE = 20;

const DIFFICULTY_OPTIONS = [{ value: 'all', label: 'All Difficulty' }, ...DIFFICULTIES];
const TAG_OPTIONS = [
  { value: 'all', label: 'All Tags' },
  ...TOPICS.map((topic) => ({ value: topic, label: topic })),
];
const STATUS_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'solved', label: 'Solved' },
  { value: 'unsolved', label: 'Unsolved' },
];

function Problems() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setProblems(data);
        } else {
          // Backend reachable but no problems yet — keep the UI usable for preview.
          setProblems(DUMMY_PROBLEMS);
          setUsingFallbackData(true);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        if (!cancelled) {
          setProblems(DUMMY_PROBLEMS);
          setUsingFallbackData(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/solvedAllProblembyUser');
        if (!cancelled && Array.isArray(data)) setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const solvedIds = useMemo(() => new Set(solvedProblems.map((sp) => sp._id)), [solvedProblems]);
  const getStatus = (problem) => (solvedIds.has(problem._id) ? 'solved' : 'unsolved');

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return problems.filter((problem) => {
      const difficultyMatch =
        filters.difficulty === 'all' || (problem.difficulty || '').toLowerCase() === filters.difficulty;
      const tagMatch = filters.tag === 'all' || normalizeTag(problem.tags) === normalizeTag(filters.tag);
      const status = solvedIds.has(problem._id) ? 'solved' : 'unsolved';
      const statusMatch = filters.status === 'all' || filters.status === status;
      const searchMatch = !query || problem.title?.toLowerCase().includes(query);
      return difficultyMatch && tagMatch && statusMatch && searchMatch;
    });
  }, [problems, filters, search, solvedIds]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageProblems = filteredProblems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Wrap the setters that change the result set so page resets to 1
  // immediately (avoids an extra render pass via a synchronizing effect).
  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const updateFilters = (nextFilters) => {
    setFilters(typeof nextFilters === 'function' ? nextFilters : () => nextFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--ca-bg)]">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onToggleMobileFilters={() => setMobileFiltersOpen(true)}
      />

      <div className="mx-auto flex max-w-[1400px] lg:items-start">
        <Sidebar
          filters={filters}
          onChange={updateFilters}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[var(--ca-text-primary)] sm:text-2xl">Problems</h1>
            <p className="mt-1 text-sm text-[var(--ca-text-secondary)]">
              Practice coding problems and improve your skills
            </p>
          </div>

          {usingFallbackData && (
            <div className="mb-4 rounded-lg border border-[var(--ca-accent-border)] bg-[var(--ca-accent-soft)] px-3.5 py-2 text-xs text-[var(--ca-text-secondary)]">
              Showing sample problems for preview — connect the backend to see your real problem set.
            </div>
          )}

          <div className="mb-4">
            <SearchBar value={search} onChange={updateSearch} />
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <FilterDropdown
              label="All Difficulty"
              options={DIFFICULTY_OPTIONS}
              value={filters.difficulty}
              onChange={(value) => updateFilters((prev) => ({ ...prev, difficulty: value }))}
            />
            <FilterDropdown
              label="Tags"
              options={TAG_OPTIONS}
              value={filters.tag}
              onChange={(value) => updateFilters((prev) => ({ ...prev, tag: value }))}
            />
            <FilterDropdown
              label="Status"
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={(value) => updateFilters((prev) => ({ ...prev, status: value }))}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-[var(--ca-border)] bg-[var(--ca-surface)] py-20">
              <span className="loading loading-spinner loading-md text-[var(--ca-accent)]" />
            </div>
          ) : (
            <>
              <ProblemList
                problems={pageProblems}
                getStatus={getStatus}
                startIndex={(safePage - 1) * PAGE_SIZE + 1}
              />
              <Pagination
                page={safePage}
                totalPages={totalPages}
                totalItems={filteredProblems.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Problems;
