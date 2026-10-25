import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
    setEmail('');
  };

  return (
    <section className="bg-brand text-ink">
      <div className="container-shop grid gap-8 py-12 md:grid-cols-12 md:items-end md:py-16">
        <div className="md:col-span-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink/60">The StytchUp letter</p>
          <h2 className="display mt-3 text-3xl leading-none tracking-[-0.02em] md:text-5xl">
            New work, first.
          </h2>
        </div>

        <div className="md:col-span-6">
          {joined ? (
            <p className="border-t border-ink/25 pt-4 text-sm">
              You&apos;re on the list. Look out for the next studio letter.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="border-t border-ink/25 pt-2">
              <div className="flex items-center gap-4">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="w-full border-0 bg-transparent py-3 text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="group flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
                >
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          )}
          <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-ink/50">
            Occasional notes from the atelier. No noise.
          </p>
        </div>
      </div>
    </section>
  );
}
