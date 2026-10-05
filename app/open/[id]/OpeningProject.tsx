'use client';

import { useEffect } from 'react';

type Props = {
  title: string;
  destination: string;
};

export default function OpeningProject({ title, destination }: Props) {
  useEffect(() => {
    // Let the server-rendered loading message paint before navigating away.
    const timer = window.setTimeout(() => window.location.replace(destination), 350);
    return () => window.clearTimeout(timer);
  }, [destination]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFDF5] px-6 text-black">
      <section className="w-full max-w-sm text-center" aria-live="polite">
        <div
          className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-black/15 border-t-black motion-reduce:animate-none"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-black">正在開啟作品</h1>
        <p className="mt-2 text-sm font-medium text-neutral-600">{title}</p>
        <div
          className="mt-7 h-1.5 overflow-hidden rounded-full bg-black/10"
          role="progressbar"
          aria-label={`正在載入${title}`}
          aria-valuetext="載入中"
        >
          <div className="h-full w-1/3 animate-loading-bar rounded-full bg-[#5A35B5] motion-reduce:animate-none" />
        </div>
      </section>
      <style jsx>{`
        @keyframes loading-bar {
          from { transform: translateX(-120%); }
          to { transform: translateX(320%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-loading-bar { width: 100%; transform: none; }
        }
      `}</style>
    </main>
  );
}
