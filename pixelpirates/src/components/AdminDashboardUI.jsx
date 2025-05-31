import React, { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaChartLine,
  FaEnvelope,
  FaPoll,
  FaClipboardList,
  FaFileAlt,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { toast } from "sonner";
import ChatWindowAdminOfficial from "./ChatWindowAdminOfficial";
import UserRoleManagement from "./UserRoleManagement";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [messages, setMessages] = useState([]);
  const [adminName, setAdminName] = useState("Admin");
  const [recentMess, setRecentMess] = useState(false);
  const router = useRouter();
  const [userRoleMang, setUserRoleMang] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userSession } = await supabase.auth.getUser();
      const { data: usersData } = await supabase.from("profiles").select("*");
      const { data: issuesData } = await supabase.from("issues").select("*");
      const { data: messagesData } = await supabase.from("message").select("*");
      const userId = userSession?.user?.id;

      setUsers(usersData || []);
      setIssues(issuesData || []);
      setMessages(
        (messagesData || []).filter(
          (m) => m.sender_id !== userSession?.user?.id
        )
      );

      const admin = usersData?.find((u) => u.id === userSession?.user?.id);
      setAdminName(admin?.name || "Admin");
    };

    fetchData();
  }, []);

  const openIssues = issues.filter(
    (issue) => issue.status !== "resolved"
  ).length;

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error " + error.message);
      return;
    }
    toast.success("Successfully logged out!");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D3557] text-white flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-2xl font-bold border-b border-white/20">
            SmartCity Admin
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <SidebarItem
              icon={<FaHome />}
              label="Home"
              onClick={() => {
                setMessages(false);
                setRecentMess(false);
              }}
            />
            <SidebarItem
              icon={<FaUsers />}
              label="User & Role Mgmt"
              onClick={() => {
                setRecentMess(false);
                setUserRoleMang(true);
              }}
            />
            <SidebarItem
              icon={<FaChartLine />}
              label="Analytics"
              onClick={() => handleNavigation("/admin/analytics")}
            />
            <SidebarItem
              icon={<FaPoll />}
              label="Proposals & Polls"
              onClick={() => handleNavigation("/admin/polls")}
            />
            <SidebarItem
              icon={<FaEnvelope />}
              label="Messages"
              onClick={() => {
                setUserRoleMang(false);
                setRecentMess(true);
              }}
            />
            <SidebarItem
              icon={<FaClipboardList />}
              label="Reported Issues"
              onClick={() => handleNavigation("/admin/issues")}
            />
            <SidebarItem
              icon={<FaFileAlt />}
              label="Reports"
              onClick={() => handleNavigation("/admin/reports")}
            />
          </nav>
        </div>
        <div className="p-4 border-t border-white/20">
          <SidebarItem
            icon={<FaSignOutAlt />}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1D3557]">
              Welcome back, {adminName}
            </h1>
            <p className="text-sm text-gray-600">
              Here’s your control panel overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1D3557]">
                Administrator
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <img
              src="https://i.pravatar.cc/100"
              className="w-10 h-10 rounded-full border-2 border-[#1D3557]"
              alt="Admin Avatar"
            />
          </div>
        </header>

        {/* Admin Dashboard Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Widget title="Total Users" value={users.length} />
          <Widget title="Open Issues" value={openIssues} />
          <Widget title="Messages" value={messages.length} />
        </section>

        {/* Recent Messages Table */}

        {/* {recentMess ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-[#1D3557]">
              Recent Messages
            </h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#2E5A88] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">From</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg, i) => {
                    const sender = users.find((u) => u.id === msg.sender_id);
                    return (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">
                          {sender?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(msg.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{msg.content}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <ChatWindowAdminOfficial
            userId="acf63603-eb12-4851-aad1-ce2e11c95b18"
            userRole="admin"
          />
        )} */}

        {recentMess && (
          <ChatWindowAdminOfficial
            userId="acf63603-eb12-4851-aad1-ce2e11c95b18"
            userRole="admin"
          />
        )}
        {userRoleMang && <UserRoleManagement />}
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
