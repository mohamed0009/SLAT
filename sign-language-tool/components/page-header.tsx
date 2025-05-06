import type React from "react"
import { HandMetal } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  gradient?: boolean
  icon?: React.ReactNode
}

export function PageHeader({ title, description, gradient = false, icon }: PageHeaderProps) {
  if (gradient) {
    return (
      <header className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-8 relative overflow-hidden shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-xl"></div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/90 rounded-full shadow-md backdrop-blur-sm">
            {icon || <HandMetal className="h-8 w-8 text-indigo-600" />}
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SLAT
            </span>
          </div>
          <p className="text-lg text-white font-medium px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg shadow-md border border-white/20 max-w-lg text-center">
            {description || "Sign Language Analysis Tool"}
          </p>
        </div>
      </header>
    )
  }

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
    </header>
  )
}
