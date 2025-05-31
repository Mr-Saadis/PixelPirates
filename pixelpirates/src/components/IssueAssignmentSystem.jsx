import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function IssueAssignmentPage() {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: issuesData } = await supabase
        .from('issues')
        .select('*')
        .eq('status', 'pending');

      const { data: departmentsData } = await supabase
        .from('depmartment')
        .select('*');

      setIssues(issuesData || []);
      setDepartments(departmentsData || []);
    };

    fetchData();
  }, []);

  const assignDepartment = async (issueId, deptId) => {
    setLoading(true);
    const { error } = await supabase
      .from('issues')
      .update({ dept_id: deptId, status: 'in_progress' })
      .eq('id', issueId);

    if (!error) {
      setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-[#1D3557] mb-6">Assign Issues to Departments</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-sm">
          <thead className="bg-[#2E5A88] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Select Department</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-t">
                <td className="px-4 py-2">{issue.title}</td>
                <td className="px-4 py-2">{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</td>
                <td className="px-4 py-2">
                  <select
                    className="bg-gray-100 px-2 py-1 rounded"
                    onChange={(e) => assignDepartment(issue.id, parseInt(e.target.value))}
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => assignDepartment(issue.id, issue.dept_id)}
                    disabled={!issue.dept_id || loading}
                    className="bg-[#457B9D] text-white px-3 py-1 rounded hover:bg-[#35607d]"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
