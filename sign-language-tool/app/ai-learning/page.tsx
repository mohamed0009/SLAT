"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Zap, Brain, Star, Sparkles, PenTool, MessageSquare, CheckCircle, PlayCircle, Video, BarChart, Lock, Lightbulb } from "lucide-react"
import Link from "next/link"

// Custom gradient progress component
const GradientProgress = ({ value }: { value: number }) => {
  return (
    <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default function AILearningPage() {
  const [activeTab, setActiveTab] = useState("interactive")

  return (
    <div className="container py-8">
      <PageHeader
        title="AI-Powered Learning"
        description="Learn sign language more effectively with our advanced AI learning tools"
      />

      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid sm:w-auto grid-cols-3 bg-gradient-to-r from-indigo-100 to-purple-100">
            <TabsTrigger value="interactive" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Interactive
            </TabsTrigger>
            <TabsTrigger value="personalized" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Personalized
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Insights
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="interactive">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-indigo-800">Real-time Feedback</CardTitle>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">Popular</Badge>
                </div>
                <CardDescription className="text-indigo-700">
                  Get instant feedback on your signing technique
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-full bg-indigo-100">
                    <MessageSquare className="h-10 w-10 text-indigo-600" />
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Precise motion detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Detailed tips for improvement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Progress tracking over time</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Link href="/ai-learning/real-time-feedback" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Try Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-indigo-800">Virtual Practice Partner</CardTitle>
                <CardDescription className="text-indigo-700">
                  Practice conversations with our AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-full bg-indigo-100">
                    <Brain className="h-10 w-10 text-indigo-600" />
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Realistic conversation scenarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Adaptive difficulty levels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Different conversation topics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Link href="/ai-learning/virtual-practice" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Conversation
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-indigo-800">Video Analysis</CardTitle>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">New</Badge>
                </div>
                <CardDescription className="text-indigo-700">
                  Upload videos for detailed sign analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-full bg-indigo-100">
                    <Video className="h-10 w-10 text-indigo-600" />
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Frame-by-frame breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Side-by-side comparisons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Shareable progress reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Link href="/ai-learning/video-analysis" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personalized">
          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-indigo-800">Personal Learning Path</CardTitle>
                <CardDescription className="text-indigo-700">
                  Custom learning journey based on your progress and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-800 mb-4">Your Current Journey</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-indigo-800">Beginner Phrases</span>
                          <span className="text-sm font-medium text-indigo-600">85%</span>
                        </div>
                        <GradientProgress value={85} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-indigo-800">Alphabet Mastery</span>
                          <span className="text-sm font-medium text-indigo-600">62%</span>
                        </div>
                        <GradientProgress value={62} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-indigo-800">Conversational Skills</span>
                          <span className="text-sm font-medium text-indigo-600">30%</span>
                        </div>
                        <GradientProgress value={30} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-indigo-800">Cultural Context</span>
                          <span className="text-sm font-medium text-indigo-600">15%</span>
                        </div>
                        <GradientProgress value={15} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-indigo-800 mb-4">Recommended Next Steps</h3>
                    <div className="space-y-4">
                      <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-indigo-100">
                          <Zap className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-indigo-800">Complete Daily Challenge</p>
                          <p className="text-sm text-indigo-600">5 more signs to review today</p>
                        </div>
                      </div>
                      <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-indigo-100">
                          <GraduationCap className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-indigo-800">Continue Alphabet Course</p>
                          <p className="text-sm text-indigo-600">Letters N-Z remaining</p>
                        </div>
                      </div>
                      <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-indigo-100">
                          <Star className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-indigo-800">Attempt Practice Quiz</p>
                          <p className="text-sm text-indigo-600">Test your recent learning</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4 pb-6">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  Continue My Learning Path
                </Button>
              </CardFooter>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <span>Smart Recommendations</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-indigo-700 mb-4">Based on your learning style and progress:</p>
                  <div className="space-y-3">
                    <div className="p-3 border border-indigo-100 rounded-lg hover:bg-indigo-50/50 transition-colors flex items-center gap-3 cursor-pointer">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Visual Learning Materials</span>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg hover:bg-indigo-50/50 transition-colors flex items-center gap-3 cursor-pointer">
                      <PenTool className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Practice-Based Exercises</span>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg hover:bg-indigo-50/50 transition-colors flex items-center gap-3 cursor-pointer">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Spaced Repetition Sessions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-800">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-indigo-600" />
                      <span>Premium AI Features</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-indigo-700 mb-4">Upgrade to access advanced learning tools:</p>
                  <div className="space-y-3">
                    <div className="p-3 border border-indigo-100 rounded-lg bg-gray-50/80 flex items-center gap-3">
                      <Badge variant="outline" className="text-indigo-600 border-indigo-200">PRO</Badge>
                      <span className="font-medium text-gray-500">AI Speech-to-Sign Generation</span>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg bg-gray-50/80 flex items-center gap-3">
                      <Badge variant="outline" className="text-indigo-600 border-indigo-200">PRO</Badge>
                      <span className="font-medium text-gray-500">Advanced Motion Analysis</span>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg bg-gray-50/80 flex items-center gap-3">
                      <Badge variant="outline" className="text-indigo-600 border-indigo-200">PRO</Badge>
                      <span className="font-medium text-gray-500">Unlimited Practice Sessions</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-4 pb-6">
                  <Button variant="outline" className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                    Upgrade to Pro
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-indigo-800">Learning Insights Dashboard</CardTitle>
                <CardDescription className="text-indigo-700">
                  Detailed analytics on your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-white rounded-full">
                        <GraduationCap className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-800">246</h3>
                    <p className="text-sm text-indigo-600">Signs Learned</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-white rounded-full">
                        <Zap className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-800">14.2</h3>
                    <p className="text-sm text-indigo-600">Hours Practiced</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-white rounded-full">
                        <Star className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-800">87%</h3>
                    <p className="text-sm text-indigo-600">Accuracy Rate</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4">Weekly Progress</h3>
                  <div className="h-[200px] bg-indigo-50/50 rounded-lg border border-indigo-100 p-4 flex items-end justify-between">
                    {/* Simplified chart representation */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const heights = [65, 40, 85, 70, 55, 95, 75]
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div className="h-[150px] flex flex-col items-center justify-end mb-2">
                            <div
                              className="w-10 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm"
                              style={{ height: `${heights[index]}%` }}
                            ></div>
                          </div>
                          <div className="text-xs font-medium text-indigo-700">{day}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4 pb-6">
                <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <span>Strength Areas</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-center justify-between">
                      <span className="font-medium text-indigo-800">Alphabet Signs</span>
                      <Badge className="bg-green-100 text-green-800">92% Accuracy</Badge>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-center justify-between">
                      <span className="font-medium text-indigo-800">Greetings</span>
                      <Badge className="bg-green-100 text-green-800">88% Accuracy</Badge>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-center justify-between">
                      <span className="font-medium text-indigo-800">Family Terms</span>
                      <Badge className="bg-green-100 text-green-800">85% Accuracy</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-800">
                    <div className="flex items-center gap-2">
                      <PenTool className="h-5 w-5 text-indigo-600" />
                      <span>Areas to Improve</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-center justify-between">
                      <span className="font-medium text-indigo-800">Numbers</span>
                      <Badge className="bg-amber-100 text-amber-800">68% Accuracy</Badge>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-center justify-between">
                      <span className="font-medium text-indigo-800">Directional Signs</span>
                      <Badge className="bg-amber-100 text-amber-800">64% Accuracy</Badge>
                    </div>
                    <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50/50 flex items-center justify-between">
                      <span className="font-medium text-indigo-800">Complex Phrases</span>
                      <Badge className="bg-red-100 text-red-800">52% Accuracy</Badge>
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