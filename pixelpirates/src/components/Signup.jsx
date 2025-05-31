"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Importing the toast function from sonner

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);

    // Step 1: Create user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // alert("❌ Signup failed: " + error.message);
        toast("Signup failed", {
          description: error.message,
          // action: {
          //   label: "Undo",
          //   onClick: () => console.log("Undo"),
          // },
        })
      setLoading(false);
      return;
    }

    // Step 2: Insert into 'profiles' table
    const userId = data.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          name,
          role: "citizen", // default role
        },
      ]);

      if (insertError) {
        
      } else {
       // alert("✅ Signup successful!");
        toast("Signup successful!")

        router.push("/dashboard");
      }
    } else {
      toast("Signup failed", {
          description: error.message,
        })
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1D3557] flex items-center justify-center">
      <div className="bg-[#1D3557] text-white p-10 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">SMART CITY</h2>
        <h3 className="text-xl font-bold mb-6 text-center">Sign Up</h3>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#2E5A88] text-white focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2 bg-[#457B9D] hover:bg-[#35607d] rounded-md font-semibold"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-300 underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
