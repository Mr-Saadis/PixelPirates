import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import {
  FaSignOutAlt,
  FaEdit,
  FaMapMarkedAlt,
  FaComments,
  FaUserShield,
  FaHome,
} from 'react-icons/fa';

export default function OfficialDashboard() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [assignedIssuesCount, setAssignedIssuesCount] = useState(0);
  const [resolvedThisMonthCount, setResolvedThisMonthCount] = useState(0);
  const [chatsWithCitizensCount, setChatsWithCitizensCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      setUserName(profile?.name || 'Official');

      const { data: issues } = await supabase
        .from('issues')
        .select('*')
        .eq('assigned_to', user.id);

      setAssignedIssuesCount(issues?.length || 0);

      const currentMonth = new Date().getMonth();
      const resolvedThisMonth = issues?.filter(issue => {
        const created = new Date(issue.created_at);
        return issue.status === 'resolved' && created.getMonth() === currentMonth;
      }).length || 0;
      setResolvedThisMonthCount(resolvedThisMonth);

      const { data: chats } = await supabase
        .from('message')
        .select('*')
        .eq('receiver_id', user.id);

      setChatsWithCitizensCount(chats?.length || 0);
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error: ' + error.message);
    } else {
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D3557] text-white flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-2xl font-bold border-b border-white/20">
            SmartCity Official
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <SidebarItem icon={<FaHome />} label="Home" onClick={() => handleNavigation('/officialdashboard')} />
            <SidebarItem icon={<FaEdit />} label="Update Issues" onClick={() => handleNavigation('/officialdashboard/update-issues')} />
            <SidebarItem icon={<FaMapMarkedAlt />} label="Map View" onClick={() => handleNavigation('/officialdashboard/map')} />
            <SidebarItem icon={<FaComments />} label="Chat with Admin" onClick={() => handleNavigation('/officialdashboard/chat-admin')} />
            <SidebarItem icon={<FaComments />} label="Chat with Citizens" onClick={() => handleNavigation('/officialdashboard/chat-citizens')} />
            <SidebarItem icon={<FaUserShield />} label="Performance" onClick={() => handleNavigation('/officialdashboard/performance')} />
          </nav>
        </div>
        <div className="p-4 border-t border-white/20">
          <SidebarItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1D3557]">Welcome back, {userName}</h1>
            <p className="text-sm text-gray-600">Here's your official workspace dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1D3557]">{userName}</p>
              <p className="text-xs text-gray-500">Official</p>
            </div>
            <img
              src="https://i.pravatar.cc/100"
              className="w-10 h-10 rounded-full border-2 border-[#1D3557]"
              alt="User Avatar"
            />
          </div>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Widget title="Assigned Issues" value={assignedIssuesCount} />
          <Widget title="Resolved This Month" value={resolvedThisMonthCount} />
          <Widget title="Chats with Citizens" value={chatsWithCitizensCount} />
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-all w-full text-left"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Widget({ title, value }) {
  return (
    <div className="bg-white text-[#1D3557] rounded-lg p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
