"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [repos, setRepos] = useState<any[]>([]);
  const [newRepo, setNewRepo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && user === null) router.push("/");
  }, [loading, user, router]);

  // REST fetch – used initially and after POST/DELETE
  const fetchRepos = async () => {
    if (!token) return;
    const res = await axios.get(`${API}/api/watchlist/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRepos(res.data);
  };

  const addRepo = async () => {
    if (!token || !newRepo) return;

    await axios.post(
      `${API}/api/watchlist/`,
      { repo: newRepo },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setNewRepo("");
    setDialogOpen(false);
    fetchRepos(); // immediate refresh
  };

  const deleteRepo = async (id: number) => {
    if (!token) return;

    await axios.delete(`${API}/api/watchlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRepos(); // immediate refresh
  };

  // Initial fetch
  useEffect(() => {
    if (token) fetchRepos();
  }, [token]);

  // 🔥 SSE: live updates
  useEffect(() => {
    if (!token) return;

    const url = `${API}/api/watchlist/stream?token=${encodeURIComponent(
      token,
    )}`;

    const es = new EventSource(url);

    const handleWatchlist = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setRepos(data);
      } catch (e) {
        console.error("Failed to parse SSE data", e);
      }
    };

    es.addEventListener("watchlist", handleWatchlist);
    es.onmessage = handleWatchlist; // fallback if server sends default event

    es.onerror = (err) => {
      console.error("SSE error", err);
      es.close();
    };

    return () => {
      es.removeEventListener("watchlist", handleWatchlist);
      es.close();
    };
  }, [token, API]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Your Watchlist</h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Repo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add GitHub Repo</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="owner/repo"
              value={newRepo}
              onChange={(e) => setNewRepo(e.target.value)}
            />

            <Button className="mt-4 w-full" onClick={addRepo}>
              Add
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Repo Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {repos.map((repo) => (
          <Card key={repo.id} className="relative">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{repo.repo_name}</CardTitle>

              {repo.previous_tag && repo.latest_tag !== repo.previous_tag && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-md animate-pulse">
                  Updated!
                </span>
              )}
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Latest Release: <strong>{repo.latest_tag || "N/A"}</strong>
              </p>

              {repo.previous_tag && (
                <p className="text-xs text-muted-foreground">
                  Previous: {repo.previous_tag}
                </p>
              )}

              {repo.last_checked && (
                <p className="text-xs text-muted-foreground">
                  Last checked: {new Date(repo.last_checked).toLocaleString()}
                </p>
              )}

              <Button variant="destructive" size="sm" onClick={() => deleteRepo(repo.id)}>
                Remove
              </Button>
            </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
}
