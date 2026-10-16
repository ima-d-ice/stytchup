import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth, } from '../auth/AuthContext';
import { decodeJwtPayload } from '../lib/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-8 text-center text-gray-900">Login</h2>

        {message && <p className="text-green-600 text-sm mb-4 text-center font-medium bg-green-50 p-2 rounded-lg">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4 text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20 transition-all bg-gray-50 text-gray-700"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC629] focus:ring-2 focus:ring-[#FFC629]/20 transition-all bg-gray-50 text-gray-700"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-[#FFC629] text-gray-900 font-bold p-4 rounded-xl hover:bg-[#E5B225] transition-colors shadow-[0_4px_14px_rgb(255,198,41,0.4)]"
          >
            Sign in with Email
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="grow border-t border-gray-200"></div>
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
            <p className="text-xs text-gray-400 text-center">
              Set VITE_GOOGLE_CLIENT_ID to enable Google login.
              <br />
              Backend /auth/google-sync is ready.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-black font-bold hover:underline decoration-[#FFC629] decoration-2 underline-offset-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
