'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export default function MyIssuesListPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyIssues = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("You're not logged in");
      return;
    }

    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch issues');
    } else {
      setIssues(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  return (
    <div className="min-h-screen bg-[#1D3557] text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">📋 My Reported Issues</h2>

      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : issues.length === 0 ? (
        <p className="text-center text-white">No issues reported yet.</p>
      ) : (
        <div className="overflow-x-auto bg-[#2E5A88] rounded-xl shadow-md p-4">
          <table className="min-w-full text-sm text-white border border-white">
            <thead className="bg-[#1D3557]">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-t border-white/30">
                  <td className="px-4 py-2">{issue.title}</td>
                  <td className="px-4 py-2 capitalize">{issue.status}</td>
                  <td className="px-4 py-2">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toast.info('Coming Soon: View Details')}
                      className="bg-[#457B9D] hover:bg-[#35607d] px-3 py-1 rounded-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
