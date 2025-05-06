"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  Bell,
  Book,
  Cog,
  GraduationCap,
  HandMetal,
  History,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  User,
  Video,
  X,
  Layers,
  Sun,
  ChevronDown,
  CheckCircle,
  MessageSquare,
  HelpCircle,
} from "lucide-react"
import { useTheme } from "next-themes"

export function Navigation() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Handle hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close side menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sideMenu = document.getElementById("side-menu")
      const menuToggle = document.getElementById("menuToggle")

      if (
        sideMenu &&
        !sideMenu.contains(event.target as Node) &&
        menuToggle &&
        !menuToggle.contains(event.target as Node) &&
        sideMenuOpen
      ) {
        setSideMenuOpen(false)
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        profileOpen
      ) {
        setProfileOpen(false)
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        notificationsOpen
      ) {
        setNotificationsOpen(false)
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchOpen
      ) {
        setSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sideMenuOpen, profileOpen, notificationsOpen, searchOpen])

  // Close side menu when route changes
  useEffect(() => {
    setSideMenuOpen(false)
    setProfileOpen(false)
    setNotificationsOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New lesson available",
      description: "Check out the new Sign Language basics course!",
      time: "10 minutes ago",
      unread: true,
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      id: 2,
      title: "Practice reminder",
      description: "You haven't practiced in 2 days.",
      time: "2 hours ago",
      unread: true,
      icon: <Bell className="h-4 w-4" />
    },
    {
      id: 3,
      title: "Achievement unlocked",
      description: "You've completed 5 lessons in a row!",
      time: "Yesterday",
      unread: false,
      icon: <CheckCircle className="h-4 w-4" />
    },
  ]

  // Handle search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log("Searching for:", searchQuery)
      // Could redirect to search page or filter results
      setSearchQuery("")
      setSearchOpen(false)
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  // Sample side menu items
  const mainMenuItems = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
    { href: "/analytics", icon: <BarChart2 className="h-4 w-4" />, label: "Analytics" },
    { href: "/history", icon: <History className="h-4 w-4" />, label: "History" },
    { href: "/settings", icon: <Cog className="h-4 w-4" />, label: "Settings" },
  ];

  const toolsMenuItems = [
    { href: "/recordings", icon: <Video className="h-4 w-4" />, label: "Recordings" },
    { href: "/dictionary", icon: <Book className="h-4 w-4" />, label: "Dictionary" },
    { href: "/learn", icon: <GraduationCap className="h-4 w-4" />, label: "Learn" },
    { href: "/translate", icon: <MessageSquare className="h-4 w-4" />, label: "Translate" },
    { href: "/features", icon: <Layers className="h-4 w-4" />, label: "All Features" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-500/90 to-purple-600/90 backdrop-blur-md shadow-lg dark:from-indigo-950 dark:to-purple-950 z-50 flex items-center px-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              id="menuToggle"
              className="text-white/90 hover:text-white transition-colors"
              onClick={() => setSideMenuOpen(!sideMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-md">
                <HandMetal className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-white">
                SLAT
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 mx-8">
            <ul className="flex gap-6">
              <NavItem href="/" icon={<Home className="h-4 w-4" />} label="Dashboard" />
              <NavItem href="/analytics" icon={<BarChart2 className="h-4 w-4" />} label="Analytics" />
              <NavItem href="/history" icon={<History className="h-4 w-4" />} label="History" />
              <NavItem href="/settings" icon={<Cog className="h-4 w-4" />} label="Settings" />
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search anything..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-primary dark:focus:border-primary dark:text-white transition-colors"
                        autoFocus
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Try searching for: signs, lessons, words...
                    </div>
                  </form>
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Notifications"
              >
              <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
                    <button className="text-xs text-primary hover:underline">Mark all as read</button>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-start gap-3 ${
                              notification.unread ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                            }`}
                          >
                            <div className={`mt-1 p-1.5 rounded-full ${notification.unread ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                                  {notification.time}
              </span>
            </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                {notification.description}
                              </p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/notifications"
                      className="block text-center text-xs text-primary hover:underline p-1"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center text-white shadow-sm">
                <User className="h-5 w-5" />
              </div>
                <span className="font-medium text-white hidden sm:inline">User</span>
                <ChevronDown className="h-4 w-4 text-white hidden sm:block" />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">User Name</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">user@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Your Profile</span>
                    </Link>
                    <Link 
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Cog className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <Link 
                      href="/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/logout"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div
        id="side-menu"
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sideMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with matching gradient */}
        <div className="bg-gradient-to-r from-indigo-500/90 to-purple-600/90 flex items-center justify-between p-4 h-16 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-md">
              <HandMetal className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-xl font-bold text-white">SLAT</span>
          </div>
          <button
            onClick={() => setSideMenuOpen(false)}
            className="text-white/90 hover:text-white p-1.5 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <div className="px-4 py-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              MAIN MENU
            </h3>
            <ul className="space-y-2">
              {mainMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="w-5 h-5 mr-3 flex items-center justify-center">
                        <span className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}>
                          {item.icon}
                        </span>
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-4 py-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              TOOLS
            </h3>
            <ul className="space-y-2">
              {toolsMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="w-5 h-5 mr-3 flex items-center justify-center">
                        <span className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}>
                          {item.icon}
                        </span>
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Toggle dark mode</span>
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="mr-2 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile when side menu is open */}
      {sideMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSideMenuOpen(false)}
        />
      )}
    </>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <Link
        href={href}
        className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center ${
          isActive
            ? "text-white bg-white/20"
            : "text-white/80 hover:text-white hover:bg-white/10"
        } transition-colors`}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </Link>
    </li>
  )
}
