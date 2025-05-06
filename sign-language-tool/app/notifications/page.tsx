"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  GraduationCap,
  HandMetal,
  MessageSquare,
  Star,
  Trash2,
  Trophy,
} from "lucide-react"
import { toast } from "sonner"

// Sample notification data
const sampleNotifications = [
  {
    id: 1,
    title: "New lesson available",
    description: "Check out the new Sign Language basics course!",
    time: "10 minutes ago",
    category: "learning",
    read: false,
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Practice reminder",
    description: "You haven't practiced in 2 days. Keep your streak going!",
    time: "2 hours ago",
    category: "reminder",
    read: false,
    icon: <Bell className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Achievement unlocked",
    description: "You've completed 5 lessons in a row!",
    time: "Yesterday",
    category: "achievement",
    read: true,
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Dictionary updated",
    description: "10 new signs have been added to the dictionary",
    time: "2 days ago",
    category: "system",
    read: true,
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "Weekly progress summary",
    description: "You practiced 4 out of 7 days this week. Great job!",
    time: "1 week ago",
    category: "system",
    read: true,
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    id: 6,
    title: "New comment on your practice video",
    description: "Instructor Sarah left feedback on your recent submission",
    time: "1 week ago",
    category: "social",
    read: false,
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: 7,
    title: "Course completion certificate",
    description: "Your ASL Basics certificate is ready to download",
    time: "2 weeks ago",
    category: "learning",
    read: true,
    icon: <GraduationCap className="h-5 w-5" />,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.category === activeTab;
  });

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "learning":
        return "bg-indigo-100 text-indigo-600";
      case "reminder":
        return "bg-amber-100 text-amber-600";
      case "achievement":
        return "bg-green-100 text-green-600";
      case "system":
        return "bg-blue-100 text-blue-600";
      case "social":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="container py-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your learning progress and system announcements"
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-1">
                <Button
                  variant={activeTab === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("all")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>All Notifications</span>
                    <Badge>{notifications.length}</Badge>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "unread" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("unread")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Unread</span>
                    <Badge>{unreadCount}</Badge>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "learning" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("learning")}
                >
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Learning</span>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "achievement" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("achievement")}
                >
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Achievements</span>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "reminder" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("reminder")}
                >
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Reminders</span>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "system" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("system")}
                >
                  <div className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "social" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("social")}
                >
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Social</span>
                  </div>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 pt-0">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" 
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">
                {activeTab === "all"
                  ? "All Notifications"
                  : activeTab === "unread"
                  ? "Unread Notifications"
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
              </CardTitle>
              <CardDescription>
                {filteredNotifications.length === 0
                  ? "No notifications to display"
                  : `Showing ${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                <div className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                      <p className="text-gray-500 max-w-sm">
                        {activeTab === "all"
                          ? "You don't have any notifications yet. They will appear here when you receive them."
                          : `You don't have any ${activeTab === "unread" ? "unread" : activeTab} notifications.`}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`transition hover:shadow-md ${
                          !notification.read ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""
                        }`}
                      >
                        <div className="p-4 flex items-start gap-4">
                          <div className={`p-2 rounded-full ${getCategoryColor(notification.category)}`}>
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{notification.description}</p>
                            <div className="flex items-center mt-2 gap-2">
                              <Badge 
                                variant="outline" 
                                className={getCategoryColor(notification.category)}
                              >
                                {notification.category}
                              </Badge>
                              {!notification.read && (
                                <Badge>New</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 