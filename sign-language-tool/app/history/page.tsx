"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  Filter, 
  LineChart, 
  List, 
  Play, 
  Search, 
  Star, 
  ThumbsUp, 
  Trash2, 
  Trophy, 
  Video
} from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock history data
const practiceSessionsData = [
  {
    id: 1,
    date: "Today, 10:25 AM",
    duration: "8 minutes",
    category: "Alphabet",
    signs: 12,
    accuracy: 92,
    saved: true
  },
  {
    id: 2,
    date: "Yesterday, 3:15 PM",
    duration: "15 minutes",
    category: "Greetings",
    signs: 18,
    accuracy: 85,
    saved: true
  },
  {
    id: 3,
    date: "Nov 15, 2023, 5:30 PM",
    duration: "12 minutes",
    category: "Numbers",
    signs: 15,
    accuracy: 78,
    saved: true
  },
  {
    id: 4,
    date: "Nov 14, 2023, 2:45 PM",
    duration: "5 minutes",
    category: "Family",
    signs: 8,
    accuracy: 90,
    saved: false
  },
  {
    id: 5,
    date: "Nov 12, 2023, 7:10 PM",
    duration: "20 minutes",
    category: "Conversation",
    signs: 25,
    accuracy: 88,
    saved: true
  }
]

const completedLessonsData = [
  {
    id: 1,
    title: "Introduction to ASL Alphabet",
    completedDate: "Nov 16, 2023",
    category: "Alphabet",
    score: 95,
    progress: 100
  },
  {
    id: 2,
    title: "Basic Greetings and Introductions",
    completedDate: "Nov 14, 2023",
    category: "Greetings",
    score: 88,
    progress: 100
  },
  {
    id: 3,
    title: "Counting and Numbers 1-20",
    completedDate: "Nov 10, 2023",
    category: "Numbers",
    score: 92,
    progress: 100
  },
  {
    id: 4,
    title: "Family Members and Relationships",
    completedDate: "Nov 5, 2023",
    category: "Family",
    score: 85,
    progress: 100
  },
  {
    id: 5,
    title: "Basic Conversation Phrases",
    completedDate: "Oct 28, 2023",
    category: "Conversation",
    score: 90,
    progress: 100
  }
]

const achievementsData = [
  {
    id: 1,
    title: "Perfect Alphabet",
    description: "Mastered all alphabet signs with at least 95% accuracy",
    earnedDate: "Nov 16, 2023",
    icon: <CheckCircle2 className="h-5 w-5 text-indigo-600" />
  },
  {
    id: 2,
    title: "Consistent Learner",
    description: "Completed practice sessions for 7 consecutive days",
    earnedDate: "Nov 14, 2023",
    icon: <Calendar className="h-5 w-5 text-indigo-600" />
  },
  {
    id: 3,
    title: "Conversation Starter",
    description: "Successfully completed all basic conversation lessons",
    earnedDate: "Oct 30, 2023",
    icon: <ThumbsUp className="h-5 w-5 text-indigo-600" />
  }
]

const weeklyProgressData = [
  { day: "Mon", signs: 32, minutes: 15 },
  { day: "Tue", signs: 45, minutes: 22 },
  { day: "Wed", signs: 28, minutes: 12 },
  { day: "Thu", signs: 38, minutes: 18 },
  { day: "Fri", signs: 42, minutes: 20 },
  { day: "Sat", signs: 35, minutes: 16 },
  { day: "Sun", signs: 25, minutes: 10 }
]

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("sessions")
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const getFilteredSessions = () => {
    return practiceSessionsData.filter(session => {
      const matchesCategory = filterCategory === "all" || session.category.toLowerCase() === filterCategory.toLowerCase()
      const matchesSearch = searchQuery === "" || 
        session.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.date.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }
  
  const filteredSessions = getFilteredSessions()
  
  // Add handlers for button actions
  const handleExportHistory = () => {
    alert("Exporting history data...")
    // Actual implementation would handle exporting data to CSV or PDF
  }
  
  const handleReviewSession = (sessionId: number) => {
    alert(`Opening review for session ${sessionId}`)
    // Actual implementation would navigate to review page
  }
  
  const handleDeleteSession = (sessionId: number) => {
    if (confirm(`Are you sure you want to delete session ${sessionId}?`)) {
      alert(`Session ${sessionId} deleted`)
      // Actual implementation would remove the session from data
    }
  }
  
  const handleReviewLesson = (lessonId: number) => {
    alert(`Opening lesson review for lesson ${lessonId}`)
    // Actual implementation would navigate to lesson review page
  }

  return (
    <div className="container py-6">
      <PageHeader 
        title="Learning History" 
        description="Review your practice sessions, completed lessons, and progress over time"
      />
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-gradient-to-r from-indigo-100 to-purple-100">
          <TabsTrigger value="sessions" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Video className="h-4 w-4 mr-2" />
            Practice Sessions
          </TabsTrigger>
          <TabsTrigger value="lessons" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <List className="h-4 w-4 mr-2" />
            Completed Lessons
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <LineChart className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
            </TabsList>
        
        <TabsContent value="sessions" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
              <Input
                    placeholder="Search sessions..."
                    className="pl-10 border-indigo-200 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
                <div className="w-full sm:w-auto">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40 border-indigo-200 focus:ring-indigo-500">
                      <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="alphabet">Alphabet</SelectItem>
                      <SelectItem value="greetings">Greetings</SelectItem>
                      <SelectItem value="numbers">Numbers</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="conversation">Conversation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto"
                onClick={handleExportHistory}
              >
                <Download className="h-4 w-4 mr-2" />
                Export History
                </Button>
            </div>
            
            <div className="space-y-4">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <Card key={session.id} className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div className="p-4 sm:p-6 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <Play className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="text-lg font-medium text-indigo-900">{session.category} Practice</h3>
                                <p className="text-sm text-indigo-600">{session.date}</p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`w-fit ${
                                  session.accuracy >= 90 ? "bg-green-50 text-green-700 border-green-200" : 
                                  session.accuracy >= 80 ? "bg-blue-50 text-blue-700 border-blue-200" : 
                                  "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {session.accuracy}% Accuracy
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-indigo-500" />
                                <span className="text-sm text-indigo-700">{session.duration}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="flex items-center justify-center w-4 h-4 text-indigo-500">
                                  <span className="text-xs font-bold">ASL</span>
                                </span>
                                <span className="text-sm text-indigo-700">{session.signs} Signs</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-amber-500" />
                                <span className="text-sm text-indigo-700">
                                  {session.accuracy >= 90 ? "Excellent" : 
                                   session.accuracy >= 80 ? "Good" : "Needs Practice"}
                                </span>
          </div>
        </div>
                        </div>
                        </div>
                      </div>
                      <div className="p-4 sm:pr-6 flex sm:flex-col gap-2 justify-end bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-t sm:border-t-0 sm:border-l border-indigo-100">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100"
                          onClick={() => handleReviewSession(session.id)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Review
                              </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="border-purple-200">
                  <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Video className="h-12 w-12 text-indigo-300 mb-4" />
                      <h3 className="text-xl font-medium text-indigo-900 mb-2">No practice sessions found</h3>
                      <p className="text-indigo-600 max-w-md">
                        We couldn't find any practice sessions matching your search. Try adjusting your filters or start a new practice session.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
        </div>
        </TabsContent>
        
        <TabsContent value="lessons" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {completedLessonsData.map(lesson => (
              <Card key={lesson.id} className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                      {lesson.category}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {lesson.score}% Score
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-indigo-900 mt-2">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-indigo-600">
                    Completed on {lesson.completedDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Progress value={lesson.progress} className="h-2 mb-2 bg-purple-100" />
                  <div className="flex justify-between items-center text-sm mt-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-indigo-700">Completed</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100" onClick={() => handleReviewLesson(lesson.id)}>
                      Review Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {achievementsData.map(achievement => (
              <Card key={achievement.id} className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 shadow-inner border border-indigo-200">
                      {achievement.icon}
                    </div>
                    <h3 className="text-lg font-medium text-indigo-900 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-indigo-600 mb-3">{achievement.description}</p>
                    <Badge variant="outline" className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200">
                      Earned on {achievement.earnedDate}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Locked achievement example */}
            <Card className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow opacity-70">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-inner border border-gray-200">
                    <Trophy className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Expert Signer</h3>
                  <p className="text-sm text-gray-600 mb-3">Complete 50 practice sessions with at least 90% accuracy</p>
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                    9/50 Sessions Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-2 border-purple-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-indigo-900">Weekly Progress</CardTitle>
                <CardDescription className="text-indigo-600">Number of signs practiced and minutes spent</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] flex items-end justify-between">
                  {weeklyProgressData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="h-[200px] flex flex-col items-center justify-end gap-1 mb-2">
                        <div 
                          className="w-8 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm" 
                          style={{ height: `${(day.signs / 50) * 100}%` }}
                        ></div>
                        <div 
                          className="w-8 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm" 
                          style={{ height: `${(day.minutes / 25) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-indigo-700">{day.day}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-sm"></div>
                    <span className="text-sm text-indigo-700">Signs Practiced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm"></div>
                    <span className="text-sm text-indigo-700">Minutes Spent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-indigo-700">Total Signs Learned</span>
                        <span className="text-sm font-medium text-indigo-900">245</span>
                      </div>
                      <Progress value={82} className="h-2 bg-purple-100" />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-indigo-600">82% of monthly goal</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-indigo-700">Practice Sessions</span>
                        <span className="text-sm font-medium text-indigo-900">18</span>
                      </div>
                      <Progress value={72} className="h-2 bg-purple-100" />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-indigo-600">72% of monthly goal</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-indigo-700">Total Practice Time</span>
                        <span className="text-sm font-medium text-indigo-900">3h 45m</span>
                      </div>
                      <Progress value={65} className="h-2 bg-purple-100" />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-indigo-600">65% of monthly goal</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-indigo-700">Average Accuracy</span>
                        <span className="text-sm font-medium text-indigo-900">87%</span>
                      </div>
                      <Progress value={87} className="h-2 bg-purple-100" />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-indigo-600">87% of target accuracy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Most Practiced</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          Alphabet
                        </Badge>
                        <span className="text-sm text-indigo-700">Letters A-Z</span>
                      </div>
                      <span className="text-sm font-medium text-indigo-900">42 practices</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Greetings
                        </Badge>
                        <span className="text-sm text-indigo-700">Hello, Goodbye</span>
                      </div>
                      <span className="text-sm font-medium text-indigo-900">38 practices</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200">
                          Numbers
                        </Badge>
                        <span className="text-sm text-indigo-700">1-20</span>
                      </div>
                      <span className="text-sm font-medium text-indigo-900">26 practices</span>
          </div>
        </div>
                </CardContent>
      </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
