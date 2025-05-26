'use client';

import React, { useEffect, useRef } from 'react'
import { HandMetal, ArrowRight, Play, Book, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface WelcomeBannerProps {
  userName?: string
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });
    
    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }
    
    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={bannerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 p-8 shadow-xl mb-8 opacity-0 translate-y-4 transition-all duration-700"
    >
      {/* Moving mesh gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100px] opacity-30">
          <svg className="h-full w-full" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl animate-pulse-slow"></div>
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-600/10 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute left-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/5 blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-float group">
            <HandMetal className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -inset-0.5 rounded-full bg-white/20 blur-sm animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <span className="font-black mr-2 relative">
              SLAT
              <span className="absolute -right-1 -top-1">
                <Sparkles className="h-4 w-4 text-blue-300 animate-pulse" />
              </span>
            </span>
            <span className="text-sm font-normal bg-white/10 px-2 py-0.5 rounded-md">v2.0</span>
          </h1>
        </div>
        
        <div className="max-w-2xl text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <h2 className="mb-3 text-2xl font-bold text-white relative inline-block">
            Welcome to the Sign Language Analysis Tool
            {userName && <span> {userName}</span>}!
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </h2>
          <p className="mb-6 text-lg text-white/90 leading-relaxed">
            Your all-in-one platform for learning, translating, and mastering sign language with 
            <span className="relative px-2">
              <span className="relative z-10">AI-powered</span>
              <span className="absolute inset-0 bg-blue-500/20 rounded-md blur-sm"></span>
            </span> 
            assistance.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Link href="/translate">
              <Button className="group bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105 transition-all duration-300 font-semibold">
                Start Translating 
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dictionary">
              <Button variant="default" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-lg hover:shadow-blue-900/20 hover:scale-105 transition-all duration-300 font-semibold">
                Explore Dictionary
                <Book className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-800/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 cursor-pointer hover:scale-105 border border-white/10">
            <Play className="h-3.5 w-3.5" />
            <span>Interactive Learning</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-800/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 cursor-pointer hover:scale-105 border border-white/10">
            <Book className="h-3.5 w-3.5" />
            <span>Dictionary of Signs</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-800/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 cursor-pointer hover:scale-105 border border-white/10">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>AI-Powered Learning</span>
          </div>
        </div>
      </div>
    </div>
  )
} 