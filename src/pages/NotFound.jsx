import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-shop flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="display text-[120px] leading-[0.75] tracking-[-0.04em] text-ink md:text-[180px]">404</h1>
      <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink/50">
        The page you were looking for has been archived, or never existed. The collection is still here.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn">
          Return home
        </Link>
        <Link to="/designs" className="btn-outline">
          Browse designs
        </Link>
      </div>
    </div>
  );
}
