"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address.");
      return;
    }

    setLoading(true);

    // 🔐 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      toast.error("🚫 " + authError.message);
      return;
    }

    // ✅ 2. Get user's role from profiles table
    const userId = authData.user?.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    setLoading(false);

    if (profileError || !profile?.role) {
      toast.error(" Failed to get user role.");
      return;
    }

    const role = profile.role;

    
    // 🚀 3. Redirect based on role
    if (role === "admin") {
      toast.success("Logged in successfully!");
      router.push("/admindashboard");
    } else if (role === "citizen") {
      toast.success("Logged in successfully!");
      router.push("/citizendashboard");
    } else if (role === "official") {
      toast.success("Logged in successfully!");
      router.push("/OfficialDashboard");
    } else {
      toast.error("Unknown user role. Access denied.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1D3557] via-[#2E5A88] to-[#457B9D]">
      {/* Left Image Section */}
      <div className="md:w-1/2 w-full hidden md:flex items-center justify-center p-6">
        <img
          src="/leftImg.png"
          alt="Smart City"
          className="max-w-full h-auto rounded-lg shadow-xl"
        />
      </div>

      {/* Right Form Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl w-full max-w-sm animate-slide-up text-white">
          <h2 className="text-3xl font-bold text-center mb-3 tracking-wider drop-shadow">
            SMART CITY
          </h2>
          <h3 className="text-lg font-semibold text-center mb-6">
            Login to your account
          </h3>

          <input
            type="email"
            placeholder="Email address"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white 
              bg-gradient-to-r from-[#457B9D] to-[#1D3557] 
              hover:from-[#2E5A88] hover:to-[#1D3557] 
              border border-white/20 shadow-md 
              transition-all duration-300 ease-in-out 
              hover:scale-[1.03] active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>

          <p className="text-sm mt-4 text-center">
            <a
              href="/forgetPassword"
              className="text-blue-300 underline hover:text-white transition"
            >
              Forgot password?
            </a>
          </p>
          <p className="text-sm mt-2 text-center">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-300 underline hover:text-white transition"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
