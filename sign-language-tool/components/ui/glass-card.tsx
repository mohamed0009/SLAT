'use client';

import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  hoverEffect?: boolean
  animation?: "fade-in" | "scale-in" | "none"
  glassDark?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", size = "default", hoverEffect = true, animation = "none", glassDark = false, children, ...props }, ref) => {
    const animationClass = 
      animation === "fade-in" 
        ? "animate-fade-in-up" 
        : animation === "scale-in" 
          ? "animate-scale-in" 
          : "";
    
    return (
      <div
        className={cn(
          "rounded-xl shadow-lg",
          glassDark ? "glass-dark" : "glass",
          hoverEffect && "hover-card-effect",
          animationClass,
          size === "sm" && "p-4",
          size === "default" && "p-6",
          size === "lg" && "p-8",
          size === "icon" && "p-3",
          variant === "destructive" && "border-destructive/30",
          variant === "outline" && "border-2 border-white/10",
          variant === "secondary" && "bg-opacity-20",
          variant === "ghost" && "bg-opacity-10 shadow-none",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard } 