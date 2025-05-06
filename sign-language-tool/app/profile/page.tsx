"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/avatar"
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Download, 
  Edit2, 
  Fingerprint, 
  GraduationCap, 
  LayoutDashboard, 
  Lock, 
  Save, 
  Shield, 
  Star, 
  Trophy, 
  User, 
  Users 
} from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

// Mock user data
const userData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  joined: "September 2023",
  role: "Student",
  bio: "Passionate about learning sign language to better communicate with my deaf cousin. I'm currently focused on ASL basics and everyday conversations.",
  avatarUrl: "",
  location: "New York, USA",
  language: "English",
  preferences: {
    emailNotifications: true,
    practiceReminders: true,
    weeklyReports: true,
    twoFactorAuth: false,
    darkMode: true
  }
}

// Mock stats
const learningStats = {
  daysActive: 47,
  coursesCompleted: 2,
  coursesInProgress: 1,
  totalSignsLearned: 124,
  totalPracticeTime: "32 hours",
  averageAccuracy: "87%",
  streak: 12,
  level: "Intermediate",
  xp: 2450,
  nextLevelXp: 3000,
  badges: [
    { id: 1, name: "Alphabet Master", date: "Oct 12, 2023", icon: <BookOpen className="h-5 w-5" /> },
    { id: 2, name: "7-Day Streak", date: "Oct 30, 2023", icon: <Star className="h-5 w-5" /> },
    { id: 3, name: "Conversation Starter", date: "Nov 5, 2023", icon: <Users className="h-5 w-5" /> },
  ],
  recentCourses: [
    { id: 1, name: "ASL Basics for Beginners", progress: 100, completedDate: "Oct 20, 2023" },
    { id: 2, name: "Everyday Conversations", progress: 100, completedDate: "Nov 10, 2023" },
    { id: 3, name: "Professional Sign Language", progress: 35, completedDate: null },
  ]
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(userData)
  const [preferences, setPreferences] = useState(userData.preferences)
  
  const handleProfileSave = () => {
    setIsEditing(false)
    toast.success("Profile updated successfully")
  }
  
  const handlePreferenceToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
    toast.success(`Preference updated`)
  }
  
  return (
    <div className="container py-6">
      <PageHeader 
        title="Your Profile" 
        description="Manage your account and view your learning progress"
      />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 mb-6">
        {/* Sidebar with user info */}
        <div className="col-span-1">
          <Card className="border-purple-200 shadow-md overflow-hidden">
            <CardHeader className="text-center pb-2 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex flex-col items-center">
                <Avatar 
                  name={profileData.name} 
                  size="lg" 
                  className="h-24 w-24 mb-4 ring-2 ring-indigo-200 shadow-lg"
                />
                <CardTitle className="text-xl text-indigo-900">{profileData.name}</CardTitle>
                <CardDescription className="text-sm text-indigo-600">
                  {profileData.email}
                </CardDescription>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                    {learningStats.level}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {profileData.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-indigo-500 font-medium">Member since</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span className="text-indigo-700">{profileData.joined}</span>
                </div>
              </div>
              
              {profileData.location && (
                <div className="space-y-1">
                  <div className="text-xs text-indigo-500 font-medium">Location</div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="text-indigo-700">{profileData.location}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <div className="text-xs text-indigo-500 font-medium">Learning stats</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-purple-800">Streak</span>
                    </div>
                    <span className="font-medium text-purple-700">{learningStats.streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <span className="text-purple-800">Signs learned</span>
                    </div>
                    <span className="font-medium text-purple-700">{learningStats.totalSignsLearned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-500" />
                      <span className="text-purple-800">Courses completed</span>
                    </div>
                    <span className="font-medium text-purple-700">{learningStats.coursesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span className="text-purple-800">Practice time</span>
                    </div>
                    <span className="font-medium text-purple-700">{learningStats.totalPracticeTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-500 font-medium">Level progress</span>
                  <span className="text-xs font-medium text-indigo-700">{learningStats.xp}/{learningStats.nextLevelXp} XP</span>
                </div>
                <Progress value={(learningStats.xp / learningStats.nextLevelXp) * 100} className="bg-purple-100" />
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <Button size="sm" variant="outline" className="w-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800" onClick={() => setActiveTab("stats")}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                View detailed stats
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="col-span-1 lg:col-span-3">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-indigo-100 to-purple-100">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">Profile</TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">Learning Stats</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div>
                    <CardTitle className="text-indigo-900">Personal Information</CardTitle>
                    <CardDescription className="text-indigo-600">Manage your personal profile details</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    size="sm" 
                    className={isEditing ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"}
                    onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {isEditing ? (
                    // Editing form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={profileData.name} 
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={profileData.email} 
                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={profileData.location} 
                            onChange={e => setProfileData({...profileData, location: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Input 
                            id="language" 
                            value={profileData.language} 
                            onChange={e => setProfileData({...profileData, language: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea 
                          id="bio"
                          className="w-full min-h-[100px] p-3 border rounded-md bg-background"
                          value={profileData.bio} 
                          onChange={e => setProfileData({...profileData, bio: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">About Me</h3>
                        <p className="text-gray-700">{profileData.bio}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                          <p className="text-gray-700">{profileData.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                          <p className="text-gray-700">{profileData.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                          <p className="text-gray-700">{profileData.location}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Language</h3>
                          <p className="text-gray-700">{profileData.language}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6 space-y-6">
              {/* Learning progress overview */}
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Learning Overview</CardTitle>
                  <CardDescription className="text-indigo-600">Your learning journey at a glance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 text-center shadow-sm border border-indigo-200">
                      <div className="text-indigo-600 flex justify-center mb-2">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-indigo-700">{learningStats.daysActive}</div>
                      <div className="text-xs text-indigo-600">Days Active</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center shadow-sm border border-purple-200">
                      <div className="text-purple-600 flex justify-center mb-2">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-purple-700">{learningStats.coursesCompleted}</div>
                      <div className="text-xs text-purple-600">Courses Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg p-4 text-center shadow-sm border border-violet-200">
                      <div className="text-violet-600 flex justify-center mb-2">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-violet-700">{learningStats.totalSignsLearned}</div>
                      <div className="text-xs text-violet-600">Signs Learned</div>
                    </div>
                    <div className="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-lg p-4 text-center shadow-sm border border-fuchsia-200">
                      <div className="text-fuchsia-600 flex justify-center mb-2">
                        <Star className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-fuchsia-700">{learningStats.streak}</div>
                      <div className="text-xs text-fuchsia-600">Day Streak</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        <span className="text-indigo-900">Total practice time</span>
                      </div>
                      <span className="font-medium text-purple-700">{learningStats.totalPracticeTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 8-6 4 6 4V8Z"/>
                          <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                        </svg>
                        <span className="text-indigo-900">Average accuracy</span>
                      </div>
                      <span className="font-medium text-purple-700">{learningStats.averageAccuracy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent courses */}
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Course Progress</CardTitle>
                  <CardDescription className="text-indigo-600">Your recent and ongoing courses</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {learningStats.recentCourses.map(course => (
                      <div key={course.id} className="border border-indigo-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-indigo-900">{course.name}</h3>
                          <Badge variant={course.progress === 100 ? "default" : "outline"} className={course.progress === 100 ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "border-indigo-300 text-indigo-700 bg-indigo-50"}>
                            {course.progress === 100 ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <Progress value={course.progress} className="h-2 mb-2 bg-purple-100" />
                        <div className="flex items-center justify-between text-sm text-indigo-600">
                          <span>{course.progress}% complete</span>
                          {course.completedDate && <span>Completed: {course.completedDate}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Achievements */}
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Achievements</CardTitle>
                  <CardDescription className="text-indigo-600">Badges and milestones you've earned</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {learningStats.badges.map(badge => (
                      <div key={badge.id} className="border border-indigo-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-2 shadow-inner">
                          {badge.icon}
                        </div>
                        <h3 className="font-medium mb-1 text-indigo-800">{badge.name}</h3>
                        <p className="text-xs text-indigo-600">Earned on {badge.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <Button variant="outline" className="w-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800">
                    <Trophy className="h-4 w-4 mr-2" />
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6 space-y-6">
              {/* Notification Preferences */}
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Notification Preferences</CardTitle>
                  <CardDescription className="text-indigo-600">Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-indigo-900">Email Notifications</div>
                      <div className="text-sm text-indigo-600">Receive email notifications about your learning progress</div>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications} 
                      onCheckedChange={() => handlePreferenceToggle('emailNotifications')} 
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-indigo-900">Practice Reminders</div>
                      <div className="text-sm text-indigo-600">Receive reminders for daily practice sessions</div>
                    </div>
                    <Switch 
                      checked={preferences.practiceReminders} 
                      onCheckedChange={() => handlePreferenceToggle('practiceReminders')} 
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-indigo-900">Weekly Progress Reports</div>
                      <div className="text-sm text-indigo-600">Get weekly summaries of your learning progress</div>
                    </div>
                    <Switch 
                      checked={preferences.weeklyReports} 
                      onCheckedChange={() => handlePreferenceToggle('weeklyReports')} 
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Settings */}
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Security Settings</CardTitle>
                  <CardDescription className="text-indigo-600">Manage your account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-indigo-900">Two-Factor Authentication</div>
                      <div className="text-sm text-indigo-600">Add an extra layer of security to your account</div>
                    </div>
                    <Switch 
                      checked={preferences.twoFactorAuth} 
                      onCheckedChange={() => handlePreferenceToggle('twoFactorAuth')} 
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full sm:w-auto border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800" onClick={() => toast.info("Password change dialog would open here")}>
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Account Actions */}
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Account Actions</CardTitle>
                  <CardDescription className="text-indigo-600">Manage your account data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <Button variant="outline" className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800" onClick={() => toast.info("Data would be downloaded")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Your Data
                    </Button>
                    <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 mt-2 sm:mt-0">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Request Account Deletion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 