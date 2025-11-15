"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold hover:opacity-80 transition">
          ReleaseRadar
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>

              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm opacity-70">{user.email}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>

              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
