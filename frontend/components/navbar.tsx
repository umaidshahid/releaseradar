"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="w-full border-b bg-white">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          ReleaseRadar
        </Link>

        <div className="flex items-center gap-3">
          {!user ? (
            <Button onClick={login}>Login</Button>
          ) : (
            <>
              <span className="text-sm opacity-70">{user.displayName}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          )}

          <Link href="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
