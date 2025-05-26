"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  BarChart2,
  Download,
  FileText,
  Filter,
  HandMetal,
  LineChart,
  PieChart,
  Search,
  Settings,
  Share2,
  Users,
  Plus,
} from "lucide-react"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function ResearchAnalytics() {
  const [activeTab, setActiveTab] = useState("usage")
  const [timeRange, setTimeRange] = useState("week")
  const [isLoading, setIsLoading] = useState(false)

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

  // Sample research data
  const researchData = [
    {
      id: 1,
      title: "Sign Language Recognition Accuracy Study",
      author: "Dr. Sarah Johnson",
      date: "2023-05-15",
      category: "Recognition",
      abstract:
        "This study examines the accuracy of machine learning models in recognizing sign language gestures across different demographic groups.",
    },
    {
      id: 2,
      title: "Comparative Analysis of Sign Language Translation Methods",
      author: "Prof. Michael Chen",
      date: "2023-06-22",
      category: "Translation",
      abstract:
        "A comparative study of different approaches to translating between spoken language and sign language, with a focus on neural network-based methods.",
    },
    {
      id: 3,
      title: "User Experience in Sign Language Learning Applications",
      author: "Dr. Alex Rivera",
      date: "2023-07-10",
      category: "Education",
      abstract:
        "This research investigates the user experience factors that contribute to effective sign language learning in digital applications.",
    },
  ]

  // Sample usage data
  const usageData = [
    {
      id: 1,
      feature: "Sign Language Translation",
      usageCount: 1248,
      growthRate: 12.5,
      activeUsers: 328,
    },
    {
      id: 2,
      feature: "Sign Language Recognition",
      usageCount: 876,
      growthRate: 8.3,
      activeUsers: 245,
    },
    {
      id: 3,
      feature: "Educational Courses",
      usageCount: 542,
      growthRate: 15.7,
      activeUsers: 189,
    },
    {
      id: 4,
      feature: "Practice Exercises",
      usageCount: 423,
      growthRate: 9.2,
      activeUsers: 156,
    },
  ]

  // Handle loading state
  const handleAction = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const COLORS = ["#1e40af", "#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"]

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

  return (
    <div className="space-y-8">
      <Tabs defaultValue="usage" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="usage">
            <BarChart2 className="h-4 w-4 mr-2" />
            Usage Analytics
          </TabsTrigger>
          <TabsTrigger value="research">
            <FileText className="h-4 w-4 mr-2" />
            Research
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export & Reports
          </TabsTrigger>
        </TabsList>

        {/* Usage Analytics Tab */}
        <TabsContent value="usage" className="space-y-6 pt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Usage Analytics Dashboard
            </h3>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {usageData.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{item.feature}</p>
                    <h5 className="text-2xl font-bold mt-1">{item.usageCount.toLocaleString()}</h5>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 15L12 8L19 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        +{item.growthRate}% from last {timeRange}
                      </span>
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-lg text-primary">
                    <HandMetal className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
            <Card className="lg:col-span-4 overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Detection Accuracy Over Time</h3>
                </div>
                <Select defaultValue="accuracy">
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 h-80">
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#1e40af"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="confidence" stroke="#1e3a8a" strokeWidth={2} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              </div>
            </Card>

            <Card className="lg:col-span-3 overflow-hidden">
              <div className="p-4 border-b flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Most Common Gestures</h3>
              </div>
              <div className="p-4 h-80">
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
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
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="p-4 border-b flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Monthly Usage</h3>
              </div>
              <div className="p-4 h-80">
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="p-4 border-b flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">User Activity</h3>
              </div>
              <div className="p-4 h-80">
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stackId="1"
                          stroke="#1e40af"
                          fill="#1e40af"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="sessions"
                          stackId="1"
                          stroke="#1e3a8a"
                          fill="#1e3a8a"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Analytics Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-collection" className="cursor-pointer">
                    Enable Data Collection
                  </Label>
                  <Switch id="data-collection" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="usage-tracking" className="cursor-pointer">
                    Track Feature Usage
                  </Label>
                  <Switch id="usage-tracking" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="performance-metrics" className="cursor-pointer">
                    Collect Performance Metrics
                  </Label>
                  <Switch id="performance-metrics" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="user-demographics" className="cursor-pointer">
                    User Demographics
                  </Label>
                  <Switch id="user-demographics" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select defaultValue="365">
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-format">Default Export Format</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger id="export-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-frequency">Automated Report Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="report-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleAction}>Save Settings</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6 pt-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Research Publications
              </h3>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search research..." className="pl-9 w-[200px]" />
                </div>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {researchData.map((research) => (
                <Dialog key={research.id}>
                  <DialogTrigger asChild>
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{research.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {research.author} • {new Date(research.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{research.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">{research.abstract}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{research.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {research.author} • {new Date(research.date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">{research.category}</Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Abstract</h4>
                        <p className="text-sm text-gray-600">{research.abstract}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Key Findings</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                          <li>Finding 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                          <li>Finding 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                          <li>Finding 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Methodology</h4>
                        <p className="text-sm text-gray-600">
                          The research employed a mixed-methods approach, combining quantitative analysis of sign
                          language recognition accuracy with qualitative interviews of users.
                        </p>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button>
                          <FileText className="h-4 w-4 mr-2" />
                          Read Full Paper
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Submit Research
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="research-title">Research Title</Label>
                <Input id="research-title" placeholder="Enter research title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="research-authors">Authors</Label>
                <Input id="research-authors" placeholder="Enter author names (separated by commas)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="research-category">Research Category</Label>
                <Select defaultValue="recognition">
                  <SelectTrigger id="research-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recognition">Sign Language Recognition</SelectItem>
                    <SelectItem value="translation">Sign Language Translation</SelectItem>
                    <SelectItem value="education">Sign Language Education</SelectItem>
                    <SelectItem value="linguistics">Sign Language Linguistics</SelectItem>
                    <SelectItem value="accessibility">Accessibility</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="research-abstract">Abstract</Label>
                <Textarea id="research-abstract" placeholder="Enter research abstract" className="min-h-[150px]" />
              </div>

              <div className="space-y-2">
                <Label>Upload Research Paper (PDF)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop your PDF file here</p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAction} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Research"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Export & Reports Tab */}
        <TabsContent value="export" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-primary" />
              Export Data
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Type</Label>
                    <Select defaultValue="usage">
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usage">Usage Statistics</SelectItem>
                        <SelectItem value="performance">Performance Metrics</SelectItem>
                        <SelectItem value="recognition">Recognition Data</SelectItem>
                        <SelectItem value="translation">Translation Data</SelectItem>
                        <SelectItem value="user">User Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" placeholder="Start date" />
                      <Input type="date" placeholder="End date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Fields</Label>
                    <div className="space-y-2 p-3 border rounded-lg max-h-[200px] overflow-y-auto">
                      <div className="flex items-center space-x-2">
                        <Switch id="field-timestamp" defaultChecked />
                        <Label htmlFor="field-timestamp">Timestamp</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-user-id" defaultChecked />
                        <Label htmlFor="field-user-id">User ID</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-feature" defaultChecked />
                        <Label htmlFor="field-feature">Feature</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-action" defaultChecked />
                        <Label htmlFor="field-action">Action</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-duration" defaultChecked />
                        <Label htmlFor="field-duration">Duration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-accuracy" defaultChecked />
                        <Label htmlFor="field-accuracy">Accuracy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-device" />
                        <Label htmlFor="field-device">Device Info</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-location" />
                        <Label htmlFor="field-location">Location</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="anonymize-data" className="cursor-pointer">
                        Anonymize Data
                      </Label>
                      <Switch id="anonymize-data" defaultChecked />
                    </div>
                    <p className="text-xs text-gray-500">
                      Remove personally identifiable information from the exported data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Options
                </Button>
                <Button onClick={handleAction} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Scheduled Reports
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Weekly Usage Report</h4>
                    <p className="text-sm text-gray-500">Sent every Monday at 9:00 AM</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Recipients:</span>
                      <div>team@example.com</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Format:</span>
                      <div>PDF</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Sent:</span>
                      <div>May 15, 2023</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Disable
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Monthly Performance Report</h4>
                    <p className="text-sm text-gray-500">Sent on the 1st of each month</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Recipients:</span>
                      <div>management@example.com</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Format:</span>
                      <div>Excel</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Sent:</span>
                      <div>May 1, 2023</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Disable
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Scheduled Report
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-primary" />
              Share Analytics
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Share With</Label>
                <Input placeholder="Enter email addresses (separated by commas)" />
              </div>

              <div className="space-y-2">
                <Label>Dashboard to Share</Label>
                <Select defaultValue="usage">
                  <SelectTrigger>
                    <SelectValue placeholder="Select dashboard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usage">Usage Analytics</SelectItem>
                    <SelectItem value="performance">Performance Metrics</SelectItem>
                    <SelectItem value="user">User Demographics</SelectItem>
                    <SelectItem value="custom">Custom Dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select defaultValue="view">
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="comment">Can Comment</SelectItem>
                    <SelectItem value="edit">Can Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Message (Optional)</Label>
                <Textarea placeholder="Add a message to recipients..." />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAction} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Analytics
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
