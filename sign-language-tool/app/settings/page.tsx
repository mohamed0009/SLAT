"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { toast } from "sonner"
import {
  AlertCircle,
  Bell,
  Camera,
  Check,
  Cog,
  Database,
  Key,
  Languages,
  Laptop,
  Save,
  Shield,
  User,
  Video,
  Trophy,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      toast.success("Your settings have been saved successfully")
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="container py-6">
      <PageHeader title="Settings" description="Configure your Sign Language Analysis Tool preferences" />

      {showSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl bg-gradient-to-r from-indigo-100 to-purple-100">
          <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Cog className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="detection" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Camera className="h-4 w-4 mr-2" />
            Detection
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            <Shield className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Cog className="h-5 w-5 text-indigo-600" />
                    <span>Application Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                          <Label htmlFor="detection_sensitivity" className="text-indigo-800">Detection Sensitivity</Label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          id="detection_sensitivity"
                          name="detection_sensitivity"
                          min="0"
                          max="1"
                          step="0.1"
                          defaultValue="0.5"
                              className="w-full accent-indigo-600"
                          onChange={(e) => {
                            const output = e.target.nextElementSibling as HTMLOutputElement
                            if (output) output.value = e.target.value
                          }}
                        />
                            <output className="w-10 text-center text-indigo-700">0.5</output>
                      </div>
                    </div>

                    <div className="space-y-2">
                          <Label htmlFor="camera_device" className="text-indigo-800">Camera Device</Label>
                      <Select defaultValue="0">
                            <SelectTrigger id="camera_device" className="w-full border-indigo-200 focus:ring-indigo-500">
                          <SelectValue placeholder="Select camera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Default Camera</SelectItem>
                          <SelectItem value="1">Secondary Camera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                          <Label htmlFor="video_quality" className="text-indigo-800">Video Quality</Label>
                      <Select defaultValue="720p">
                            <SelectTrigger id="video_quality" className="w-full border-indigo-200 focus:ring-indigo-500">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="480p">480p</SelectItem>
                          <SelectItem value="720p">720p (Recommended)</SelectItem>
                          <SelectItem value="1080p">1080p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                          <Label htmlFor="preferred_language" className="text-indigo-800">Preferred Language</Label>
                      <Select defaultValue="en">
                            <SelectTrigger id="preferred_language" className="w-full border-indigo-200 focus:ring-indigo-500">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-6 pt-4">
                      <div className="flex items-center justify-between">
                            <Label htmlFor="enable_sound" className="cursor-pointer text-indigo-800">
                          Enable Sound Feedback
                        </Label>
                            <Switch 
                              id="enable_sound" 
                              defaultChecked 
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                            />
                      </div>

                      <div className="flex items-center justify-between">
                            <Label htmlFor="enable_notifications" className="cursor-pointer text-indigo-800">
                          Enable Notifications
                        </Label>
                            <Switch 
                              id="enable_notifications" 
                              defaultChecked 
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                            />
                      </div>

                      <div className="flex items-center justify-between">
                            <Label htmlFor="dark_mode" className="cursor-pointer text-indigo-800">
                          Dark Mode
                        </Label>
                            <Switch 
                              id="dark_mode" 
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                            />
                      </div>

                      <div className="flex items-center justify-between">
                            <Label htmlFor="auto_save" className="cursor-pointer text-indigo-800">
                          Auto-Save Detections
                        </Label>
                            <Switch 
                              id="auto_save" 
                              defaultChecked 
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Laptop className="h-5 w-5 text-indigo-600" />
                    <span>Display & Appearance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme" className="text-indigo-800">Theme Selection</Label>
                        <Select defaultValue="system">
                          <SelectTrigger id="theme" className="w-full border-indigo-200 focus:ring-indigo-500">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="font_size" className="text-indigo-800">Font Size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger id="font_size" className="w-full border-indigo-200 focus:ring-indigo-500">
                            <SelectValue placeholder="Select font size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reduced_motion" className="cursor-pointer text-indigo-800">
                            Reduced Motion
                          </Label>
                          <Switch 
                            id="reduced_motion" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="high_contrast" className="cursor-pointer text-indigo-800">
                            High Contrast Mode
                          </Label>
                          <Switch 
                            id="high_contrast" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                    </div>
                  </div>
                </div>
              </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900 text-lg">Settings Guide</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 text-indigo-800">
                    <p className="text-sm text-indigo-600">
                      Configure your application preferences in this section. Changes are automatically saved when you click the Save button.
                    </p>
                    
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                      <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-indigo-600" />
                        Detection Sensitivity
                      </h3>
                      <p className="text-sm text-indigo-600">
                        Higher values make the detection more precise but may reduce performance. For most users, the default setting of 0.5 works well.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100 mt-4">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
                        <Camera className="h-4 w-4 text-purple-600" />
                        Camera Selection
                      </h3>
                      <p className="text-sm text-purple-600">
                        Choose your preferred camera for sign language detection. The default camera is usually your main webcam.
                      </p>
                    </div>
                  </div>
                </CardContent>
          </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detection" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Video className="h-5 w-5 text-indigo-600" />
                    <span>Detection Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                          <Label htmlFor="detection_model" className="text-indigo-800">Detection Model</Label>
                      <Select defaultValue="standard">
                            <SelectTrigger id="detection_model" className="w-full border-indigo-200 focus:ring-indigo-500">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (Recommended)</SelectItem>
                          <SelectItem value="high_accuracy">High Accuracy (Slower)</SelectItem>
                          <SelectItem value="fast">Fast (Less Accurate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                          <Label htmlFor="confidence_threshold" className="text-indigo-800">Confidence Threshold</Label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          id="confidence_threshold"
                          name="confidence_threshold"
                          min="0"
                          max="1"
                          step="0.05"
                          defaultValue="0.7"
                              className="w-full accent-indigo-600"
                          onChange={(e) => {
                            const output = e.target.nextElementSibling as HTMLOutputElement
                            if (output) output.value = e.target.value
                          }}
                        />
                            <output className="w-10 text-center text-indigo-700">0.7</output>
                      </div>
                    </div>

                    <div className="space-y-2">
                          <Label htmlFor="frame_rate" className="text-indigo-800">Frame Rate</Label>
                      <Select defaultValue="30">
                            <SelectTrigger id="frame_rate" className="w-full border-indigo-200 focus:ring-indigo-500">
                          <SelectValue placeholder="Select frame rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 FPS</SelectItem>
                          <SelectItem value="30">30 FPS (Recommended)</SelectItem>
                          <SelectItem value="60">60 FPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                          <Label htmlFor="max_detections" className="text-indigo-800">Maximum Detections</Label>
                          <Select defaultValue="2">
                            <SelectTrigger id="max_detections" className="w-full border-indigo-200 focus:ring-indigo-500">
                              <SelectValue placeholder="Select maximum" />
                        </SelectTrigger>
                        <SelectContent>
                              <SelectItem value="1">1 Person</SelectItem>
                              <SelectItem value="2">2 People</SelectItem>
                              <SelectItem value="4">4 People</SelectItem>
                              <SelectItem value="6">6 People</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                        <div className="space-y-2">
                          <Label htmlFor="model_accuracy" className="text-indigo-800">Model Accuracy vs. Performance</Label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              id="model_accuracy"
                              name="model_accuracy"
                              min="0"
                              max="1"
                              step="0.1"
                              defaultValue="0.5"
                              className="w-full accent-indigo-600"
                              onChange={(e) => {
                                const output = e.target.nextElementSibling as HTMLOutputElement
                                if (output) output.value = e.target.value
                              }}
                            />
                            <output className="w-10 text-center text-indigo-700">0.5</output>
                          </div>
                          <div className="flex justify-between text-xs text-indigo-500 pt-1">
                            <span>Performance</span>
                            <span>Accuracy</span>
                          </div>
                    </div>

                    <div className="space-y-6 pt-4">
                      <div className="flex items-center justify-between">
                            <Label htmlFor="show_landmarks" className="cursor-pointer text-indigo-800">
                              Show Hand Landmarks
                        </Label>
                            <Switch 
                              id="show_landmarks" 
                              defaultChecked 
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                            />
                      </div>

                      <div className="flex items-center justify-between">
                            <Label htmlFor="enable_smoothing" className="cursor-pointer text-indigo-800">
                              Enable Motion Smoothing
                        </Label>
                            <Switch 
                              id="enable_smoothing" 
                              defaultChecked 
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                            />
                      </div>
                      </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Detection Settings
                          </>
                        )}
                      </Button>
                </div>
              </form>
                </CardContent>
          </Card>

              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Camera className="h-5 w-5 text-indigo-600" />
                    <span>Camera Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
              <div className="space-y-2">
                          <Label htmlFor="aspect_ratio" className="text-indigo-800">Aspect Ratio</Label>
                          <Select defaultValue="4:3">
                            <SelectTrigger id="aspect_ratio" className="w-full border-indigo-200 focus:ring-indigo-500">
                              <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                              <SelectItem value="4:3">4:3</SelectItem>
                              <SelectItem value="16:9">16:9</SelectItem>
                              <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                          <Label htmlFor="video_flip" className="text-indigo-800">Video Flip</Label>
                          <Select defaultValue="mirror">
                            <SelectTrigger id="video_flip" className="w-full border-indigo-200 focus:ring-indigo-500">
                              <SelectValue placeholder="Select flip mode" />
                  </SelectTrigger>
                  <SelectContent>
                              <SelectItem value="none">No Flip</SelectItem>
                              <SelectItem value="mirror">Mirror (Horizontal)</SelectItem>
                              <SelectItem value="vertical">Vertical</SelectItem>
                              <SelectItem value="both">Both (180°)</SelectItem>
                  </SelectContent>
                </Select>
                        </div>
              </div>

                      <div className="space-y-4">
              <div className="space-y-2">
                          <Label htmlFor="video_brightness" className="text-indigo-800">Brightness</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                              id="video_brightness"
                              name="video_brightness"
                              min="-1"
                              max="1"
                    step="0.1"
                              defaultValue="0"
                              className="w-full accent-indigo-600"
                    onChange={(e) => {
                      const output = e.target.nextElementSibling as HTMLOutputElement
                                if (output) output.value = e.target.value
                    }}
                  />
                            <output className="w-10 text-center text-indigo-700">0</output>
                </div>
              </div>

                        <div className="space-y-2">
                          <Label htmlFor="video_contrast" className="text-indigo-800">Contrast</Label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              id="video_contrast"
                              name="video_contrast"
                              min="-1"
                              max="1"
                              step="0.1"
                              defaultValue="0"
                              className="w-full accent-indigo-600"
                              onChange={(e) => {
                                const output = e.target.nextElementSibling as HTMLOutputElement
                                if (output) output.value = e.target.value
                              }}
                            />
                            <output className="w-10 text-center text-indigo-700">0</output>
                          </div>
                        </div>
                </div>
              </div>
            </div>
                </CardContent>
          </Card>
            </div>
            
            <div className="space-y-8">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900 text-lg">Detection Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                      <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-indigo-600" />
                        Lighting Matters
                      </h3>
                      <p className="text-sm text-indigo-600">
                        Ensure your environment is well-lit for best detection results. Avoid strong backlighting that can create shadows.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-purple-600" />
                        Performance Tips
                      </h3>
                      <p className="text-sm text-purple-600">
                        If detection is slow on your device, try lowering the frame rate and selecting the "Fast" detection model.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-fuchsia-50 p-4 border border-fuchsia-100 mt-4">
                      <h3 className="font-medium text-fuchsia-800 flex items-center gap-2 mb-2">
                        <Camera className="h-4 w-4 text-fuchsia-600" />
                        Camera Position
                      </h3>
                      <p className="text-sm text-fuchsia-600">
                        Position your camera at eye level and ensure your signing space is fully visible for optimal recognition.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <User className="h-5 w-5 text-indigo-600" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-indigo-800">Full Name</Label>
                          <Input 
                            id="full_name" 
                            placeholder="Your name" 
                            defaultValue="Sarah Johnson"
                            className="border-indigo-200 focus-visible:ring-indigo-500" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-indigo-800">Email Address</Label>
                          <Input 
                            id="email" 
                            placeholder="Your email" 
                            type="email"
                            defaultValue="sarah.johnson@example.com"
                            className="border-indigo-200 focus-visible:ring-indigo-500" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-indigo-800">Username</Label>
                          <Input 
                            id="username" 
                            placeholder="Your username" 
                            defaultValue="sarahj"
                            className="border-indigo-200 focus-visible:ring-indigo-500" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-indigo-800">Location</Label>
                          <Input 
                            id="location" 
                            placeholder="Your location" 
                            defaultValue="New York, USA"
                            className="border-indigo-200 focus-visible:ring-indigo-500" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-indigo-800">Bio</Label>
                      <textarea 
                        id="bio" 
                        placeholder="Tell us about yourself..." 
                        className="w-full min-h-[100px] p-3 border border-indigo-200 rounded-md focus-visible:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        defaultValue="Passionate about learning sign language to better communicate with my deaf cousin. I'm currently focused on ASL basics and everyday conversations."
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Key className="h-5 w-5 text-indigo-600" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password" className="text-indigo-800">Current Password</Label>
                        <Input 
                          id="current_password" 
                          type="password" 
                          placeholder="Enter current password" 
                          className="border-indigo-200 focus-visible:ring-indigo-500" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                          <Label htmlFor="new_password" className="text-indigo-800">New Password</Label>
                          <Input 
                            id="new_password" 
                            type="password" 
                            placeholder="Enter new password" 
                            className="border-indigo-200 focus-visible:ring-indigo-500" 
                          />
              </div>

              <div className="space-y-2">
                          <Label htmlFor="confirm_password" className="text-indigo-800">Confirm New Password</Label>
                          <Input 
                            id="confirm_password" 
                            type="password" 
                            placeholder="Confirm new password" 
                            className="border-indigo-200 focus-visible:ring-indigo-500" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="two_factor" className="cursor-pointer text-indigo-800">
                            Two-Factor Authentication
                          </Label>
                          <Switch 
                            id="two_factor" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="session_timeout" className="cursor-pointer text-indigo-800">
                            Auto-logout After Inactivity
                          </Label>
                          <Switch 
                            id="session_timeout" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                      </div>
              </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Security Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900 text-lg">Account Security Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                      <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-indigo-600" />
                        Password Strength
                      </h3>
                      <p className="text-sm text-indigo-600">
                        Use a strong password with at least 12 characters including uppercase letters, numbers, and symbols.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
                        <Key className="h-4 w-4 text-purple-600" />
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-purple-600">
                        Enable two-factor authentication for an extra layer of security to protect your account.
                      </p>
                    </div>
                  </div>
                </CardContent>
          </Card>

              <Card className="border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
                  <CardTitle className="text-purple-900 text-lg">Your Account</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-200">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-900">Sarah Johnson</h3>
                        <p className="text-sm text-indigo-600">Pro Account</p>
                      </div>
                    </div>
                    <div className="text-sm text-indigo-600 pt-2">
                      <p>Member since: September 2023</p>
                      <p>Last login: Today at 10:25 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Bell className="h-5 w-5 text-indigo-600" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-indigo-900">Email Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email_learning_reminders" className="cursor-pointer text-indigo-800">
                            Learning Reminders
                          </Label>
                          <Switch 
                            id="email_learning_reminders" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email_new_lessons" className="cursor-pointer text-indigo-800">
                            New Lessons and Content
                          </Label>
                          <Switch 
                            id="email_new_lessons" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email_progress_reports" className="cursor-pointer text-indigo-800">
                            Weekly Progress Reports
                          </Label>
                          <Switch 
                            id="email_progress_reports" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email_account" className="cursor-pointer text-indigo-800">
                            Account Updates
                          </Label>
                          <Switch 
                            id="email_account" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-indigo-100">
                      <h3 className="text-lg font-medium text-indigo-900">In-App Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp_lessons" className="cursor-pointer text-indigo-800">
                            Lesson Reminders
                          </Label>
                          <Switch 
                            id="inapp_lessons" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp_achievements" className="cursor-pointer text-indigo-800">
                            Achievement Notifications
                          </Label>
                          <Switch 
                            id="inapp_achievements" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp_community" className="cursor-pointer text-indigo-800">
                            Community Updates
                          </Label>
                          <Switch 
                            id="inapp_community" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inapp_tips" className="cursor-pointer text-indigo-800">
                            Learning Tips
                          </Label>
                          <Switch 
                            id="inapp_tips" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-indigo-100">
                      <h3 className="text-lg font-medium text-indigo-900">Push Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push_enabled" className="cursor-pointer text-indigo-800">
                            Enable Push Notifications
                          </Label>
                          <Switch 
                            id="push_enabled" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Notification Settings
                          </>
                        )}
                  </Button>
                </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900 text-lg">About Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-indigo-600">
                      Notifications help you stay on track with your learning goals and keep you informed about important updates.
                    </p>
                    
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                      <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-indigo-600" />
                        Learning Reminders
                      </h3>
                      <p className="text-sm text-indigo-600">
                        Daily notifications to remind you to practice for at least 5 minutes to maintain your streak.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
                        <Trophy className="h-4 w-4 text-purple-600" />
                        Achievement Notifications
                      </h3>
                      <p className="text-sm text-purple-600">
                        Get notified when you earn badges, complete courses, or reach milestones in your learning journey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="overflow-hidden border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <Database className="h-5 w-5 text-indigo-600" />
                    <span>Data Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-indigo-900">Learning Data</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="store_practice_videos" className="cursor-pointer text-indigo-800">
                            Store Practice Videos
                          </Label>
                          <Switch 
                            id="store_practice_videos" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
              </div>

              <div className="space-y-2">
                          <Label htmlFor="data_retention" className="text-indigo-800">Practice Data Retention</Label>
                          <Select defaultValue="30">
                            <SelectTrigger id="data_retention" className="w-full border-indigo-200 focus:ring-indigo-500">
                              <SelectValue placeholder="Select retention period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7 Days</SelectItem>
                              <SelectItem value="30">30 Days</SelectItem>
                              <SelectItem value="90">90 Days</SelectItem>
                              <SelectItem value="365">1 Year</SelectItem>
                              <SelectItem value="unlimited">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
              </div>
            </div>
                    
                    <div className="space-y-4 pt-6 border-t border-indigo-100">
                      <h3 className="text-lg font-medium text-indigo-900">Application Data</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="collect_analytics" className="cursor-pointer text-indigo-800">
                            Share Anonymous Usage Data
                          </Label>
                          <Switch 
                            id="collect_analytics" 
                            defaultChecked
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="offline_mode" className="cursor-pointer text-indigo-800">
                            Enable Offline Mode
                          </Label>
                          <Switch 
                            id="offline_mode" 
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button variant="outline" className="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto">
                            Download Your Data
                          </Button>
                        </div>
        </div>
      </div>

                    <div className="space-y-4 pt-6 border-t border-indigo-100">
                      <h3 className="text-lg font-medium text-indigo-900 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span>Danger Zone</span>
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="pt-2 space-y-3">
                          <Button variant="outline" className="border-red-200 bg-white text-red-600 hover:bg-red-50 w-full sm:w-auto">
                            Clear All Learning Data
                          </Button>
                          
                          <Button variant="outline" className="border-red-200 bg-white text-red-600 hover:bg-red-50 w-full sm:w-auto">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-indigo-100 mt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
          {isSaving ? (
                          <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
                            Save Advanced Settings
            </>
          )}
        </Button>
      </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-indigo-900 text-lg">Privacy Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-indigo-600">
                      We take your privacy seriously. Here's how we handle your data and what controls you have.
                    </p>
                    
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                      <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-indigo-600" />
                        Your Data Control
                      </h3>
                      <p className="text-sm text-indigo-600">
                        You can download or delete your data at any time. Your practice videos are only stored if you enable this option.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-purple-600" />
                        Analytics Usage
                      </h3>
                      <p className="text-sm text-purple-600">
                        Anonymous usage data helps us improve the app. No personally identifiable information is collected in analytics.
                      </p>
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
