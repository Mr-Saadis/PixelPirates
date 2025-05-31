import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen bg-[#1D3557] flex items-center justify-center">
      <div className="bg-[#1D3557] text-white p-10 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">SMART CITY</h2>
        <h3 className="text-xl font-bold mb-6 text-center">Log In</h3>

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
        />

        <button className="w-full py-2 bg-[#457B9D] hover:bg-[#35607d] rounded-md font-semibold">
          Log In
        </button>

        <p className="text-sm mt-4 text-center">Forgot password?</p>
        <p className="text-sm mt-2 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-300 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
