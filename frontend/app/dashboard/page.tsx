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
  const { user, token } = useAuth();
  const router = useRouter();

  const [repos, setRepos] = useState<any[]>([]);
  const [newRepo, setNewRepo] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  const fetchRepos = async () => {
    if (!token) return;
    const res = await axios.get(`${API}/api/watchlist/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRepos(res.data);
  };

  const addRepo = async () => {
    await axios.post(
      `${API}/api/watchlist/`,
      { repo: newRepo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewRepo("");
    fetchRepos();
  };

  useEffect(() => {
    if (token) fetchRepos();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Your Watchlist</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Add Repo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a GitHub Repo</DialogTitle>
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

      <div className="grid gap-4 md:grid-cols-2">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardHeader>
              <CardTitle>{repo.repo_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Added: {new Date(repo.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
