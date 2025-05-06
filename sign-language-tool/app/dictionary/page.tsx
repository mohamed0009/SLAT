"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Book, Bookmark, BookmarkPlus, Filter, HandMetal, Search, BookOpen, GraduationCap } from "lucide-react"
import { Avatar } from "@/components/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

// Sample sign data
const signLanguageSigns = [
    {
      id: 1,
    name: "Hello",
    imageUrl: "/images/signs/hello.gif",
    videoUrl: "/videos/signs/hello.mp4",
    description: "Wave your hand with palm facing outward.",
      category: "Greetings",
      difficulty: "Easy",
    variants: ["Hi", "Greeting"],
    isFavorite: false,
    },
    {
      id: 2,
    name: "Thank You",
    imageUrl: "/images/signs/thankyou.gif",
    videoUrl: "/videos/signs/thankyou.mp4",
    description: "Touch your chin or lips with the fingertips of one flat hand, then move the hand forward.",
    category: "Expressions",
      difficulty: "Easy",
    variants: ["Thanks", "Gratitude"],
    isFavorite: false,
    },
    {
      id: 3,
    name: "Please",
    imageUrl: "/images/signs/please.gif",
    videoUrl: "/videos/signs/please.mp4",
    description: "Rub your hand in a circular motion on your chest.",
    category: "Expressions",
      difficulty: "Easy",
    variants: ["Request"],
    isFavorite: false,
    },
    {
      id: 4,
    name: "Yes",
    imageUrl: "/images/signs/yes.gif",
    videoUrl: "/videos/signs/yes.mp4",
    description: "Make a fist and nod it up and down, like nodding your head.",
    category: "Responses",
      difficulty: "Easy",
    variants: ["Affirmative", "Agree"],
    isFavorite: false,
    },
    {
      id: 5,
    name: "No",
    imageUrl: "/images/signs/no.gif",
    videoUrl: "/videos/signs/no.mp4",
    description: "Take your index and middle finger together and tap them with your thumb.",
    category: "Responses",
      difficulty: "Easy",
    variants: ["Negative", "Disagree"],
    isFavorite: false,
    },
    {
      id: 6,
    name: "Family",
    imageUrl: "/images/signs/family.gif",
    videoUrl: "/videos/signs/family.mp4",
    description: "Extend all fingers of both hands and draw them together in a circular motion.",
    category: "People",
    difficulty: "Medium",
    variants: ["Relatives"],
    isFavorite: false,
    },
    {
      id: 7,
    name: "Friend",
    imageUrl: "/images/signs/friend.gif",
    videoUrl: "/videos/signs/friend.mp4",
    description: "Hook your index fingers together and twist them, as if they're inseparable.",
    category: "People",
    difficulty: "Easy",
    variants: ["Buddy", "Pal"],
    isFavorite: false,
    },
    {
      id: 8,
    name: "Work",
    imageUrl: "/images/signs/work.gif",
    videoUrl: "/videos/signs/work.mp4",
    description: "Make fists with both hands and tap them on top of each other in an alternating motion.",
    category: "Actions",
      difficulty: "Medium",
    variants: ["Job", "Labor"],
    isFavorite: false,
    },
    {
      id: 9,
    name: "Love",
    imageUrl: "/images/signs/love.gif",
    videoUrl: "/videos/signs/love.mp4",
    description: "Cross your arms over your chest as if hugging yourself.",
    category: "Emotions",
    difficulty: "Easy",
    variants: ["Affection", "Care"],
    isFavorite: false,
    },
    {
      id: 10,
    name: "Help",
    imageUrl: "/images/signs/help.gif",
    videoUrl: "/videos/signs/help.mp4",
    description: "Place one hand palm up, and place the other hand on top, lifting it up.",
    category: "Actions",
    difficulty: "Easy",
    variants: ["Assist", "Aid"],
    isFavorite: true,
    },
    {
      id: 11,
    name: "Learn",
    imageUrl: "/images/signs/learn.gif",
    videoUrl: "/videos/signs/learn.mp4",
    description: "Place your hand at your forehead and move it outward while opening your fingers.",
    category: "Actions",
      difficulty: "Medium",
    variants: ["Study", "Understand"],
    isFavorite: false,
    },
    {
      id: 12,
    name: "Good",
    imageUrl: "/images/signs/good.gif",
    videoUrl: "/videos/signs/good.mp4",
    description: "Place your fingers on your chin or lips and move your hand outward.",
    category: "Descriptions",
    difficulty: "Easy",
    variants: ["Nice", "Fine"],
    isFavorite: true,
  },
]

// Categories derived from sign data
const categories = ["All", ...Array.from(new Set(signLanguageSigns.map((sign) => sign.category)))];
const difficulties = ["All", "Easy", "Medium", "Hard"];

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [signs, setSigns] = useState(signLanguageSigns)
  const [activeSign, setActiveSign] = useState<typeof signLanguageSigns[0] | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [mounted, setMounted] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    // In a real app, you would load favorites from local storage or backend
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, [])

  useEffect(() => {
    // Filter signs based on search query, category and difficulty
    let filtered = signLanguageSigns.filter((sign) => {
      const matchesSearch = 
        sign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        sign.variants.some(variant => variant.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || sign.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || sign.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    // Apply tab filtering
    if (activeTab === "favorites") {
      filtered = filtered.filter(sign => sign.isFavorite);
    }
    
    setSigns(filtered);
  }, [searchQuery, selectedCategory, selectedDifficulty, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      const newSearches = [searchQuery, ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newSearches));
    }
  };

  const toggleFavorite = (id: number) => {
    setSigns(
      signs.map((sign) => (sign.id === id ? { ...sign, isFavorite: !sign.isFavorite } : sign))
    )
    
    // Show toast notification
    const sign = signs.find(s => s.id === id);
    if (sign) {
      toast[sign.isFavorite ? "error" : "success"](
        sign.isFavorite ? `Removed "${sign.name}" from favorites` : `Added "${sign.name}" to favorites`
      );
    }
  }

  const viewSignDetails = (sign: typeof signLanguageSigns[0]) => {
    setActiveSign(sign)
    setShowDetailsDialog(true)
  }

  if (!mounted) return null;

  return (
    <div className="container py-6">
      <PageHeader
        title="Sign Language Dictionary"
        description="Browse, search and learn signs from our comprehensive dictionary"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-3 bg-gradient-to-r from-indigo-100 to-purple-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              All Signs
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Recently Viewed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs defaultValue={view} onValueChange={(v) => setView(v as "grid" | "list")} className="w-full md:w-auto">
          <TabsList className="w-full md:w-[140px] grid grid-cols-2 bg-gradient-to-r from-indigo-100 to-purple-100">
            <TabsTrigger value="grid" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="col-span-2 border-purple-200 shadow-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center text-lg text-indigo-900">
              <Search className="mr-2 h-5 w-5 text-indigo-600" />
              Search Signs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
              <Input
                  type="text"
                  placeholder="Search for signs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-indigo-200 focus-visible:ring-indigo-500"
              />
            </div>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                Search
              </Button>
            </form>

            {recentSearches.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-indigo-600 mb-1">Recent searches:</p>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-indigo-50 text-indigo-700 border-indigo-200"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          </Card>

        <Card className="border-purple-200 shadow-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center text-lg text-indigo-900">
              <Filter className="mr-2 h-5 w-5 text-indigo-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-indigo-700">Category:</p>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
              {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
              ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-indigo-700">Difficulty:</p>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          </Card>
        </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-indigo-900">Signs ({signs.length})</h2>
        </div>
        <Button 
          variant="outline" 
          className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory("All");
            setSelectedDifficulty("All");
          }}
        >
          Clear All Filters
        </Button>
              </div>

      {signs.length === 0 ? (
        <Card className="p-8 text-center border-purple-200 shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Book className="h-8 w-8 text-indigo-600" />
                            </div>
            <h3 className="text-xl font-semibold text-indigo-900">No signs found</h3>
            <p className="text-indigo-600">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
                setActiveTab("all");
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Reset All Filters
            </Button>
                            </div>
                          </Card>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {signs.map((sign) => (
            <Card key={sign.id} className="overflow-hidden transition-shadow hover:shadow-md border-purple-200">
              <div className="relative aspect-square bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <Avatar
                  name={sign.name}
                  size="lg"
                  className="h-20 w-20"
                            />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 hover:bg-white/80"
                  onClick={() => toggleFavorite(sign.id)}
                >
                  {sign.isFavorite ? (
                    <Bookmark className="h-5 w-5 text-indigo-600" fill="currentColor" />
                  ) : (
                    <BookmarkPlus className="h-5 w-5 text-indigo-600" />
                  )}
                            </Button>
                          </div>
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-lg text-indigo-900">{sign.name}</CardTitle>
                <CardDescription className="text-indigo-600">{sign.category}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between p-3 pt-0">
                <Badge
                  variant="outline"
                  className={`
                    ${sign.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" : 
                      sign.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                      "bg-rose-50 text-rose-700 border-rose-200"}
                  `}
                >
                  {sign.difficulty}
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => viewSignDetails(sign)}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
                    ))}
                  </div>
                ) : (
        <div className="space-y-2">
          {signs.map((sign) => (
            <Card key={sign.id} className="overflow-hidden transition-shadow hover:shadow-md border-purple-200">
              <div className="flex items-center p-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <Avatar name={sign.name} className="h-8 w-8" />
                  </div>
                            </div>
                            <div className="flex-1">
                  <h3 className="font-medium text-indigo-900">{sign.name}</h3>
                  <p className="text-sm text-indigo-600">{sign.category}</p>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <Badge 
                    variant="outline"
                    className={`
                      ${sign.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" : 
                        sign.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                        "bg-rose-50 text-rose-700 border-rose-200"}
                    `}
                  >
                    {sign.difficulty}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-indigo-50"
                    onClick={() => toggleFavorite(sign.id)}
                  >
                    {sign.isFavorite ? (
                      <Bookmark className="h-5 w-5 text-indigo-600" fill="currentColor" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5 text-indigo-600" />
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => viewSignDetails(sign)}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    Details
                  </Button>
                </div>
                            </div>
            </Card>
          ))}
                          </div>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl border-purple-200">
          {activeSign && (
            <>
              <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg">
                <DialogTitle className="text-2xl text-indigo-900">{activeSign.name}</DialogTitle>
                <DialogDescription className="text-indigo-600">
                  Category and difficulty information for this sign
                            </DialogDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                    {activeSign.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`
                      ${activeSign.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" : 
                        activeSign.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                        "bg-rose-50 text-rose-700 border-rose-200"}
                    `}
                  >
                    {activeSign.difficulty}
                  </Badge>
                </div>
                          </DialogHeader>
              <div className="grid gap-6 md:grid-cols-2 pt-4">
                <div className="aspect-square bg-gradient-to-br from-indigo-50 to-purple-50 rounded-md flex items-center justify-center">
                  <Avatar name={activeSign.name} size="lg" className="h-40 w-40" />
                          </div>
                <div className="space-y-5">
                  <div>
                    <h3 className="font-medium mb-2 text-indigo-900 text-lg flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                      Description
                    </h3>
                    <p className="text-indigo-600">{activeSign.description}</p>
                          </div>

                  <div>
                    <h3 className="font-medium mb-2 text-indigo-900 text-lg">Variations</h3>
                    <div className="flex flex-wrap gap-1">
                      {activeSign.variants.map((variant, idx) => (
                        <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          {variant}
                        </Badge>
                      ))}
                          </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2 text-indigo-900 text-lg">Practice Tips</h3>
                    <ul className="list-disc pl-5 text-indigo-600 text-sm space-y-1">
                      <li>Practice in front of a mirror</li>
                      <li>Record yourself and compare with the reference</li>
                      <li>Practice slow, then faster as you become comfortable</li>
                      <li>Try using the sign in different sentences</li>
                    </ul>
                  </div>
        </div>
      </div>

              <DialogFooter className="flex justify-between mt-6 border-t border-indigo-100 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Close
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFavorite(activeSign.id)}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    {activeSign.isFavorite ? (
                      <>
                        <Bookmark className="mr-2 h-4 w-4 text-indigo-600" fill="currentColor" />
                        Remove from Favorites
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="mr-2 h-4 w-4 text-indigo-600" />
                        Add to Favorites
                      </>
                    )}
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <HandMetal className="mr-2 h-4 w-4" />
                    Practice This Sign
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
