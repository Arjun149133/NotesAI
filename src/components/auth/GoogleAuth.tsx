"use client";
import { Chrome } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";

const GoogleAuth = () => {
  const supabase = createClient();
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error);
    } else {
      console.log("Google sign-in successful:", data);
    }
  };
  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#884dff] to-[#5535ff] hover:saturate-150 text-white p-6 rounded-lg font-semibold mb-6 transition-all animate-Button-glow"
    >
      <Chrome className="w-5 h-5" /> Sign Up with Google
    </Button>
  );
};

export default GoogleAuth;
