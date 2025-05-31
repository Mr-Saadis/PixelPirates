'use client'; // 👈 THIS line makes this a client component

import dynamic from 'next/dynamic';

// Dynamically import map with SSR disabled
const PublicMap = dynamic(() => import('@/components/PublicMap'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#1D3557] text-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">🗺️ All Reported Issues</h2>
      <PublicMap />
    </div>
  );
}
