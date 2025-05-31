'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
//import { toast } from 'react-hot-toast';
import { Toaster } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password',
    });

    setLoading(false);

    if (error) {
      //toast.error("❌ " + error.message);
      toast("Signup failed", { description: error.message });
    } else {
     // toast.success("✅ Reset link sent if email exists.");
     toast("Signup failed", { description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1D3557] via-[#2E5A88] to-[#457B9D]">
      {/* Left Image Section */}
      <div className="md:w-1/2 w-full hidden md:flex items-center justify-center p-6">
        <img
          src="/leftImg.png"
          alt="Smart City Password Reset"
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
            Forgot Password
          </h3>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block mb-2 text-sm text-white">
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full mb-6 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white 
                bg-gradient-to-r from-[#457B9D] to-[#1D3557] 
                hover:from-[#2E5A88] hover:to-[#1D3557] 
                border border-white/20 shadow-md 
                transition-all duration-300 ease-in-out 
                hover:scale-[1.03] active:scale-95`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-sm mt-4 text-center">
            Remember your password?{' '}
            <a href="/login" className="text-blue-300 underline hover:text-white transition">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
