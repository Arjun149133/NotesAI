import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Book, FileText, Plus, Settings, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const path = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    const handleToggleSidebar = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(customEvent.detail);
    };

    window.addEventListener("resize", handleResize);
    document.body.addEventListener("toggle-sidebar", handleToggleSidebar);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeEventListener("toggle-sidebar", handleToggleSidebar);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const navItems = [
    {
      title: "Notes",
      href: "/",
      icon: FileText,
    },
    // {
    //   title: "Favorites",
    //   href: "/favorites",
    //   icon: Star,
    // },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "flex-shrink-0 border-r w-64 h-[calc(100vh-4rem)] bg-background",
        "transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-primary text-glow">Workspaces</h2>
        <Button size="sm" className="space-gradient" asChild>
          <Link href="/new-note">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1 h-[calc(100%-5rem)]">
        <div className="py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  path === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
