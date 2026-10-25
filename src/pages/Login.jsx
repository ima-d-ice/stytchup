import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../auth/AuthContext';
import AuthShell from '../components/auth/AuthShell';
import { DEMO_CREDENTIALS, DEMO_MODE, decodeJwtPayload } from '../lib/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await login(form.email, form.password);
      navigate(data?.user?.role === 'DESIGNER' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <AuthShell
      eyebrow="Client area"
      title="Welcome back."
      intro="Sign in to follow your orders, speak with your designer, and keep your measurements on file."
      footer={
        <p className="text-[12px] text-ink/45">
          New to StytchUp?{' '}
          <Link to="/register" className="link-line font-medium text-ink">
            Create an account
          </Link>
        </p>
      }
    >
      {message && (
        <p className="mb-6 border-l-2 border-brand pl-3 text-[11px] leading-relaxed text-ink/60">{message}</p>
      )}
      {error && (
        <p className="mb-6 border-l-2 border-red-500 pl-3 text-[11px] leading-relaxed text-red-600">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="login-email" className="field-label">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="field-label">
              Password
            </label>
            <span className="mb-1 text-[9px] uppercase tracking-[0.14em] text-ink/30">Min. 8 characters</span>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </div>

        <button type="submit" className="btn-yellow w-full">
          Sign in
        </button>
      </form>

      {DEMO_MODE && (
        <div className="mt-8 border border-line p-4">
          <p className="eyebrow mb-3">Demo access</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_CREDENTIALS.map((credential) => (
              <button
                key={credential.label}
                type="button"
                onClick={() => setForm({ email: credential.email, password: credential.password })}
                className="border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
              >
                Use {credential.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink/35">
            Sample data only. Customer: customer@stytchup.com / customer1234
            <br />
            Designer: designer@stytchup.com / designer1234
            <br />
            Admin: admin@stytchup.com / admin1234
          </p>
        </div>
      )}

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-line" />
        <span className="text-[9px] uppercase tracking-[0.18em] text-ink/30">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="flex justify-center">
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                const payload = decodeJwtPayload(cred.credential);
                await googleLogin({ email: payload?.email, name: payload?.name });
                navigate('/dashboard');
              } catch {
                setError('Google login failed');
              }
            }}
            onError={() => setError('Google login failed')}
          />
        ) : (
          <button
            type="button"
            disabled
            className="btn-outline w-full cursor-not-allowed opacity-50"
            title="Set VITE_GOOGLE_CLIENT_ID to enable Google login"
          >
            Continue with Google
          </button>
        )}
      </div>
    </AuthShell>
  );
}
