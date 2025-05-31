import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function OfficialSummary() {
  const [userId, setUserId] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchUserIssues = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      const { data: issueData } = await supabase
        .from('issues')
        .select('*')
        .eq('assigned_to', user.id);

      setIssues(issueData || []);
    };

    fetchUserIssues();
  }, []);

  const resolvedCount = issues.filter(issue => issue.status === 'resolved').length;
  const pendingCount = issues.filter(issue => issue.status === 'pending').length;
  const inProgressCount = issues.filter(issue => issue.status === 'in_progress').length;

  const chartData = [
    { name: 'Resolved', value: resolvedCount },
    { name: 'In Progress', value: inProgressCount },
    { name: 'Pending', value: pendingCount }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-[#1D3557] mb-6">My Assigned Issue Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Assigned" count={issues.length} color="bg-blue-100" />
        <SummaryCard title="Resolved" count={resolvedCount} color="bg-green-100" />
        <SummaryCard title="In Progress" count={inProgressCount} color="bg-yellow-100" />
        <SummaryCard title="Pending" count={pendingCount} color="bg-red-100" />
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-[#1D3557] mb-4">Graphical Overview</h3>
        <div className="bg-white rounded-xl shadow-md p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#457B9D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-[#1D3557] mb-4">Latest Assigned Issues</h3>
        <div className="bg-white rounded-xl shadow-md overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#2E5A88] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-t">
                  <td className="px-4 py-2">{issue.title}</td>
                  <td className="px-4 py-2 capitalize">{issue.status}</td>
                  <td className="px-4 py-2">{new Date(issue.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, count, color }) {
  return (
    <div className={`rounded-lg p-6 shadow ${color} text-[#1D3557]`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}
