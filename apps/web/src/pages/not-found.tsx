/**
 * 404 Not Found Page
 */

import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-slate-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-950 hover:bg-amber-400 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
