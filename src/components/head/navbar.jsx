import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Send, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import UserMenu from './usermenu';

const NAV_LINKS = [
  { label: 'New in', to: '/designs' },
  { label: 'Designs', to: '/designs' },
  { label: 'Designers', to: '/designer' },
  { label: 'Custom', to: '/designs?type=CUSTOM' },
];

const SEARCH_LINKS = [
  { label: 'New in', to: '/designs' },
  { label: 'Custom atelier', to: '/designs?type=CUSTOM' },
  { label: 'Womenswear', to: '/designs?category=Womenswear' },
  { label: 'Menswear', to: '/designs?category=Menswear' },
  { label: 'Designers', to: '/designer' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/designs?q=${encodeURIComponent(term)}` : '/designs');
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <>
      <div className="bg-brand text-ink">
        <p className="container-shop flex h-8 items-center justify-center text-center text-[9px] font-medium uppercase tracking-[0.2em] sm:text-[10px]">
          Complimentary fit consultation on every custom order
          <span className="mx-3 hidden text-ink/40 sm:inline">/</span>
          <span className="hidden sm:inline">Made to order in India</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="container-shop">
          <div className="relative flex h-16 items-center justify-between md:grid md:h-[72px] md:grid-cols-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="p-1 text-ink md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>

              <Link to="/" className="group flex items-baseline gap-1 text-ink" aria-label="StytchUp home">
                <span className="font-display text-[26px] leading-none tracking-[0.08em] md:text-[28px]">STYTCHUP</span>
                <span className="mb-0.5 hidden h-1 w-1 bg-brand sm:block" aria-hidden="true" />
              </Link>
            </div>

            <nav className="hidden items-center justify-center gap-8 md:flex" aria-label="Primary">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`link-line text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-ink ${
                    index === 0 ? 'text-ink' : 'text-ink/65'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen((open) => !open)}
                className="p-2 text-ink transition-colors hover:text-ink/50"
                aria-label={searchOpen ? 'Close search' : 'Search'}
                aria-expanded={searchOpen}
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </button>

              <UserMenu />

              <Link
                to="/orders"
                className="p-2 text-ink transition-colors hover:text-ink/50"
                aria-label="Orders"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </Link>

              <Link
                to="/inbox"
                className="p-2 text-ink transition-colors hover:text-ink/50"
                aria-label="Inbox"
              >
                <Send className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line bg-paper animate-fade">
            <div className="container-shop py-8 md:py-10">
              <form onSubmit={handleSearch} className="flex items-center gap-4 border-b border-ink pb-3">
                <Search className="h-5 w-5 shrink-0 text-ink/40" strokeWidth={1.4} />
                <label htmlFor="site-search" className="sr-only">
                  Search designs and designers
                </label>
                <input
                  id="site-search"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search designs, designers, categories"
                  className="w-full border-0 bg-transparent text-lg text-ink placeholder:text-ink/30 focus:outline-none focus:ring-0 md:text-2xl md:font-display"
                />
                <button type="submit" className="btn shrink-0 px-5 py-2.5">
                  Search
                </button>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="eyebrow">Suggested</span>
                {SEARCH_LINKS.map((link) => (
                  <Link key={link.label} to={link.to} className="link-line text-[11px] uppercase tracking-[0.14em] text-ink/65 hover:text-ink">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <span className="font-display text-[24px] tracking-[0.08em]">STYTCHUP</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="p-2" aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-8" aria-label="Mobile">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="block border-b border-line py-4 font-display text-3xl tracking-[-0.01em] text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-10 space-y-3">
              {[
                { label: 'Orders', to: '/orders' },
                { label: 'Inbox', to: '/inbox' },
                { label: 'Account settings', to: '/account-settings' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-line pt-6">
              {user ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-[11px] text-ink/45">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-[10px] uppercase tracking-[0.18em] text-ink/50 underline underline-offset-4"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn w-full">
                  Log in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
