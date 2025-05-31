'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error('❌ ' + error.message);
    } else {
      toast.success('✅ Password updated!');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1D3557] p-6 text-white">
      <div className="w-full max-w-md bg-[#2E5A88] p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>
        <form onSubmit={handlePasswordUpdate}>
          <label className="block mb-2 text-sm">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md bg-[#457B9D] text-white mb-6 focus:outline-none"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D3557] hover:bg-[#123456] py-2 rounded-md font-semibold transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
