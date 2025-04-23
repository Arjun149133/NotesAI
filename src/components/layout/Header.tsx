"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Menu } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// import { supabase } from '@/lib/supabase';

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
    }

    fetchUser();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.dispatchEvent(
      new CustomEvent("toggle-sidebar", { detail: !isSidebarOpen })
    );
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-10 md:px-8 px-4">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </span>
            <h1 className="text-xl font-bold tracking-tight">NotesAI</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {!user ? (
            <div className=" flex items-center gap-2">
              <Button>
                <Link href="/login">Login </Link>
              </Button>
              <Button variant={"outline"}>
                <Link href="/signup">Sign Up </Link>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                supabase.auth.signOut();
                setUser(null);
                router.push("/login");
              }}
              variant="ghost"
              size="icon"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
