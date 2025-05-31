'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    const { data, error } = await supabase.from('issues').select('*');
    if (!error) setIssues(data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
  const checkRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (data?.role !== 'admin') {
      toast.error('❌ Access Denied');
      router.push('/');
    }
  };
  checkRole();
}, []);


  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('issues')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status.');
    } else {
      toast.success('✅ Status updated.');
      fetchIssues(); // refresh
    }
  };

  return (
    <div className="overflow-x-auto bg-[#2E5A88] rounded-xl shadow-md p-4">
      <table className="min-w-full text-sm text-white border border-white">
        <thead className="bg-[#1D3557]">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2">Latitude</th>
            <th className="px-4 py-2">Longitude</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Change Status</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id} className="border-t border-white/30">
              <td className="px-4 py-2">{issue.title}</td>
              <td className="px-4 py-2">{issue.lat.toFixed(4)}</td>
              <td className="px-4 py-2">{issue.lng.toFixed(4)}</td>
              <td className="px-4 py-2 capitalize">{issue.status}</td>
              <td className="px-4 py-2">
                <select
                  value={issue.status}
                  onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                  className="bg-[#457B9D] text-white rounded-md px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
