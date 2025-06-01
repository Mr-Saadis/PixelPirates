'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AdminPanel = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [ProfiledepID, setProfiledepID] = useState(null);

  // ✅ Role check comes FIRST
  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error('You must be logged in.');
        return router.push('/login');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast.error('Could not verify role.');
        return router.push('/');
      }

      if (profile.role !== 'official') {
        toast.error('Access Denied');
        return router.push('/');
      }

      setUserId(user.id); // save userId for later
      setProfiledepID(profile.dept_id); // save userId for later
      fetchIssues(profile.dept_id); // fetch issues for this department
    };

    checkRole();
  }, []);

  const fetchIssues = async (P_dep_id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('dep_id', P_dep_id) // filter by department ID;

    if (!error) setIssues(data);
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
  const { error } = await supabase
    .from('issues')
    .update({ status: newStatus })
    .eq('id', id)
    .eq('dep_id', ProfiledepID); // ensure issue belongs to this user

  if (error) {
    toast.error('Failed to update status: ' + error.message);
  } else {
    toast.success('Status updated.');
    if (userId) fetchIssues(userId); // only fetch if we have user ID
  }
};


  return (
    <div className="overflow-x-auto bg-[#2E5A88] rounded-xl shadow-md p-4">
      {loading ? (
        <p className="text-white text-center">Loading issues...</p>
      ) : (
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
                <td className="px-4 py-2">{issue.lat?.toFixed(4)}</td>
                <td className="px-4 py-2">{issue.lng?.toFixed(4)}</td>
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
      )}
    </div>
  );
};

export default AdminPanel;
