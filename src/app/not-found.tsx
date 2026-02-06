'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from '@boxicons/react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#f3f7f5] to-[#eef4f1] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
        
        {/* Icon / Visual */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center">
          <span className="text-3xl">🚫</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page not found
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <ArrowLeft />
            Go back
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#2D6A4F] text-white font-medium hover:bg-[#245a42] transition"
          >
            Go to dashboard
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-400">
          Error code: 404
        </p>
      </div>

      {/* Simple animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
