"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Book,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  HandMetal,
  LucideIcon,
  PlayCircle,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react"
import { Avatar } from "@/components/avatar"
import { toast } from "sonner"

// Sample course data
const courses = [
    {
      id: 1,
    title: "ASL Basics for Beginners",
    description: "Learn the fundamental signs and grammar of American Sign Language.",
      level: "Beginner",
      duration: "4 weeks",
    lessonsCount: 24,
    progress: 35,
    imageUrl: "/images/courses/asl-basics.jpg",
    instructor: "Sarah Johnson",
    instructorRole: "Certified ASL Instructor",
    rating: 4.8,
    reviewsCount: 426,
    studentsCount: 3245,
    featured: true,
    lastAccessed: "2023-10-15T14:30:00Z",
    tags: ["alphabet", "numbers", "greetings", "fundamentals"],
    },
    {
      id: 2,
    title: "Everyday Conversations in Sign Language",
    description: "Master practical sign language for common daily interactions.",
      level: "Intermediate",
      duration: "6 weeks",
    lessonsCount: 32,
    progress: 12,
    imageUrl: "/images/courses/everyday-conversations.jpg",
    instructor: "Michael Chen",
    instructorRole: "Deaf Community Advocate",
    rating: 4.9,
    reviewsCount: 318,
    studentsCount: 2187,
    featured: true,
    lastAccessed: "2023-10-20T09:15:00Z",
    tags: ["conversation", "shopping", "travel", "dining"],
    },
    {
      id: 3,
      title: "Professional Sign Language",
    description: "Learn specialized signs for workplace and professional settings.",
      level: "Advanced",
      duration: "8 weeks",
    lessonsCount: 40,
    progress: 0,
    imageUrl: "/images/courses/professional-signing.jpg",
    instructor: "Emily Rodriguez",
    instructorRole: "Sign Language Interpreter",
    rating: 4.7,
    reviewsCount: 215,
    studentsCount: 1432,
    featured: false,
    lastAccessed: null,
    tags: ["business", "workplace", "technical", "meetings"],
  },
  {
    id: 4,
    title: "Sign Language for Healthcare",
    description: "Essential signs for medical professionals and healthcare settings.",
    level: "Intermediate",
    duration: "5 weeks",
    lessonsCount: 28,
    progress: 0,
    imageUrl: "/images/courses/healthcare-signing.jpg",
    instructor: "Dr. James Wilson",
    instructorRole: "Medical Professional & ASL Expert",
    rating: 4.6,
    reviewsCount: 186,
    studentsCount: 978,
    featured: false,
    lastAccessed: null,
    tags: ["medical", "emergency", "healthcare", "specialized"],
  },
  {
    id: 5,
    title: "Expressive Storytelling in ASL",
    description: "Learn to tell engaging stories and narratives using ASL.",
    level: "Advanced",
    duration: "6 weeks",
    lessonsCount: 30,
    progress: 0,
    imageUrl: "/images/courses/storytelling.jpg",
    instructor: "Olivia Washington",
    instructorRole: "ASL Poet & Performer",
    rating: 4.9,
    reviewsCount: 142,
    studentsCount: 764,
    featured: false,
    lastAccessed: null,
    tags: ["storytelling", "expression", "performance", "art"],
  },
  {
    id: 6,
    title: "Sign Language for Education",
    description: "Specialized signs for teachers, students, and educational settings.",
    level: "Intermediate",
    duration: "7 weeks",
    lessonsCount: 35,
      progress: 0,
    imageUrl: "/images/courses/education-signing.jpg",
    instructor: "Professor Robert Lee",
    instructorRole: "Deaf Education Specialist",
    rating: 4.7,
    reviewsCount: 198,
    studentsCount: 1245,
    featured: false,
    lastAccessed: null,
    tags: ["education", "classroom", "academic", "teaching"],
    },
  ]

// Daily challenges
const dailyChallenges = [
    {
      id: 1,
    title: "Learn 5 New Animal Signs",
    description: "Master signs for common animals like dog, cat, bird, fish, and horse.",
    points: 50,
      completed: true,
    timeEstimate: "10 min",
    },
    {
      id: 2,
    title: "Practice Number Sequences",
    description: "Count from 1-20 in sign language without hesitation.",
    points: 30,
    completed: false,
    timeEstimate: "5 min",
    },
    {
      id: 3,
    title: "Conversation Practice",
    description: "Record yourself introducing yourself in sign language.",
    points: 100,
      completed: false,
    timeEstimate: "15 min",
    },
  ]

// Learning paths
const learningPaths = [
    {
      id: 1,
    title: "Complete ASL Mastery",
    description: "A comprehensive path from beginner to advanced ASL fluency",
    courses: 5,
    duration: "6 months",
    progress: 22,
    badgeUrl: "/images/badges/master-linguist.svg",
    },
    {
      id: 2,
    title: "Professional Communication",
    description: "Focused on workplace and professional sign language skills",
    courses: 3,
    duration: "3 months",
    progress: 0,
    badgeUrl: "/images/badges/business-communicator.svg",
    },
    {
      id: 3,
    title: "Community Engagement",
    description: "Learn signs for social events, community participation, and advocacy",
    courses: 4,
    duration: "4 months",
    progress: 5,
    badgeUrl: "/images/badges/community-advocate.svg",
  },
]

// Learning achievements/badges
const achievements = [
  {
    id: 1,
    title: "Alphabet Master",
    description: "Successfully mastered all signs in the ASL alphabet",
    acquired: "Oct 12, 2023",
    imageUrl: "/images/badges/alphabet-master.svg",
    },
    {
    id: 2,
    title: "Conversation Starter",
    description: "Completed your first conversation practice session",
    acquired: "Oct 10, 2023",
    imageUrl: "/images/badges/conversation-starter.svg",
  },
  {
    id: 3,
    title: "7-Day Streak",
    description: "Practiced sign language for 7 consecutive days",
    acquired: "Oct 8, 2023",
    imageUrl: "/images/badges/seven-day-streak.svg",
  },
]

export default function LearnPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("courses")
  const [streakDays, setStreakDays] = useState(7)
  const [totalPoints, setTotalPoints] = useState(450)
  const [dailyGoalProgress, setDailyGoalProgress] = useState(65)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const startCourse = (courseId: number) => {
    toast.success("Course started! Redirecting to lesson 1...")
    // In a real app, this would navigate to the first lesson
    setTimeout(() => {
      router.push(`/learn/courses/${courseId}/lessons/1`)
    }, 1000)
  }

  const continueCourse = (courseId: number) => {
    toast.success("Resuming your progress...")
    // In a real app, this would navigate to the last accessed lesson
    setTimeout(() => {
      router.push(`/learn/courses/${courseId}/progress`)
    }, 1000)
  }

  const completeDailyChallenge = (challengeId: number) => {
    toast.success("Challenge completed! +50 points")
    setTotalPoints(prev => prev + 50)
    setDailyGoalProgress(prev => Math.min(100, prev + 25))
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Beginner</Badge>
      case "Intermediate":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Intermediate</Badge>
      case "Advanced":
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Advanced</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  if (!mounted) return null

  return (
    <div className="container py-6 pb-20">
      <PageHeader
        title="Learn Sign Language"
        description="Structured courses, daily practice, and interactive lessons to master sign language"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User progress card */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              Your Learning Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Daily Streak</span>
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-500 mr-1" />
                  <span className="text-xl font-bold">{streakDays} days</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total Points</span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="text-xl font-bold">{totalPoints}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Goal</span>
                <span className="text-sm font-medium">{dailyGoalProgress}%</span>
          </div>
              <Progress value={dailyGoalProgress} className="h-2" />
      </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
              <div className="flex space-x-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className="text-xs text-center mt-1">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily challenges card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Flame className="h-5 w-5 mr-2 text-primary" />
              Daily Challenges
            </CardTitle>
            <CardDescription>Complete these challenges to earn points and build your streak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-gray-50 border shadow-sm">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium">{challenge.title}</h3>
                      {challenge.completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                      )}
                </div>
                    <p className="text-sm text-gray-500 mb-1">{challenge.description}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{challenge.timeEstimate}</span>
                      <span className="mx-2">•</span>
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      <span>{challenge.points} points</span>
                    </div>
                  </div>
                <Button
                    size="sm" 
                    variant={challenge.completed ? "outline" : "default"}
                    disabled={challenge.completed}
                    onClick={() => completeDailyChallenge(challenge.id)}
                >
                    {challenge.completed ? "Completed" : "Complete"}
                </Button>
              </div>
            </Card>
          ))}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">
              View All Challenges
            </Button>
          </CardFooter>
        </Card>
        </div>

      <div className="mb-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Learning Resources</h2>
            <TabsList>
              <TabsTrigger value="courses" className="gap-2">
                <Book className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="paths" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Learning Paths
              </TabsTrigger>
              <TabsTrigger value="achievements" className="gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="courses" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                    {course.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 border-0">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      {getLevelBadge(course.level)}
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{course.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({course.reviewsCount})</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <div className="flex items-center mb-3">
                      <Avatar name={course.instructor} size="sm" className="mr-2" />
                      <div>
                        <p className="text-sm font-medium">{course.instructor}</p>
                        <p className="text-xs text-gray-500">{course.instructorRole}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        <span>{course.lessonsCount} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{course.studentsCount.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Self-paced</span>
                      </div>
                    </div>
                    {course.progress > 0 && (
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {course.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full" 
                      variant={course.progress > 0 ? "default" : "outline"}
                      onClick={() => course.progress > 0 ? continueCourse(course.id) : startCourse(course.id)}
                    >
                      {course.progress > 0 ? (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="paths" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningPaths.map((path) => (
                <Card key={path.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                        <GraduationCap className="h-10 w-10 text-indigo-600" />
                      </div>
                    </div>
                    <CardTitle className="text-center">{path.title}</CardTitle>
                    <CardDescription className="text-center">{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-center">
                      <div className="bg-gray-50 rounded-md p-2">
                        <p className="text-gray-500 text-xs">Courses</p>
                        <p className="font-medium">{path.courses}</p>
                      </div>
                      <div className="bg-gray-50 rounded-md p-2">
                        <p className="text-gray-500 text-xs">Duration</p>
                        <p className="font-medium">{path.duration}</p>
                      </div>
                    </div>
                    
                    {path.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Path Progress</span>
                          <span className="text-xs font-medium">{path.progress}%</span>
                  </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={path.progress > 0 ? "default" : "outline"}>
                      {path.progress > 0 ? "Continue Path" : "Start Learning Path"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                      <Trophy className="h-10 w-10 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-2">
                    <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Achieved on {new Date(achievement.acquired).toLocaleDateString()}
                    </Badge>
                  </CardContent>
                  <CardFooter className="pt-0 justify-center">
                    <Button variant="ghost" size="sm">
                      Share Achievement
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Locked achievement example */}
              <Card className="overflow-hidden bg-gray-50 border-dashed">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 relative">
                    <Trophy className="h-10 w-10 text-gray-400" />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80 rounded-full">
                      <div className="h-8 w-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
                        <span className="text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-400">30-Day Streak</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <p className="text-sm text-gray-400 mb-2">Practice sign language for 30 consecutive days</p>
                  <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                    7/30 days completed
                  </Badge>
                </CardContent>
                <CardFooter className="pt-0 justify-center">
                  <Button variant="ghost" size="sm" className="text-gray-400" disabled>
                    Locked
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-6 md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">Ready to Become Fluent in Sign Language?</h2>
              <p className="mb-4 text-indigo-100">Join our premium membership for unlimited access to all courses, personalized learning plans, and live tutoring sessions.</p>
              <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                Upgrade to Premium
              </Button>
            </div>
            <div className="p-6 flex justify-center md:w-1/3">
              <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <HandMetal className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </Card>
        </div>
    </div>
  )
}
