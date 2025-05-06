"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { BarChart2, Book, Calendar, Clock, GraduationCap, HandMetal, History, Star, Video, Zap } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Dashboard page loaded');
    
    const token = localStorage.getItem("token") || Cookies.get('token');
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      toast.error("Authentication required");
      router.push("/login");
      return;
    }

    // In a real app, you would fetch user data from an API
    // For now, we'll just decode the token to get basic user info
    try {
      console.log('Decoding token');
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      console.log('Token payload:', tokenPayload);
      
      setUser({
        id: tokenPayload.userId,
        email: tokenPayload.email,
        role: tokenPayload.role,
      });
      
      console.log('User set:', tokenPayload.email, tokenPayload.role);
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("Failed to load user data");
      toast.error("Invalid token. Please log in again.");
      localStorage.removeItem("token");
      Cookies.remove('token');
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    console.log('Logging out');
    localStorage.removeItem("token");
    Cookies.remove('token');
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
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
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Welcome, {user?.email}</h1>
        <p className="text-gray-600">Here's your sign language learning overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">Signs Learned</p>
                <p className="text-3xl font-bold text-indigo-900">246</p>
              </div>
              <div className="p-3 bg-white rounded-full">
                <HandMetal className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-indigo-700">
              <span className="font-medium">+12</span> in the last week
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">Practice Time</p>
                <p className="text-3xl font-bold text-indigo-900">14.2h</p>
              </div>
              <div className="p-3 bg-white rounded-full">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-indigo-700">
              <span className="font-medium">+2.5h</span> from last week
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-indigo-900">5 days</p>
              </div>
              <div className="p-3 bg-white rounded-full">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-indigo-700">
              <span className="font-medium">Keep going!</span> Best: 12 days
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">Average Accuracy</p>
                <p className="text-3xl font-bold text-indigo-900">87%</p>
              </div>
              <div className="p-3 bg-white rounded-full">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-indigo-700">
              <span className="font-medium">+3%</span> improvement
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-indigo-800">Weekly Activity</CardTitle>
              <CardDescription>Your sign language practice over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const heights = [65, 40, 85, 70, 55, 95, 45] 
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="h-[150px] flex flex-col justify-end mb-2">
                        <div
                          className="w-12 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm"
                          style={{ height: `${heights[index]}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-gray-600">{day}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-0">
              <Button 
                variant="ghost" 
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                onClick={() => router.push("/analytics")}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                <span>View detailed analytics</span>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recently Used Tools */}
        <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-indigo-800">Recently Used Tools</CardTitle>
              <CardDescription>Quick access to your frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Link href="/ai-learning/real-time-feedback" className="w-full h-full">
                  <div className="p-4 border border-indigo-100 rounded-lg bg-white hover:bg-indigo-50 transition-colors flex flex-col items-center text-center h-full">
                    <div className="p-3 bg-indigo-100 rounded-full mb-3">
                      <HandMetal className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-medium text-indigo-800 mb-1">Real-time Feedback</h3>
                    <p className="text-xs text-gray-500">Used 3 days ago</p>
                  </div>
                </Link>
                
                <Link href="/dictionary" className="w-full h-full">
                  <div className="p-4 border border-indigo-100 rounded-lg bg-white hover:bg-indigo-50 transition-colors flex flex-col items-center text-center h-full">
                    <div className="p-3 bg-indigo-100 rounded-full mb-3">
                      <Book className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-medium text-indigo-800 mb-1">Dictionary</h3>
                    <p className="text-xs text-gray-500">Used yesterday</p>
                  </div>
                </Link>
                
                <Link href="/translate" className="w-full h-full">
                  <div className="p-4 border border-indigo-100 rounded-lg bg-white hover:bg-indigo-50 transition-colors flex flex-col items-center text-center h-full">
                    <div className="p-3 bg-indigo-100 rounded-full mb-3">
                      <HandMetal className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-medium text-indigo-800 mb-1">Translate</h3>
                    <p className="text-xs text-gray-500">Used 5 hours ago</p>
                  </div>
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-0">
              <Button
                variant="ghost" 
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" 
                onClick={() => router.push("/backlog-features")}
              >
                <span>View all tools</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* User Card */}
          <Card>
            <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white mb-3">
                  <span className="text-2xl font-bold">{user?.email?.[0].toUpperCase()}</span>
                </div>
                <h3 className="font-bold text-lg text-center">{user?.email}</h3>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium mt-2">
                  {user?.role || 'User'}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <Button
                  variant="outline"
                  className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 mb-2"
                  onClick={() => router.push("/profile")}
                >
                  Edit Profile
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
            </div>
          </CardContent>
        </Card>
          
          {/* Learning Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-indigo-800">Learning Progress</CardTitle>
              <CardDescription>Your current courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-indigo-800">Beginner Phrases</span>
                    <span className="text-sm font-medium text-indigo-600">85%</span>
                  </div>
                  <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-indigo-800">Alphabet Mastery</span>
                    <span className="text-sm font-medium text-indigo-600">62%</span>
                  </div>
                  <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: '62%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-indigo-800">Conversational</span>
                    <span className="text-sm font-medium text-indigo-600">30%</span>
                  </div>
                  <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: '30%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                onClick={() => router.push("/learn")}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 