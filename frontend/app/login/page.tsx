"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const loginEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    router.replace("/dashboard");
  };

  const loginGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    router.replace("/dashboard");
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center pt-12 pb-8">
      <div className="w-full max-w-lg border border-border/80 rounded-2xl p-8 space-y-6 shadow-lg bg-card text-card-foreground">
        <h1 className="text-xl font-semibold mb-2">Login</h1>

        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full" onClick={loginEmail}>
          Login with Email
        </Button>

        <Button variant="outline" className="w-full" onClick={loginGoogle}>
          Continue with Google
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
