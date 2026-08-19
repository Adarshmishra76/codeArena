import { useState } from 'react';
import { NavLink } from 'react-router';
import { Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';

const NAV_LINKS = [
  { label: 'Problems', to: '/' },
  { label: 'Contest', to: '/contest' },
  { label: 'Discuss', to: '/discuss' },
  { label: 'Leaderboard', to: '/leaderboard' },
];

/**
 * Sticky top navigation. Shows Sign In / Sign Up when logged out,
 * or the current user's name (via UserMenu) when logged in.
 */
function Navbar({ isAuthenticated, user, onLogout, onToggleMobileFilters }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--ca-border)] bg-[var(--ca-bg-elevated)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--ca-bg-elevated)]/80">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        {/* Brand */}
        <NavLink to="/" className="flex shrink-0 items-center gap-2 ca-font-display text-[15px] font-semibold tracking-tight text-[var(--ca-text-primary)]">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[13px] text-[var(--ca-accent)]"
            style={{ boxShadow: '0 0 0 1px var(--ca-accent-border), 0 0 14px -4px var(--ca-accent)' }}
          >
            ◈
          </span>
          CodeArena
        </NavLink>

        {/* Primary nav links */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-[var(--ca-text-primary)]'
                    : 'text-[var(--ca-text-secondary)] hover:text-[var(--ca-text-primary)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Mobile: filters trigger (only meaningful on the Problems page) */}
        {onToggleMobileFilters && (
          <button
            type="button"
            onClick={onToggleMobileFilters}
            className="mr-1 inline-flex items-center gap-1.5 rounded-lg border border-[var(--ca-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--ca-text-secondary)] transition-colors duration-150 hover:text-[var(--ca-text-primary)] lg:hidden"
          >
            <Menu size={14} />
            Filters
          </button>
        )}

        {/* Right side: auth-aware */}
        <div className="hidden items-center gap-2 sm:flex">
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={onLogout} />
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--ca-text-secondary)] transition-colors duration-150 hover:text-[var(--ca-text-primary)]"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-lg bg-[var(--ca-accent)] px-3.5 py-1.5 text-sm font-medium text-white shadow-sm shadow-black/20 transition-opacity duration-150 hover:opacity-90"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile nav toggle */}
        <button
          type="button"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--ca-border)] p-1.5 text-[var(--ca-text-secondary)] sm:hidden"
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {mobileNavOpen && (
        <div className="border-t border-[var(--ca-border)] bg-[var(--ca-bg-elevated)] px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-[var(--ca-text-secondary)] hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)]"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-2 border-t border-[var(--ca-border-soft)] pt-3">
            {isAuthenticated ? (
              <UserMenu user={user} onLogout={onLogout} />
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex-1 rounded-lg border border-[var(--ca-border)] px-3 py-2 text-center text-sm font-medium text-[var(--ca-text-primary)]"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="flex-1 rounded-lg bg-[var(--ca-accent)] px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
