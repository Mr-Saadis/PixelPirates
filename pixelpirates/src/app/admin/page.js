'use client';

import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#1D3557] text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🛠️ Admin Issue Manager</h1>
      <AdminPanel />
    </div>
  );
}
