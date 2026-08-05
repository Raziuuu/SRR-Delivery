import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center text-white">
      <h1 className="text-4xl font-black text-emerald-500 mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-neutral-400 mb-6">
        The requested page does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-colors shadow-lg"
      >
        Return to Home Page
      </Link>
    </div>
  );
}
