'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Settings, 
  HandMetal, 
  LogOut, 
  BarChart2,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user.role !== 'admin') {
            // Redirect non-admin users
            router.push('/');
            return;
          }
          setUser(data.user);
        } else {
          // Invalid token
          localStorage.removeItem('auth_token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <HandMetal className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SLAT Admin</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <LayoutDashboard className="h-5 w-5 text-gray-500" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/admin/users" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <Users className="h-5 w-5 text-gray-500" />
              <span>Users</span>
            </div>
          </Link>
          <Link href="/admin/stats" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <BarChart2 className="h-5 w-5 text-gray-500" />
              <span>Statistics</span>
            </div>
          </Link>
          <Link href="/admin/settings" className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-500" />
              <span>Settings</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4">
            <div className="font-medium">{user.username}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 