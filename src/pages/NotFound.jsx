import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-black text-gray-900">404</h1>
      <p className="mt-4 text-gray-500">Page not found.</p>
      <Link to="/" className="mt-6 px-6 py-3 rounded-full bg-[#FFC629] font-bold text-black">
        Go Home
      </Link>
    </div>
  );
}
