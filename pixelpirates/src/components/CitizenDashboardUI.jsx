import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  FaUser,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaComments,
  FaChartPie,
  FaPlus,
} from "react-icons/fa";
import { toast } from "sonner";
import ChatWindow from "./ChatWindow";

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (!profileError && profile) {
        setUserName(profile.name);
      }

      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setIssues(data);
        const total = data.length;
        const resolved = data.filter((i) => i.status === "resolved").length;
        const pending = data.filter((i) => i.status === "pending").length;
        setStats({ total, resolved, pending });
      }
    };

    fetchData();
  }, []);

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
    <div className="flex min-h-screen bg-[#f0f4f8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D3557] text-white flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-2xl font-bold border-b border-white/20">
            SmartCity
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <SidebarItem
              icon={<FaPlus />}
              label="Report Issue"
              onClick={() => router.push("/report")}
            />
            <SidebarItem
              icon={<FaClipboardList />}
              label="My Issues (List)"
              onClick={() => router.push("/my-issues/list")}
            />
            <SidebarItem
              icon={<FaMapMarkerAlt />}
              label="My Issues (Map)"
              onClick={() => router.push("/my-issues")}
            />
            <SidebarItem
              icon={<FaChartPie />}
              label="Proposal Voting"
              onClick={() => router.push("/dashboard/voting")}
            />
            <SidebarItem
              icon={<FaComments />}
              label="Chat"
              onClick={() => setShowChat(true)}
            />
            <SidebarItem
              icon={<FaChartPie />}
              label="Summary"
              onClick={() => router.push("/citizendashboard/CitizenSummaR")}
            />
            <SidebarItem
              icon={<FaMapMarkerAlt />}
              label="AR Report"
              onClick={() => router.push("/dashboard/ar-report")}
            />
          </nav>
        </div>
        <div className="p-4 border-t border-white/20">
          <SidebarItem
            icon={<FaUser />}
            label="Profile"
            onClick={() => router.push("/dashboard/profile")}
          />
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
              Welcome back, {userName || "Citizen"}
            </h1>
            <p className="text-sm text-gray-600">
              Here’s a snapshot of your activity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1D3557]">
                {userName || "Citizen"}
              </p>
              <p className="text-xs text-gray-500">Citizen</p>
            </div>
            <img
              src="https://i.pravatar.cc/100"
              className="w-10 h-10 rounded-full border-2 border-[#1D3557]"
              alt="User Avatar"
            />
          </div>
        </header>

        {/* Dashboard Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Widget title="Issues Reported" value={stats.total} />
          <Widget title="Resolved" value={stats.resolved} />
          <Widget title="Pending" value={stats.pending} />
        </section>

        {/* Recent Activity Table */}
        {/* <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-[#1D3557]">Recent Reports</h2>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#2E5A88] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue.id} className="border-t">
                                        <td className="px-4 py-2">{issue.title}</td>
                                        <td className={`px-4 py-2 ${issue.status === 'resolved' ? 'text-green-500' : 'text-yellow-500'}`}>{issue.status}</td>
                                        <td className="px-4 py-2">{new Date(issue.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">
                                            <button className="text-blue-600 hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section> */}

        {showChat && <ChatWindow />}
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
