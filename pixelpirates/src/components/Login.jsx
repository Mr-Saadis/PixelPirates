"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("❌ Login failed: " + error.message);
    } else {
      // ✅ Redirect to dashboard on success
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#3177d9] flex items-center justify-center">
      <div className="bg-[#1D3557] text-white p-10 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">SMART CITY</h2>
        <h3 className="text-xl font-bold mb-6 text-center">Log In</h3>

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-[#457B9D] hover:bg-[#35607d] rounded-md font-semibold"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-sm mt-4 text-center">
          Forgot password?
        </p>
        <p className="text-sm mt-2 text-center">
          Don’t have an account? <a href="/signup" className="text-blue-300 underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
