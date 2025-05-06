"use client"

import * as React from "react"
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type AvatarProps = {
  name?: string
  imageUrl?: string
  size?: "sm" | "md" | "lg"
  className?: string
  isTranslating?: boolean
  playbackSpeed?: number
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function Avatar({ 
  name, 
  imageUrl, 
  size = "md", 
  className,
  isTranslating = false,
  playbackSpeed = 1 
}: AvatarProps) {
  // If this is the animated avatar for translations
  if (isTranslating) {
    return <AnimatedAvatar imageUrl={imageUrl || ""} isTranslating={isTranslating} playbackSpeed={playbackSpeed} />
  }
  
  // Size classes for different avatar sizes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  return (
    <UIAvatar className={cn(sizeClasses[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || "Avatar"} />}
      {name && (
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(name)}
        </AvatarFallback>
      )}
      {!name && !imageUrl && (
        <AvatarFallback>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </AvatarFallback>
      )}
    </UIAvatar>
  )
}

interface AnimatedAvatarProps {
  imageUrl: string
  isTranslating: boolean
  playbackSpeed: number
}

function AnimatedAvatar({ imageUrl, isTranslating, playbackSpeed }: AnimatedAvatarProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [animationFrame, setAnimationFrame] = React.useState(0)

  // Load the avatar image
  React.useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Set canvas dimensions to match image
          canvas.width = img.width
          canvas.height = img.height

          // Draw the image
          ctx.drawImage(img, 0, 0)
          setIsLoading(false)
        }
      }
    }
  }, [imageUrl])

  // Animation effect when translating
  React.useEffect(() => {
    if (!isTranslating || !canvasRef.current) return

    let frame = 0
    let lastTimestamp = 0
    const frameDuration = 100 / playbackSpeed // Adjust based on playback speed

    // Define sign language animation frames
    const signAnimations = [
      // Each function represents a frame of animation
      (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Reset canvas with original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        ctx.drawImage(img, 0, 0)

        // Animate right hand position (simplified)
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)"
        ctx.beginPath()
        ctx.arc(width * 0.7, height * 0.6, 20, 0, Math.PI * 2)
        ctx.fill()
      },
      (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Reset canvas with original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        ctx.drawImage(img, 0, 0)

        // Animate right hand position (simplified)
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)"
        ctx.beginPath()
        ctx.arc(width * 0.7, height * 0.5, 20, 0, Math.PI * 2)
        ctx.fill()
      },
      (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Reset canvas with original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        ctx.drawImage(img, 0, 0)

        // Animate right hand position (simplified)
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)"
        ctx.beginPath()
        ctx.arc(width * 0.6, height * 0.4, 20, 0, Math.PI * 2)
        ctx.fill()
      },
      (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Reset canvas with original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        ctx.drawImage(img, 0, 0)

        // Animate right hand position (simplified)
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)"
        ctx.beginPath()
        ctx.arc(width * 0.5, height * 0.4, 20, 0, Math.PI * 2)
        ctx.fill()
      },
      (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Reset canvas with original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        ctx.drawImage(img, 0, 0)

        // Animate right hand position (simplified)
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)"
        ctx.beginPath()
        ctx.arc(width * 0.4, height * 0.5, 20, 0, Math.PI * 2)
        ctx.fill()
      },
      (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Reset canvas with original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl
        ctx.drawImage(img, 0, 0)

        // Animate right hand position (simplified)
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)"
        ctx.beginPath()
        ctx.arc(width * 0.4, height * 0.6, 20, 0, Math.PI * 2)
        ctx.fill()
      },
    ]

    const animate = (timestamp: number) => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) return

      // Control animation speed based on timestamp
      if (timestamp - lastTimestamp > frameDuration) {
        // Update frame and draw animation
        frame = (frame + 1) % signAnimations.length
        setAnimationFrame(frame)
        signAnimations[frame](ctx, canvas.width, canvas.height)
        lastTimestamp = timestamp
      }

      if (isTranslating) {
        requestAnimationFrame(animate)
      }
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)

      // Reset to original image when animation stops
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = imageUrl
          ctx.drawImage(img, 0, 0)
        }
      }
    }
  }, [isTranslating, imageUrl, playbackSpeed])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="h-8 w-8 text-primary animate-spin mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <span className="text-sm text-gray-500">Loading avatar...</span>
        </div>
      ) : (
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      )}

      {isTranslating && !isLoading && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          Translating... Frame {animationFrame + 1}
        </div>
      )}
    </div>
  )
}
