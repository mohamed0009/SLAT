"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Book, 
  BookOpen, 
  ExternalLink, 
  File, 
  GraduationCap, 
  HelpCircle, 
  Info, 
  Mail, 
  MessageSquare, 
  Phone, 
  Search, 
  VideoIcon, 
  Youtube 
} from "lucide-react"
import { toast } from "sonner"

// Sample FAQ data
const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <GraduationCap className="h-5 w-5" />,
    questions: [
      {
        id: "account",
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Follow the on-screen instructions to complete your registration. You'll need to provide a valid email address and create a password."
      },
      {
        id: "login",
        question: "I forgot my password, how do I reset it?",
        answer: "If you've forgotten your password, click on the 'Login' button, then select 'Forgot Password'. Enter your email address and follow the instructions sent to your email to reset your password."
      },
      {
        id: "courses",
        question: "How do I start my first course?",
        answer: "After logging in, navigate to the 'Learn' section from the main menu. Browse the available courses and click on one that interests you. Then click the 'Start Course' button to begin your learning journey."
      },
      {
        id: "progress",
        question: "How is my progress tracked?",
        answer: "Your progress is automatically tracked as you complete lessons and practice sessions. You can view your progress on your profile page and on the dashboard. We track completed lessons, practice time, accuracy, and more."
      }
    ]
  },
  {
    id: "learning",
    title: "Learning Features",
    icon: <Book className="h-5 w-5" />,
    questions: [
      {
        id: "dictionary",
        question: "How does the sign dictionary work?",
        answer: "The sign dictionary allows you to search for specific signs by name, category, or difficulty. Each entry includes a visual representation, description, and usage examples. You can also save favorites for quick access later."
      },
      {
        id: "video",
        question: "Can I practice with video recognition?",
        answer: "Yes! Our video recognition feature uses your camera to analyze your signing and provide real-time feedback. Go to the 'Practice' section and select 'Video Recognition' to get started."
      },
      {
        id: "learning-path",
        question: "What is a learning path?",
        answer: "A learning path is a structured sequence of courses designed to take you from beginner to proficient in a specific area of sign language. Learning paths help you progress in a logical order, building on previously learned skills."
      },
      {
        id: "achievements",
        question: "What are achievements and how do I earn them?",
        answer: "Achievements are badges you earn for reaching various milestones in your learning journey. You can earn them by completing courses, maintaining practice streaks, mastering signs, and more. View your achievements on your profile page."
      }
    ]
  },
  {
    id: "technical",
    title: "Technical Support",
    icon: <Info className="h-5 w-5" />,
    questions: [
      {
        id: "browser",
        question: "Which browsers are supported?",
        answer: "Our platform works best on recent versions of Chrome, Firefox, Safari, and Edge. For the best experience, especially with video features, we recommend using the latest version of Chrome or Firefox."
      },
      {
        id: "camera",
        question: "The video recognition feature isn't working. What should I do?",
        answer: "First, ensure you've granted camera permissions to the site. Check that no other applications are using your camera. Try refreshing the page or using a different browser. If problems persist, contact our support team."
      },
      {
        id: "offline",
        question: "Can I use the app offline?",
        answer: "Currently, most features require an internet connection. However, you can download some lesson materials for offline study in the 'Learn' section by clicking the download icon next to each lesson."
      },
      {
        id: "mobile",
        question: "Is there a mobile app available?",
        answer: "Yes, we have mobile apps available for both iOS and Android. Search for 'Sign Language Analysis Tool' in your device's app store to download and install it."
      }
    ]
  }
];

// Sample resources data
const resourceCategories = [
  {
    id: "documentation",
    title: "Documentation",
    icon: <File className="h-5 w-5" />,
    resources: [
      {
        id: 1,
        title: "User Guide",
        description: "Complete guide to using all features of the platform",
        link: "/docs/user-guide.pdf",
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Video Recognition Setup",
        description: "Step-by-step instructions for configuring your camera",
        link: "/docs/video-setup.pdf",
        icon: <VideoIcon className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Lesson Structure Guide",
        description: "Understanding how our lessons are organized",
        link: "/docs/lesson-structure.pdf",
        icon: <GraduationCap className="h-5 w-5" />
      }
    ]
  },
  {
    id: "tutorials",
    title: "Video Tutorials",
    icon: <Youtube className="h-5 w-5" />,
    resources: [
      {
        id: 1,
        title: "Getting Started Tutorial",
        description: "A walkthrough of the platform for new users",
        link: "https://www.youtube.com/watch?v=example1",
        icon: <Youtube className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Practice Mode Tutorial",
        description: "How to use the practice mode effectively",
        link: "https://www.youtube.com/watch?v=example2",
        icon: <Youtube className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Progress Tracking Tutorial",
        description: "Understanding your learning metrics",
        link: "https://www.youtube.com/watch?v=example3",
        icon: <Youtube className="h-5 w-5" />
      }
    ]
  },
  {
    id: "community",
    title: "Community Resources",
    icon: <MessageSquare className="h-5 w-5" />,
    resources: [
      {
        id: 1,
        title: "Learning Forums",
        description: "Connect with other learners and instructors",
        link: "https://community.example.com/forums",
        icon: <MessageSquare className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Sign Language Blog",
        description: "Weekly articles about sign language and deaf culture",
        link: "https://blog.example.com",
        icon: <BookOpen className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Practice Groups",
        description: "Find practice partners and groups in your area",
        link: "https://community.example.com/groups",
        icon: <Users className="h-5 w-5" />
      }
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("faq")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  
  // Filter FAQs based on search query
  const filteredFAQs = searchQuery ? 
    faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.questions.length > 0) : 
    faqCategories;
    
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Your message has been sent! We'll get back to you shortly.")
    setContactName("")
    setContactEmail("")
    setContactSubject("")
    setContactMessage("")
  }
  
  return (
    <div className="container py-6">
      <PageHeader 
        title="Help & Support" 
        description="Find answers to your questions and get assistance"
      />
      
      {/* Search box */}
      <Card className="mb-6 border-purple-200 shadow-md">
        <CardContent className="pt-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
            <Input
              placeholder="Search for help topics..."
              className="pl-10 border-indigo-200 focus-visible:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-indigo-100 to-purple-100">
          <TabsTrigger value="faq" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Mail className="h-4 w-4 mr-2" />
            Contact Us
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-6">
          {searchQuery && filteredFAQs.length === 0 ? (
            <Card className="text-center py-8 border-purple-200 shadow-md">
              <CardContent>
                <div className="flex flex-col items-center">
                  <HelpCircle className="h-12 w-12 text-indigo-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-indigo-900">No Results Found</h3>
                  <p className="text-indigo-600 max-w-md mx-auto mb-4">
                    We couldn't find any FAQ matching "{searchQuery}". Try different keywords or contact us directly.
                  </p>
                  <Button variant="outline" className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => setActiveTab("contact")}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFAQs.map((category) => (
                <Card key={category.id} className="border-purple-200 shadow-md overflow-hidden">
                  <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <CardTitle className="flex items-center text-lg text-indigo-900">
                      <span className="text-indigo-600">{category.icon}</span>
                      <span className="ml-2">{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border-indigo-200">
                          <AccordionTrigger className="text-left text-indigo-800 hover:text-indigo-600">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-indigo-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <div className="space-y-6">
            {resourceCategories.map((category) => (
              <Card key={category.id} className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center text-lg text-indigo-900">
                    <span className="text-indigo-600">{category.icon}</span>
                    <span className="ml-2">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.resources.map((resource) => (
                      <Card key={resource.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-indigo-200">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-full">
                            <span className="text-indigo-600">{resource.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium mb-1 text-indigo-800">{resource.title}</h3>
                            <p className="text-sm text-indigo-600 mb-2 line-clamp-2">{resource.description}</p>
                            <a 
                              href={resource.link} 
                              className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>View Resource</span>
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Contact Information</CardTitle>
                  <CardDescription className="text-indigo-600">Get in touch with our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-indigo-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1 text-indigo-800">Email Support</h3>
                      <p className="text-sm text-indigo-600 mb-1">For general inquiries:</p>
                      <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-800">
                        support@example.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-indigo-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1 text-indigo-800">Phone Support</h3>
                      <p className="text-sm text-indigo-600 mb-1">Available Monday-Friday, 9AM-5PM EST:</p>
                      <a href="tel:+18001234567" className="text-purple-600 hover:text-purple-800">
                        +1 (800) 123-4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1 text-indigo-800">Live Chat</h3>
                      <p className="text-sm text-indigo-600 mb-1">Chat with our support team:</p>
                      <Button variant="outline" size="sm" className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => toast.info("Live chat would open here")}>
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900">Send Us a Message</CardTitle>
                  <CardDescription className="text-indigo-600">Fill out the form below and we'll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-indigo-800">Your Name</Label>
                        <Input 
                          id="name" 
                          value={contactName} 
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="John Doe"
                          className="border-indigo-200 focus-visible:ring-indigo-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-indigo-800">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={contactEmail} 
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="border-indigo-200 focus-visible:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-indigo-800">Subject</Label>
                      <Input 
                        id="subject" 
                        value={contactSubject} 
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="How can we help you?"
                        className="border-indigo-200 focus-visible:ring-indigo-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-indigo-800">Message</Label>
                      <textarea 
                        id="message" 
                        className="w-full min-h-[150px] p-3 border border-indigo-200 rounded-md focus-visible:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        value={contactMessage} 
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Please describe your issue or question in detail..."
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
} 