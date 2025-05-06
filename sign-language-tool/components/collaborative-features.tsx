"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Check,
  Clock,
  Edit,
  FileText,
  HandMetal,
  MessageSquare,
  Plus,
  Share2,
  User,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function CollaborativeFeatures() {
  const [activeTab, setActiveTab] = useState("team")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      comment: "The sign for 'thank you' looks great! The hand movement is very clear.",
      time: "2 hours ago",
      replies: [],
    },
    {
      id: 2,
      user: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      comment: "I think we should adjust the speed of the 'hello' sign. It's a bit too fast for beginners.",
      time: "Yesterday",
      replies: [
        {
          id: 21,
          user: "Alex Rivera",
          avatar:
            "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          comment: "I agree. Maybe we can add a speed control option?",
          time: "Yesterday",
        },
      ],
    },
  ])
  const [newComment, setNewComment] = useState("")

  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Sign Language Expert",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      status: "online",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Developer",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      status: "offline",
    },
    {
      id: 3,
      name: "Alex Rivera",
      role: "UI/UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      status: "online",
    },
    {
      id: 4,
      name: "Jamie Taylor",
      role: "Project Manager",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      status: "busy",
    },
  ]

  // Sample projects data
  const projects = [
    {
      id: 1,
      name: "ASL Training Module",
      description: "Development of American Sign Language training materials",
      members: 4,
      progress: 75,
      dueDate: "2023-12-15",
    },
    {
      id: 2,
      name: "Medical Signs Dictionary",
      description: "Specialized dictionary for medical terminology in sign language",
      members: 3,
      progress: 40,
      dueDate: "2024-01-30",
    },
    {
      id: 3,
      name: "Educational Video Series",
      description: "Creating educational videos for sign language learners",
      members: 5,
      progress: 20,
      dueDate: "2024-02-28",
    },
  ]

  // Handle form submissions
  const handleAction = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  // Handle adding a new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newCommentObj = {
      id: comments.length + 1,
      user: "You",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      comment: newComment,
      time: "Just now",
      replies: [],
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  return (
    <div className="space-y-8">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium">Success!</h4>
            <p className="text-sm">Your action has been completed successfully.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="team" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FileText className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
        </TabsList>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6 pt-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Team Members
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>Invite a new member to collaborate on sign language projects.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input placeholder="colleague@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select defaultValue="member">
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="expert">Sign Language Expert</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="member">Team Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Access Level</Label>
                      <Select defaultValue="edit">
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="comment">Can Comment</SelectItem>
                          <SelectItem value="edit">Can Edit</SelectItem>
                          <SelectItem value="admin">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="send-welcome" defaultChecked />
                        <Label htmlFor="send-welcome">Send welcome email</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button onClick={handleAction}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Sending Invite...
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 mr-2" />
                            Send Invitation
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "busy"
                              ? "bg-amber-500"
                              : "bg-gray-300"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Team Member</DialogTitle>
                          <DialogDescription>Update information for {member.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input defaultValue={member.name} />
                          </div>

                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input defaultValue={member.role} />
                          </div>

                          <div className="space-y-2">
                            <Label>Access Level</Label>
                            <Select defaultValue="edit">
                              <SelectTrigger>
                                <SelectValue placeholder="Select access level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="view">View Only</SelectItem>
                                <SelectItem value="comment">Can Comment</SelectItem>
                                <SelectItem value="edit">Can Edit</SelectItem>
                                <SelectItem value="admin">Full Access</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {}}>
                              Cancel
                            </Button>
                            <Button onClick={handleAction}>Save Changes</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <HandMetal className="h-5 w-5 mr-2 text-primary" />
              Team Permissions
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Content Access</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-dictionary" className="cursor-pointer">
                        View Sign Dictionary
                      </Label>
                      <Switch id="view-dictionary" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-dictionary" className="cursor-pointer">
                        Edit Sign Dictionary
                      </Label>
                      <Switch id="edit-dictionary" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-translations" className="cursor-pointer">
                        View Translations
                      </Label>
                      <Switch id="view-translations" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="create-translations" className="cursor-pointer">
                        Create Translations
                      </Label>
                      <Switch id="create-translations" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Administrative Access</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="manage-team" className="cursor-pointer">
                        Manage Team Members
                      </Label>
                      <Switch id="manage-team" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-analytics" className="cursor-pointer">
                        View Analytics
                      </Label>
                      <Switch id="view-analytics" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="export-data" className="cursor-pointer">
                        Export Data
                      </Label>
                      <Switch id="export-data" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-settings" className="cursor-pointer">
                        Modify System Settings
                      </Label>
                      <Switch id="system-settings" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAction} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    "Save Permissions"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6 pt-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Sign Language Projects
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>Set up a new sign language project for your team.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input placeholder="Enter project name" />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Describe the project..." />
                    </div>

                    <div className="space-y-2">
                      <Label>Project Type</Label>
                      <Select defaultValue="translation">
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="translation">Translation Project</SelectItem>
                          <SelectItem value="dictionary">Dictionary Development</SelectItem>
                          <SelectItem value="education">Educational Content</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" />
                    </div>

                    <div className="space-y-2">
                      <Label>Team Members</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team members" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-gray-500 mt-1">
                        You can add more members after creating the project.
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button onClick={handleAction}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Creating...
                          </>
                        ) : (
                          "Create Project"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between mb-4">
                      <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{project.members} team members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button size="sm">View Project</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </h3>

            <div className="space-y-4">
              <div className="relative pl-6 pb-4 border-l border-gray-200">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h4 className="font-medium">Project Updated: ASL Training Module</h4>
                    <p className="text-sm text-gray-500">Sarah Johnson added new content to the module</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">2 hours ago</div>
                </div>
              </div>

              <div className="relative pl-6 pb-4 border-l border-gray-200">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h4 className="font-medium">New Team Member</h4>
                    <p className="text-sm text-gray-500">Alex Rivera joined the team</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">Yesterday</div>
                </div>
              </div>

              <div className="relative pl-6 pb-4 border-l border-gray-200">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h4 className="font-medium">Project Created: Medical Signs Dictionary</h4>
                    <p className="text-sm text-gray-500">Jamie Taylor created a new project</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">3 days ago</div>
                </div>
              </div>

              <div className="relative pl-6 border-l border-gray-200">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h4 className="font-medium">Translation Completed</h4>
                    <p className="text-sm text-gray-500">
                      Michael Chen completed the translation of educational materials
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">5 days ago</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Discussion
            </h3>

            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                    alt="Your avatar"
                  />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.avatar} alt={comment.user} />
                      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{comment.user}</h4>
                        <span className="text-sm text-gray-500">{comment.time}</span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.comment}</p>
                      <div className="mt-2 flex gap-4">
                        <button className="text-sm text-gray-500 hover:text-primary">Reply</button>
                        <button className="text-sm text-gray-500 hover:text-primary">Like</button>
                      </div>
                    </div>
                  </div>

                  {comment.replies.length > 0 && (
                    <div className="ml-14 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.avatar} alt={reply.user} />
                            <AvatarFallback>{reply.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{reply.user}</h4>
                              <span className="text-sm text-gray-500">{reply.time}</span>
                            </div>
                            <p className="mt-1 text-gray-700">{reply.comment}</p>
                            <div className="mt-2 flex gap-4">
                              <button className="text-sm text-gray-500 hover:text-primary">Like</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Documentation
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Sign Language Translation Guide</h4>
                  </div>
                  <Badge>Updated</Badge>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive guide for translating between spoken language and sign language.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>Sarah Johnson</span>
                      <span>•</span>
                      <span>Last updated 2 days ago</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Project Requirements Specification</h4>
                  </div>
                  <Badge variant="outline">Draft</Badge>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Technical requirements and specifications for the sign language translation system.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>Michael Chen</span>
                      <span>•</span>
                      <span>Last updated 1 week ago</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Document
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
