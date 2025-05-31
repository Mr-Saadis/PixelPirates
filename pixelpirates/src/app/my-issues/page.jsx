'use client';

import dynamic from 'next/dynamic';

const UserIssuesMap = dynamic(() => import('@/components/UserIssuesMap'), {
  ssr: false,
});

export default function MyIssuesPage() {
  return (
    <div className="min-h-screen bg-[#1D3557] text-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">🧍 My Reported Issues</h2>
      <UserIssuesMap />
    </div>
  );
}
