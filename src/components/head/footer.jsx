import { AtSign, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Newsletter from '../ui/Newsletter';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New in', to: '/designs' },
      { label: 'All designs', to: '/designs' },
      { label: 'Custom atelier', to: '/designs?type=CUSTOM' },
      { label: 'Womenswear', to: '/designs?category=Womenswear' },
      { label: 'Menswear', to: '/designs?category=Menswear' },
    ],
  },
  {
    title: 'Designers',
    links: [
      { label: 'The directory', to: '/designer' },
      { label: 'Become a designer', to: '/register' },
      { label: 'Designer dashboard', to: '/dashboard' },
      { label: 'How it works', to: '/' },
    ],
  },
  {
    title: 'Client care',
    links: [
      { label: 'Orders', to: '/orders' },
      { label: 'Inbox', to: '/inbox' },
      { label: 'Account settings', to: '/account-settings' },
      { label: 'Contact', to: '/inbox' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto">
      <Newsletter />

      <div className="bg-paper">
        <div className="container-shop grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-baseline gap-1 text-ink">
              <span className="font-display text-[30px] leading-none tracking-[0.08em]">STYTCHUP</span>
              <span className="mb-1 h-1 w-1 bg-brand" aria-hidden="true" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/50">
              A marketplace for made-to-order fashion. Independent designers, real measurements,
              pieces made once — for you.
            </p>
            <div className="mt-7 flex items-center gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink/45 transition-colors hover:text-ink"
                aria-label="Instagram"
              >
                <AtSign className="h-4 w-4" strokeWidth={1.4} />
              </a>
              <a href="mailto:hello@stytchup.com" className="text-ink/45 transition-colors hover:text-ink" aria-label="Email">
                <Mail className="h-4 w-4" strokeWidth={1.4} />
              </a>
              <Link to="/inbox" className="text-ink/45 transition-colors hover:text-ink" aria-label="Inbox">
                <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
              </Link>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="md:col-span-2">
              <h3 className="eyebrow mb-5">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[12px] text-ink/55 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <h3 className="eyebrow mb-5">Studio</h3>
            <p className="text-[12px] leading-relaxed text-ink/55">
              Made to order in India.
              <br />
              Ships worldwide.
            </p>
            <p className="mt-4 text-[12px] leading-relaxed text-ink/40">
              Mon–Fri
              <br />
              10:00–18:00 IST
            </p>
          </div>
        </div>

        <div className="overflow-hidden border-t border-line">
          <div className="container-shop py-6 md:py-10">
            <p
              className="select-none whitespace-nowrap text-center font-display text-[16vw] leading-[0.75] tracking-[0.02em] text-ink/[0.055]"
              aria-hidden="true"
            >
              STYTCHUP
            </p>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="container-shop flex flex-col gap-4 py-6 text-[9px] uppercase tracking-[0.16em] text-ink/35 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} StytchUp. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span>Made to order</span>
              <span aria-hidden="true">/</span>
              <span>Secure payments</span>
              <span aria-hidden="true">/</span>
              <span>Worldwide shipping</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
