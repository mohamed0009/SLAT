'use client';

import type React from "react"
import { HandMetal, Sparkles } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  gradient?: boolean
  icon?: React.ReactNode
}

export function PageHeader({ title, description, gradient = false, icon }: PageHeaderProps) {
  if (gradient) {
    return (
      <header className="p-8 bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 rounded-2xl mb-8 relative overflow-hidden shadow-lg animate-fade-in-up">
        {/* Mesh gradient noise effect */}
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -mr-32 -mt-32 blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -ml-32 -mb-32 blur-xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 px-6 py-3 glass rounded-full shadow-lg backdrop-blur-sm border border-white/20 group animate-float">
            <div className="relative">
              {icon || <HandMetal className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform duration-300" />}
              <span className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-4 w-4 text-blue-300 animate-pulse" />
              </span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              SLAT
            </span>
          </div>
          <p className="text-lg text-white font-medium px-6 py-3 glass backdrop-blur-sm rounded-lg shadow-lg border border-white/10 max-w-lg text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {description || "Sign Language Analysis Tool"}
          </p>
        </div>
      </header>
    )
  }

  return (
    <header className="mb-8 animate-fade-in-up">
      <div className="relative inline-block">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{title}</h1>
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {description}
        </p>
      )}
    </header>
  )
}
