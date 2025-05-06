"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { Calendar, Download, Edit, Play, Search, Share2, Trash2, Video } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Sample recordings data with real images
  const recordingsData = [
    {
      id: 1,
      title: "Morning Practice Session",
      date: "2023-06-05",
      time: "09:15 AM",
      duration: "12:45",
      size: "45.2 MB",
      category: "Practice",
      thumbnail:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "ASL Conversation with John",
      date: "2023-06-04",
      time: "02:30 PM",
      duration: "24:18",
      size: "87.6 MB",
      category: "Conversation",
      thumbnail:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Learning New Medical Terms",
      date: "2023-06-03",
      time: "11:45 AM",
      duration: "18:22",
      size: "62.3 MB",
      category: "Learning",
      thumbnail:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Practice for Presentation",
      date: "2023-06-02",
      time: "04:20 PM",
      duration: "32:10",
      size: "108.5 MB",
      category: "Practice",
      thumbnail:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Family Signs Practice",
      date: "2023-06-01",
      time: "10:05 AM",
      duration: "15:40",
      size: "52.8 MB",
      category: "Family",
      thumbnail:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]

  // Filter data based on search query, selected date, and active tab
  const filteredData = recordingsData.filter((recording) => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = !selectedDate || recording.date === selectedDate.toISOString().split("T")[0]
    const matchesCategory = activeTab === "all" || recording.category.toLowerCase() === activeTab.toLowerCase()

    return matchesSearch && matchesDate && matchesCategory
  })

  // Sort data based on selected sort option
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "longest":
        return parseInt(b.duration.split(":")[0]) * 60 + parseInt(b.duration.split(":")[1]) - 
               (parseInt(a.duration.split(":")[0]) * 60 + parseInt(a.duration.split(":")[1]))
      case "shortest":
        return parseInt(a.duration.split(":")[0]) * 60 + parseInt(a.duration.split(":")[1]) - 
               (parseInt(b.duration.split(":")[0]) * 60 + parseInt(b.duration.split(":")[1]))
      case "largest":
        return parseFloat(b.size.split(" ")[0]) - parseFloat(a.size.split(" ")[0])
      case "smallest":
        return parseFloat(a.size.split(" ")[0]) - parseFloat(b.size.split(" ")[0])
      default:
        return 0
    }
  })

  // Add handlers for button actions
  const handlePlayRecording = (recordingId: number) => {
    // In a real implementation, this would play the recording
    alert(`Playing recording ${recordingId}`)
  }
  
  const handleDownloadRecording = (recordingId: number) => {
    // In a real implementation, this would download the recording
    alert(`Downloading recording ${recordingId}`)
  }
  
  const handleShareRecording = (recordingId: number) => {
    // In a real implementation, this would open a share dialog
    alert(`Sharing recording ${recordingId}`)
  }
  
  const handleEditRecording = (recordingId: number) => {
    // In a real implementation, this would open the recording editor
    alert(`Editing recording ${recordingId}`)
  }
  
  const handleDeleteRecording = (recordingId: number) => {
    if (confirm(`Are you sure you want to delete this recording?`)) {
      // In a real implementation, this would delete the recording
      alert(`Recording ${recordingId} deleted`)
    }
  }

  return (
    <div className="container py-6">
      <PageHeader
        title="Recordings"
        description="View and manage your sign language practice recordings"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4 bg-gradient-to-r from-indigo-100 to-purple-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              All
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Practice
            </TabsTrigger>
            <TabsTrigger value="conversation" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Conversation
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Learning
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] border-indigo-200 focus:ring-indigo-500">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="longest">Longest Duration</SelectItem>
            <SelectItem value="shortest">Shortest Duration</SelectItem>
            <SelectItem value="largest">Largest Size</SelectItem>
            <SelectItem value="smallest">Smallest Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4 flex-1 mb-6 border-purple-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-4 w-4" />
              <Input
                placeholder="Search recordings..."
              className="pl-9 border-indigo-200 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                    <Calendar className="h-4 w-4" />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Filter by Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
              {selectedDate && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedDate(undefined)}
                className="hover:bg-indigo-50 hover:text-indigo-700"
              >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.length > 0 ? (
          sortedData.map((recording) => (
            <Card key={recording.id} className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <img
                      src={recording.thumbnail || "/placeholder.svg"}
                      alt={recording.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 to-purple-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white rounded-full p-3 shadow-md">
                        <Play className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <Badge className="absolute bottom-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 border-none">
                      {recording.duration}
                    </Badge>
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                      {recording.category}
                    </Badge>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-indigo-900">{recording.title}</DialogTitle>
                    <DialogDescription className="text-indigo-600">
                      Recorded on {recording.date} at {recording.time}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="aspect-video bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md overflow-hidden relative">
                    <img
                      src={recording.thumbnail || "/placeholder.svg"}
                      alt={recording.title}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={() => handlePlayRecording(recording.id)}
                    >
                      <div className="bg-white/80 rounded-full p-3 shadow-md hover:bg-white transition-colors">
                        <Play className="h-8 w-8 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="text-sm text-indigo-600">
                      <div>Duration: {recording.duration}</div>
                      <div>Size: {recording.size}</div>
                      <div>Category: {recording.category}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        onClick={() => handleDownloadRecording(recording.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        onClick={() => handleShareRecording(recording.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="p-4">
                <h3 className="font-medium truncate text-indigo-900">{recording.title}</h3>
                <div className="flex justify-between text-sm text-indigo-600 mt-1">
                  <span>{recording.date}</span>
                  <span>{recording.time}</span>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-indigo-600">{recording.size}</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => handleEditRecording(recording.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => handleDownloadRecording(recording.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleDeleteRecording(recording.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-indigo-900 mb-2">No recordings found</h3>
            <p className="text-indigo-600 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for, or create a new recording.
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Video className="h-4 w-4 mr-2" />
              Create New Recording
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
