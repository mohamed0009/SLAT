"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Check, Clock, FileText, GraduationCap, HandMetal, Play, Star, Video } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function EducationalFeatures() {
  const [activeTab, setActiveTab] = useState("courses")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  // Sample courses data
  const coursesData = [
    {
      id: 1,
      title: "Introduction to Sign Language",
      description: "Learn the basics of sign language with this beginner-friendly course.",
      level: "Beginner",
      lessons: 12,
      duration: "4 weeks",
      progress: 75,
      image:
        "https://images.unsplash.com/photo-1531325082793-ca7c9db6a4c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Everyday Conversations",
      description: "Master common phrases and expressions for daily communication.",
      level: "Intermediate",
      lessons: 18,
      duration: "6 weeks",
      progress: 30,
      image:
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Professional Sign Language",
      description: "Learn specialized vocabulary for workplace environments.",
      level: "Advanced",
      lessons: 24,
      duration: "8 weeks",
      progress: 0,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Medical Terminology in Sign Language",
      description: "Specialized course for healthcare professionals.",
      level: "Specialized",
      lessons: 20,
      duration: "7 weeks",
      progress: 0,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  // Sample lessons data
  const lessonsData = [
    {
      id: 1,
      title: "Alphabet and Numbers",
      description: "Learn to sign the alphabet and numbers 1-20.",
      duration: "30 min",
      completed: true,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Greetings and Introductions",
      description: "Master common greetings and how to introduce yourself.",
      duration: "45 min",
      completed: true,
      image:
        "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Family and Relationships",
      description: "Learn signs for family members and relationships.",
      duration: "40 min",
      completed: true,
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Colors and Descriptions",
      description: "Learn to sign colors and basic descriptive words.",
      duration: "35 min",
      completed: false,
      current: true,
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Food and Dining",
      description: "Master vocabulary related to food and dining experiences.",
      duration: "50 min",
      completed: false,
      image:
        "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  // Sample quiz data
  const quizData = [
    {
      id: 1,
      title: "Basic Signs Quiz",
      description: "Test your knowledge of basic sign language vocabulary.",
      questions: 10,
      timeLimit: "15 minutes",
      difficulty: "Easy",
      completed: true,
      score: 85,
    },
    {
      id: 2,
      title: "Conversation Comprehension",
      description: "Evaluate your ability to understand signed conversations.",
      questions: 15,
      timeLimit: "20 minutes",
      difficulty: "Medium",
      completed: false,
    },
    {
      id: 3,
      title: "Advanced Vocabulary",
      description: "Challenge yourself with advanced sign language vocabulary.",
      questions: 20,
      timeLimit: "30 minutes",
      difficulty: "Hard",
      completed: false,
    },
  ]

  // Sample practice exercises
  const practiceExercises = [
    {
      id: 1,
      title: "Mirror Practice",
      description: "Practice signing in front of a mirror to improve form.",
      duration: "15 min",
      type: "Self-Practice",
      completed: true,
    },
    {
      id: 2,
      title: "Video Recording Analysis",
      description: "Record yourself signing and analyze your technique.",
      duration: "20 min",
      type: "Recording",
      completed: false,
    },
    {
      id: 3,
      title: "Real-time Feedback",
      description: "Get real-time feedback on your signing from the AI.",
      duration: "25 min",
      type: "Interactive",
      completed: false,
    },
    {
      id: 4,
      title: "Conversation Practice",
      description: "Practice conversational signing with virtual characters.",
      duration: "30 min",
      type: "Interactive",
      completed: false,
    },
  ]

  // Handle loading state
  const handleAction = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="courses" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="lessons">
            <Video className="h-4 w-4 mr-2" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <FileText className="h-4 w-4 mr-2" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="practice">
            <HandMetal className="h-4 w-4 mr-2" />
            Practice
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              Available Courses
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className="absolute top-3 right-3"
                      variant={
                        course.level === "Beginner"
                          ? "default"
                          : course.level === "Intermediate"
                            ? "secondary"
                            : course.level === "Advanced"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full mt-2"
                          variant={course.progress > 0 ? "default" : "outline"}
                          onClick={() => setSelectedCourse(course.id)}
                        >
                          {course.progress > 0 ? "Continue" : "Start Course"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{course.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">Course Overview</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">Level</div>
                              <div>{course.level}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">Duration</div>
                              <div>{course.duration}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">Lessons</div>
                              <div>{course.lessons} lessons</div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">Certificate</div>
                              <div>Yes, upon completion</div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {}}>
                              View Syllabus
                            </Button>
                            <Button onClick={handleAction}>
                              {course.progress > 0 ? "Continue Course" : "Enroll Now"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Your Learning Progress
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <Card className="p-4">
                  <div className="text-3xl font-bold text-primary mb-1">2</div>
                  <div className="text-sm text-gray-500">Courses in Progress</div>
                </Card>
                <Card className="p-4">
                  <div className="text-3xl font-bold text-primary mb-1">15</div>
                  <div className="text-sm text-gray-500">Lessons Completed</div>
                </Card>
                <Card className="p-4">
                  <div className="text-3xl font-bold text-primary mb-1">8.5</div>
                  <div className="text-sm text-gray-500">Hours of Learning</div>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Overall Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Introduction to Sign Language</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Everyday Conversations</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Curriculum</span>
                    <span>42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Video className="h-5 w-5 mr-2 text-primary" />
              Current Lessons
            </h3>

            <div className="space-y-4">
              {lessonsData.map((lesson) => (
                <Dialog key={lesson.id}>
                  <DialogTrigger asChild>
                    <div
                      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg border ${
                        lesson.current ? "bg-indigo-50 border-indigo-200" : ""
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                          lesson.completed
                            ? "bg-green-100 text-green-600"
                            : lesson.current
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lesson.completed ? <Check className="h-5 w-5" /> : <span>{lesson.id}</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-gray-500">{lesson.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">{lesson.duration}</span>
                        {lesson.current && (
                          <Badge variant="outline" className="mt-1">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{lesson.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                        <img
                          src={lesson.image || "/placeholder.svg"}
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-4">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Lesson Description</h4>
                          <Badge>{lesson.duration}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Playback Speed</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            defaultValue={[1]}
                            min={0.5}
                            max={2}
                            step={0.1}
                            onValueChange={(value) => setPlaybackSpeed(value[0])}
                          />
                          <span className="text-sm">{playbackSpeed}x</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Learning Objectives</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                          <li>Understand the basic hand positions</li>
                          <li>Master the correct finger movements</li>
                          <li>Practice the appropriate facial expressions</li>
                          <li>Combine elements into fluid signs</li>
                        </ul>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Notes
                        </Button>
                        <Button onClick={handleAction}>{lesson.completed ? "Review Lesson" : "Start Lesson"}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Supplementary Materials
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Sign Language Vocabulary Guide</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Comprehensive reference guide with common signs and their variations.
                  </p>
                  <Button variant="outline" size="sm">
                    Download PDF
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Practice Videos Collection</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Additional practice videos to reinforce your learning.</p>
                  <Button variant="outline" size="sm">
                    View Videos
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Cultural Context Guide</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Understanding the cultural aspects of sign language communication.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Online
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <HandMetal className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Interactive Exercises</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Additional exercises to practice your sign language skills.
                  </p>
                  <Button variant="outline" size="sm">
                    Start Exercises
                  </Button>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Knowledge Assessment
            </h3>

            <div className="space-y-4">
              {quizData.map((quiz) => (
                <div key={quiz.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-gray-500">{quiz.description}</p>
                      </div>
                    </div>
                    {quiz.completed ? (
                      <Badge className="bg-green-500">Completed</Badge>
                    ) : (
                      <Badge variant="outline">Not Started</Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{quiz.timeLimit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Difficulty: {quiz.difficulty}</span>
                      </div>
                    </div>

                    {quiz.completed && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-700">Your Score</span>
                          </div>
                          <span className="font-bold text-green-700">{quiz.score}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button onClick={handleAction}>{quiz.completed ? "Review Quiz" : "Start Quiz"}</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Your Quiz Performance
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <Card className="p-4">
                  <div className="text-3xl font-bold text-primary mb-1">1/3</div>
                  <div className="text-sm text-gray-500">Quizzes Completed</div>
                </Card>
                <Card className="p-4">
                  <div className="text-3xl font-bold text-primary mb-1">85%</div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </Card>
                <Card className="p-4">
                  <div className="text-3xl font-bold text-primary mb-1">10</div>
                  <div className="text-sm text-gray-500">Questions Answered</div>
                </Card>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Areas for Improvement</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Finger Spelling Accuracy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Facial Expressions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Basic Vocabulary (Strong)</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <HandMetal className="h-5 w-5 mr-2 text-primary" />
              Practice Exercises
            </h3>

            <div className="space-y-4">
              {practiceExercises.map((exercise) => (
                <div key={exercise.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <HandMetal className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{exercise.title}</h4>
                        <p className="text-sm text-gray-500">{exercise.description}</p>
                      </div>
                    </div>
                    <Badge variant={exercise.type === "Interactive" ? "default" : "outline"}>{exercise.type}</Badge>
                  </div>

                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{exercise.duration}</span>
                    </div>
                    <Button onClick={handleAction}>{exercise.completed ? "Practice Again" : "Start Practice"}</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Video className="h-5 w-5 mr-2 text-primary" />
              Practice with Video Analysis
            </h3>

            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
                <Video className="h-12 w-12 text-gray-300" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <Button onClick={handleAction}>Start Video Practice</Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">How Video Analysis Works</h4>
                <ol className="space-y-2 list-decimal list-inside text-sm text-gray-600">
                  <li>Record yourself signing using your webcam</li>
                  <li>Our AI analyzes your hand movements and gestures</li>
                  <li>Receive real-time feedback on your technique</li>
                  <li>Get suggestions for improvement</li>
                  <li>Track your progress over time</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HandMetal className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Hand Position</h4>
                  </div>
                  <p className="text-sm text-gray-600">Practice correct hand positions for different signs.</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Movement Flow</h4>
                  </div>
                  <p className="text-sm text-gray-600">Work on smooth transitions between signs.</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Speed Control</h4>
                  </div>
                  <p className="text-sm text-gray-600">Practice signing at different speeds.</p>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
