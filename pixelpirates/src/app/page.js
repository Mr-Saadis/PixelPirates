"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Login from "@/components/Login";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Get user role from `profiles` table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // Redirect based on role
        if (profile?.role === "admin") {
          router.push("/admindashboard");
        } else if (profile?.role === "official") {
          router.push("/OfficialDashboard");
        } else if (profile?.role === "citizen") {
          router.push("/citizendashboard");
        }
      }
    };

    checkSessionAndRedirect();
  }, [router]);

  return <Login />;
}
