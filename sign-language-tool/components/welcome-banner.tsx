import React from 'react'
import { HandMetal, ArrowRight, Play, Book, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface WelcomeBannerProps {
  userName?: string
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 shadow-xl mb-8 animate-gradient">
      {/* Decorative elements */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-pulse-slow"></div>
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute left-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/5 blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg animate-float">
            <HandMetal className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            <span className="font-black">SLAT</span>
          </h1>
        </div>
        
        <div className="max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-white">
            Welcome to the Sign Language Analysis Tool
            {userName && <span> {userName}</span>}!
          </h2>
          <p className="mb-6 text-lg text-white/90">
            Your all-in-one platform for learning, translating, and mastering sign language with AI-powered assistance.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/translate">
              <Button variant="gradient" size="lg" className="group font-semibold animate-gradient">
                Start Translating 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dictionary">
              <Button variant="default" size="lg" className="bg-white/20 font-semibold backdrop-blur-sm hover:bg-white/30">
                Explore Dictionary
                <Book className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
            <Play className="h-3.5 w-3.5" />
            <span>Interactive Learning</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
            <Book className="h-3.5 w-3.5" />
            <span>Dictionary of Signs</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>AI-Powered Learning</span>
          </div>
        </div>
      </div>
    </div>
  )
} 