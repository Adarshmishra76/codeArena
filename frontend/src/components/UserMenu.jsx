import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';

/**
 * Logged-in user control shown on the right side of the navbar.
 * Displays only the user's name (never alongside Sign In / Sign Up).
 */
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.firstName || user?.name || 'Account';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-medium text-[var(--ca-text-primary)] transition-colors duration-150 hover:border-[var(--ca-border)] hover:bg-[var(--ca-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-accent)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ca-accent-soft)] text-[var(--ca-accent)]">
          <UserRound size={15} strokeWidth={2.25} />
        </span>
        <span className="hidden sm:inline">{displayName}</span>
        <ChevronDown
          size={15}
          className={`hidden text-[var(--ca-text-muted)] transition-transform duration-150 sm:inline ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-48 overflow-hidden rounded-xl border border-[var(--ca-border)] bg-[var(--ca-surface)] py-1.5 shadow-xl shadow-black/40"
        >
          <div className="border-b border-[var(--ca-border-soft)] px-3.5 py-2.5">
            <p className="truncate text-sm font-medium text-[var(--ca-text-primary)]">{displayName}</p>
            <p className="truncate text-xs text-[var(--ca-text-muted)]">{user?.emailId || user?.email || 'Signed in'}</p>
          </div>

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="flex items-center gap-2 px-3.5 py-2 text-sm text-[var(--ca-text-secondary)] transition-colors duration-150 hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-text-primary)]"
              onClick={() => setOpen(false)}
            >
              <ShieldCheck size={15} />
              Admin panel
            </NavLink>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-[var(--ca-text-secondary)] transition-colors duration-150 hover:bg-[var(--ca-surface-hover)] hover:text-[var(--ca-hard)]"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
