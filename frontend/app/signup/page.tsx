"use client";

import { useState } from "react";
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupEmail = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signupGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center pt-12 pb-8">
      <div className="w-full max-w-lg border border-border/80 rounded-2xl p-8 space-y-6 shadow-lg bg-card text-card-foreground">
        <h1 className="text-xl font-semibold mb-2">Create Account</h1>

        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full" onClick={signupEmail}>
          Sign Up with Email
        </Button>

        <Button variant="outline" className="w-full" onClick={signupGoogle}>
          Continue with Google
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
