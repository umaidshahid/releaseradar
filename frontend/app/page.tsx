"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const navigateToApp = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="py-20">
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight">
          Stay Ahead of Every Release
        </h1>

        <p className="text-lg text-muted-foreground">
          ReleaseRadar tracks software releases for your favorite GitHub repositories.
          Get instant visibility into version updates — all in one clean dashboard.
        </p>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={navigateToApp}>
            Go to Dashboard
          </Button>

          <Button variant="outline" size="lg" onClick={navigateToApp}>
            Start Tracking
          </Button>
        </div>
      </section>

      <section className="mt-24 grid md:grid-cols-3 gap-12 max-w-5xl mx-auto px-6">
        <div className="p-6 border border-border/80 rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
          <p className="text-muted-foreground">
            Know immediately when your tracked repositories publish
            new versions or important updates.
          </p>
        </div>

        <div className="p-6 border border-border/80 rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Clean & Simple</h3>
          <p className="text-muted-foreground">
            A minimal, developer-friendly dashboard that shows exactly
            what matters — nothing more.
          </p>
        </div>

        <div className="p-6 border border-border/80 rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Built for You</h3>
          <p className="text-muted-foreground">
            All your watched repositories tied to your Firebase account,
            synced securely with FastAPI.
          </p>
        </div>
      </section>
    </main>
  );
}
