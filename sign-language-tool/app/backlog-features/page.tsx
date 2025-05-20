import { BacklogFeatures } from "@/components/backlog-features"
import { CollaborativeFeatures } from "@/components/collaborative-features"
import { EducationalFeatures } from "@/components/educational-features"
import { ResearchAnalytics } from "@/components/research-analytics"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HandMetal, Users, BookOpen, BarChart2 } from "lucide-react"

export default function BacklogFeaturesPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="SLAT Features"
        description="Sign Language Analysis Tool - Complete Feature Set"
        gradient
        icon={<HandMetal className="h-8 w-8 text-indigo-600" />}
      />

      <Tabs defaultValue="translation" className="mt-8">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-indigo-100 to-purple-100">
          <TabsTrigger 
            value="translation"
            className="data-[state=active]:bg-white data-[state=active]:text-indigo-700"
          >
            <HandMetal className="h-4 w-4 mr-2" />
            Translation & Recognition
          </TabsTrigger>
          <TabsTrigger 
            value="collaboration"
            className="data-[state=active]:bg-white data-[state=active]:text-indigo-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Collaboration
          </TabsTrigger>
          <TabsTrigger 
            value="education"
            className="data-[state=active]:bg-white data-[state=active]:text-indigo-700"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Education
          </TabsTrigger>
          <TabsTrigger 
            value="research"
            className="data-[state=active]:bg-white data-[state=active]:text-indigo-700"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Research & Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="translation" className="mt-6">
          <BacklogFeatures />
        </TabsContent>
        <TabsContent value="collaboration" className="mt-6">
          <CollaborativeFeatures />
        </TabsContent>
        <TabsContent value="education" className="mt-6">
          <EducationalFeatures />
        </TabsContent>
        <TabsContent value="research" className="mt-6">
          <ResearchAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
