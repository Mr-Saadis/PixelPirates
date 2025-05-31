"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOfficials: 0,
    totalIssues: 0,
    issuesResolved: 0,
    issuesPending: 0,
    issuesInProgress: 0,
    userIssueStats: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: users } = await supabase.from("profiles").select("*");
      const { data: issues } = await supabase.from("issues").select("*");

      const totalUsers = users.filter(u => u.role === "citizen").length;
      const totalOfficials = users.filter(u => u.role === "official").length;
      const totalIssues = issues.length;
      const issuesResolved = issues.filter(i => i.status === "resolved").length;
      const issuesPending = issues.filter(i => i.status === "pending").length;
      const issuesInProgress = issues.filter(i => i.status === "in_progress").length;

      // Group by user
      const userStats = users.map(user => {
        const userIssues = issues.filter(i => i.created_by === user.id);
        return {
          name: user.name || user.id.substring(0, 6),
          total: userIssues.length,
          resolved: userIssues.filter(i => i.status === "resolved").length,
          pending: userIssues.filter(i => i.status === "pending").length,
        };
      }).filter(u => u.total > 0);

      setAnalytics({
        totalUsers,
        totalOfficials,
        totalIssues,
        issuesResolved,
        issuesPending,
        issuesInProgress,
        userIssueStats: userStats,
      });
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-[#1D3557] mb-6">Admin Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card title="Total Citizens" value={analytics.totalUsers} />
        <Card title="Total Officials" value={analytics.totalOfficials} />
        <Card title="Total Issues" value={analytics.totalIssues} />
        <Card title="Resolved" value={analytics.issuesResolved} />
        <Card title="In Progress" value={analytics.issuesInProgress} />
        <Card title="Pending" value={analytics.issuesPending} />
      </div>

      <h3 className="text-xl font-semibold text-[#1D3557] mb-4">User-wise Issue Report Chart</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.userIssueStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" stackId="a" fill="#457B9D" name="Total" />
            <Bar dataKey="resolved" stackId="a" fill="#48BB78" name="Resolved" />
            <Bar dataKey="pending" stackId="a" fill="#ECC94B" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white text-[#1D3557] rounded-lg p-6 shadow">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
