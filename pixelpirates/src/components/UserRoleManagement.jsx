import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export default function UserRoleManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from('profiles').select('*');
      const { data: departmentsData } = await supabase.from('depmartment').select('*');

      setUsers(usersData || []);
      setDepartments(departmentsData || []);

      const initialState = {};
      (usersData || []).forEach(user => {
        initialState[user.id] = {
          role: user.role || 'citizen',
          dept_id: user.dept_id || ''
        };
      });
      setFormState(initialState);
    };

    fetchData();
  }, []);

  const handleChange = (userId, field, value) => {
    setFormState(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handleSave = async (userId) => {
    const { role, dept_id } = formState[userId];
    setLoading(true);

    const updates = role === 'official'
      ? { role, dept_id: dept_id || null }
      : { role, dept_id: null };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (!error) {
        toast.success('User role updated successfully!')
      setUsers(prev => prev.map(user => (
        user.id === userId ? { ...user, ...updates } : user
      )));
    } else {
        toast.error('Failed to update user role: ' + error.message);
      console.error('Update error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-[#1D3557] mb-6">User Role Management</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-sm">
          <thead className="bg-[#2E5A88] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Department (if official)</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">
                  <select
                    value={formState[user.id]?.role || 'citizen'}
                    onChange={(e) => handleChange(user.id, 'role', e.target.value)}
                    className="bg-gray-100 px-2 py-1 rounded"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="official">Official</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  {formState[user.id]?.role === 'official' && (
                    <select
                      value={formState[user.id]?.dept_id || ''}
                      onChange={(e) => handleChange(user.id, 'dept_id', parseInt(e.target.value))}
                      className="bg-gray-100 px-2 py-1 rounded"
                    >
                      <option value="">-- Select Dept --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-[#457B9D] text-white px-3 py-1 rounded hover:bg-[#35607d]"
                    disabled={loading}
                    onClick={() => handleSave(user.id)}
                  >
                    Save
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
