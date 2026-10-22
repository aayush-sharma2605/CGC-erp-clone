"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  user: { name?: string | null; email?: string | null; role: string };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-dvh bg-[#080C16] text-slate-100 selection:bg-purple-500/30 selection:text-white">
      {/* Sidebar with distinct desktop & mobile drawer state handling */}
      <Sidebar
        user={user}
        isDesktopOpen={desktopSidebarOpen}
        isMobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main content area */}
      <div
        className={cn(
          "min-h-dvh transition-all duration-300 ease-in-out ml-0",
          desktopSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        <Topbar
          onMenuToggle={handleMenuToggle}
          user={user}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Touch-friendly mobile bottom navigation */}
      <MobileBottomBar onMenuToggle={() => setMobileDrawerOpen(true)} />
    </div>
  );
}
