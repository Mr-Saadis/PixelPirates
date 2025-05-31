'use client';

import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🛠️ Officials Issue Manager</h1>
      <AdminPanel />
    </div>
  );
}
