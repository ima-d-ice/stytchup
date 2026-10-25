import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import { API_URL, DEMO_MODE } from '../lib/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (DEMO_MODE) {
      navigate('/login?message=' + encodeURIComponent('Account created in demo mode. Use a demo login below.'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      navigate('/login?message=' + encodeURIComponent('Registered successfully. Please sign in.'));
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="New client"
      title="Create an account."
      intro="Save your measurements, follow commissions, and speak directly with the designer making your piece."
      footer={
        <p className="text-[12px] text-ink/45">
          Already have an account?{' '}
          <Link to="/login" className="link-line font-medium text-ink">
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <p className="mb-6 border-l-2 border-red-500 pl-3 text-[11px] leading-relaxed text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="register-name" className="field-label">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            required
            autoComplete="name"
            className="field"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="register-email" className="field-label">
            Email address
          </label>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="register-password" className="field-label">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="field"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-ink/30">Minimum 8 characters</p>
        </div>

        <button type="submit" disabled={loading} className="btn-yellow w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-[10px] leading-relaxed text-ink/35">
        By creating an account you agree to StytchUp&apos;s terms of service and privacy policy. Designers can
        request a studio account from account settings after registering.
      </p>

      {DEMO_MODE && (
        <div className="mt-6 border border-line p-4 text-[10px] leading-relaxed text-ink/45">
          Demo mode is on. Registration is simulated — use the demo accounts on the sign-in page to explore
          the client, designer, and admin views.
        </div>
      )}
    </AuthShell>
  );
}
