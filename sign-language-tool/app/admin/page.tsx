"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalClients: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Admin dashboard page loaded');
    
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Token from localStorage:', token ? 'Found' : 'Not found');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          setError("Authentication required");
          toast.error("Please log in to access the admin dashboard");
          router.push("/login");
          setLoading(false);
          return;
        }

        console.log('Fetching admin stats');
        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Admin stats response:', response.status);
        
        if (!response.ok) {
          const data = await response.json();
          console.error('Admin stats error:', data);
          throw new Error(data.error || "Failed to fetch statistics");
        }

        const data = await response.json();
        console.log('Admin stats data:', data);
        setStats(data);
      } catch (error: any) {
        console.error("Error fetching stats:", error);
        setError(error.message || "An error occurred while fetching statistics");
        
        if (error.message?.includes("Admin access required")) {
          console.log('User is not an admin, redirecting to dashboard');
          toast.error("You don't have permission to access the admin dashboard");
          router.push("/dashboard");
        } else if (error.message?.includes("Invalid token")) {
          console.log('Invalid token, redirecting to login');
          toast.error("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          toast.error("Failed to load statistics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <CardDescription>Administrator accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalAdmins || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Regular user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalClients || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently active users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeUsers || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 