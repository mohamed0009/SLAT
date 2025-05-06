"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { Activity, BarChart2, HandMetal, LineChart, PieChart, TrendingUp, Users, Download, Filter } from "lucide-react"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const lineChartData = [
    { date: "Mon", accuracy: 85, confidence: 78 },
    { date: "Tue", accuracy: 88, confidence: 82 },
    { date: "Wed", accuracy: 90, confidence: 85 },
    { date: "Thu", accuracy: 92, confidence: 88 },
    { date: "Fri", accuracy: 91, confidence: 86 },
    { date: "Sat", accuracy: 93, confidence: 89 },
    { date: "Sun", accuracy: 95, confidence: 92 },
  ]

  const pieChartData = [
    { name: "Hello", value: 35 },
    { name: "Thank You", value: 25 },
    { name: "Yes", value: 15 },
    { name: "No", value: 12 },
    { name: "Please", value: 8 },
    { name: "Other", value: 5 },
  ]

  const barChartData = [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 150 },
    { name: "Mar", value: 180 },
    { name: "Apr", value: 220 },
    { name: "May", value: 280 },
    { name: "Jun", value: 350 },
  ]

  const areaChartData = [
    { date: "Mon", users: 120, sessions: 150 },
    { date: "Tue", users: 140, sessions: 170 },
    { date: "Wed", users: 160, sessions: 190 },
    { date: "Thu", users: 180, sessions: 210 },
    { date: "Fri", users: 170, sessions: 200 },
    { date: "Sat", users: 190, sessions: 220 },
    { date: "Sun", users: 210, sessions: 240 },
  ]

  const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#f97316"]
  
  // Add handlers for button actions
  const handleExportData = () => {
    alert("Exporting analytics data...")
    // Actual implementation would handle exporting data to CSV or PDF
  }

  return (
    <div className="container py-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Track your sign language detection performance and usage statistics"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-gradient-to-r from-indigo-100 to-purple-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
                Performance
              </TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
                Usage
              </TabsTrigger>
          </TabsList>

            <div className="flex gap-3 w-full sm:w-auto">
        <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px] border-indigo-200 focus:ring-indigo-500">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
              
              <Button 
                variant="outline" 
                className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
      </div>

          <TabsContent value="overview" className="mt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-4 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
                    <p className="text-sm text-indigo-600 font-medium">Total Detections</p>
                    <h5 className="text-2xl font-bold mt-1 text-indigo-900">1,248</h5>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12.5% from last {timeRange}</span>
              </p>
            </div>
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg text-indigo-600 shadow-sm">
              <HandMetal className="h-6 w-6" />
            </div>
          </div>
        </Card>

              <Card className="p-4 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
                    <p className="text-sm text-indigo-600 font-medium">Accuracy Rate</p>
                    <h5 className="text-2xl font-bold mt-1 text-indigo-900">92.7%</h5>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+2.3% from last {timeRange}</span>
              </p>
            </div>
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg text-indigo-600 shadow-sm">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

              <Card className="p-4 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
                    <p className="text-sm text-indigo-600 font-medium">Average Response Time</p>
                    <h5 className="text-2xl font-bold mt-1 text-indigo-900">42ms</h5>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+15% from last {timeRange}</span>
              </p>
            </div>
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg text-indigo-600 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </Card>

              <Card className="p-4 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
                    <p className="text-sm text-indigo-600 font-medium">Active Users</p>
                    <h5 className="text-2xl font-bold mt-1 text-indigo-900">328</h5>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+8.2% from last {timeRange}</span>
              </p>
            </div>
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg text-indigo-600 shadow-sm">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
              <Card className="lg:col-span-4 overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-lg font-medium text-indigo-900">Detection Accuracy Over Time</CardTitle>
            </div>
            <Select defaultValue="accuracy">
                      <SelectTrigger className="w-[120px] h-8 border-indigo-200 focus:ring-indigo-500">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accuracy">Accuracy</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
                  <CardDescription className="pt-2 text-indigo-600">
                    Tracking your detection accuracy and confidence scores
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
            <Chart>
              <ChartContainer>
                      <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="accuracy" 
                            stroke="#6366f1" 
                            strokeWidth={2} 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="confidence" 
                            stroke="#8b5cf6" 
                            strokeWidth={2} 
                          />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
                </CardContent>
        </Card>

              <Card className="lg:col-span-3 overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg font-medium text-indigo-900">Most Common Gestures</CardTitle>
          </div>
                  <CardDescription className="pt-2 text-indigo-600">
                    Distribution of detected sign language gestures
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
            <Chart>
              <ChartContainer>
                      <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
                </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg font-medium text-indigo-900">Monthly Usage</CardTitle>
          </div>
                  <CardDescription className="pt-2 text-indigo-600">
                    Monthly usage trends for the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
            <Chart>
              <ChartContainer>
                      <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
                </CardContent>
        </Card>

              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg font-medium text-indigo-900">User Activity</CardTitle>
          </div>
                  <CardDescription className="pt-2 text-indigo-600">
                    User engagement and session data
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
            <Chart>
              <ChartContainer>
                      <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={areaChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorSessions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="mt-0">
            <Card className="border-purple-200 shadow-md mb-6">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-indigo-900">Performance Metrics</CardTitle>
                <CardDescription className="text-indigo-600">Detailed performance data for your sign language detection</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 mb-2">Detection Speed</Badge>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 border-4 border-indigo-100">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-900">42ms</div>
                          <div className="text-xs text-indigo-600">Average</div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-indigo-900">38ms</div>
                          <div className="text-xs text-indigo-600">Fastest</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-indigo-900">65ms</div>
                          <div className="text-xs text-indigo-600">Slowest</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 mb-2">Accuracy</Badge>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 border-4 border-indigo-100">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-900">92.7%</div>
                          <div className="text-xs text-indigo-600">Average</div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-indigo-700">Alphabet Signs</span>
                          <span className="text-sm font-medium text-indigo-900">96.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-indigo-700">Common Phrases</span>
                          <span className="text-sm font-medium text-indigo-900">91.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-indigo-700">Complex Sentences</span>
                          <span className="text-sm font-medium text-indigo-900">85.3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 mb-2">Confidence</Badge>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 border-4 border-indigo-100">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-900">88.3%</div>
                          <div className="text-xs text-indigo-600">Average</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-indigo-600">Low</span>
                            <span className="text-indigo-600">Medium</span>
                            <span className="text-indigo-600">High</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '88.3%' }}></div>
                          </div>
                          <div className="text-xs text-indigo-600 mt-1 text-right">
                            88.3% confidence across all detections
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Usage by Time of Day</CardTitle>
                  <CardDescription className="text-indigo-600">When users are most active with the application</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] flex items-end justify-between">
                    {[
                      { time: "12am", value: 15 },
                      { time: "3am", value: 5 },
                      { time: "6am", value: 20 },
                      { time: "9am", value: 45 },
                      { time: "12pm", value: 75 },
                      { time: "3pm", value: 90 },
                      { time: "6pm", value: 85 },
                      { time: "9pm", value: 50 }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="h-[200px] flex flex-col items-center justify-end mb-2">
                          <div 
                            className="w-8 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm" 
                            style={{ height: `${(item.value / 100) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium text-indigo-700">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Top Device Types</CardTitle>
                  <CardDescription className="text-indigo-600">Most common devices used for sign language detection</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-indigo-700">Desktop</span>
                        <span className="text-sm font-medium text-indigo-900">45%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-indigo-700">Mobile</span>
                        <span className="text-sm font-medium text-indigo-900">35%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-indigo-700">Tablet</span>
                        <span className="text-sm font-medium text-indigo-900">15%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-indigo-700">Other</span>
                        <span className="text-sm font-medium text-indigo-900">5%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-indigo-900 mb-4">Browser Distribution</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                        <div className="flex justify-between w-full">
                          <span className="text-xs text-indigo-700">Chrome</span>
                          <span className="text-xs font-medium text-indigo-900">65%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                        <div className="flex justify-between w-full">
                          <span className="text-xs text-indigo-700">Firefox</span>
                          <span className="text-xs font-medium text-indigo-900">15%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-300 rounded-sm"></div>
                        <div className="flex justify-between w-full">
                          <span className="text-xs text-indigo-700">Safari</span>
                          <span className="text-xs font-medium text-indigo-900">12%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-300 rounded-sm"></div>
                        <div className="flex justify-between w-full">
                          <span className="text-xs text-indigo-700">Edge</span>
                          <span className="text-xs font-medium text-indigo-900">8%</span>
                        </div>
                      </div>
                    </div>
          </div>
                </CardContent>
        </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          {label && <p className="font-medium">{label}</p>}
          {payload.map((item: any, index: number) => (
            <ChartTooltipItem key={index} color={item.color} name={item.name} value={item.value} />
          ))}
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }

  return null
}
