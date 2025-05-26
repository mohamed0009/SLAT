'use client';

import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

export interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  sparkle?: boolean
  glowEffect?: boolean
}

const FloatingButton = forwardRef<HTMLButtonElement, FloatingButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      sparkle = false,
      glowEffect = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95",
          "animate-float",
          variant === "default" && "bg-white text-gray-800 hover:bg-gray-100",
          variant === "primary" && "bg-gradient-to-r from-blue-600 to-blue-800 text-white",
          variant === "outline" && "bg-transparent border-2 border-blue-500 text-blue-500",
          variant === "ghost" && "bg-transparent text-blue-500 shadow-none hover:bg-blue-50",
          size === "default" && "h-14 w-14",
          size === "sm" && "h-10 w-10",
          size === "lg" && "h-16 w-16",
          size === "icon" && "h-12 w-12",
          glowEffect && "hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="relative">
          {children}
          {sparkle && (
            <span className="absolute -right-1 -top-1">
              <Sparkles className="h-3 w-3 text-blue-300 animate-pulse" />
            </span>
          )}
        </div>
      </button>
    )
  }
)

FloatingButton.displayName = "FloatingButton"

export { FloatingButton } 