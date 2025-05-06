"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface ImprovedAvatarProps {
  imageUrl: string
  isTranslating: boolean
  playbackSpeed: number
  signText: string
}

// Dictionary of basic sign gestures with relative positions (0-1 range)
const signDictionary: Record<string, Array<{ rightHand: [number, number]; leftHand: [number, number] }>> = {
  hello: [
    { rightHand: [0.7, 0.5], leftHand: [0.3, 0.5] },
    { rightHand: [0.7, 0.4], leftHand: [0.3, 0.5] },
    { rightHand: [0.7, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.7, 0.4], leftHand: [0.3, 0.5] },
    { rightHand: [0.7, 0.5], leftHand: [0.3, 0.5] },
  ],
  thank: [
    { rightHand: [0.5, 0.4], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.4, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.3, 0.4], leftHand: [0.3, 0.5] },
  ],
  you: [
    { rightHand: [0.6, 0.5], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.5], leftHand: [0.3, 0.5] },
    { rightHand: [0.4, 0.5], leftHand: [0.3, 0.5] },
  ],
  please: [
    { rightHand: [0.5, 0.4], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.6, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.4], leftHand: [0.3, 0.5] },
  ],
  yes: [
    { rightHand: [0.5, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.4], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.3], leftHand: [0.3, 0.5] },
  ],
  no: [
    { rightHand: [0.5, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.6, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.4, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.6, 0.3], leftHand: [0.3, 0.5] },
    { rightHand: [0.5, 0.3], leftHand: [0.3, 0.5] },
  ],
}

export function ImprovedAvatar({ imageUrl, isTranslating, playbackSpeed, signText }: ImprovedAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentWord, setCurrentWord] = useState("")
  const [animationFrame, setAnimationFrame] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const avatarImageRef = useRef<HTMLImageElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Load avatar image
  useEffect(() => {
    if (!imageUrl) return

    setIsLoading(true)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
    img.onload = () => {
      avatarImageRef.current = img
      setIsLoading(false)
      drawAvatar()
    }
    img.onerror = () => {
      console.error("Error loading avatar image")
      setIsLoading(false)
    }

    return () => {
      if (avatarImageRef.current) {
        avatarImageRef.current = null
      }
    }
  }, [imageUrl])

  // Draw the avatar on canvas
  const drawAvatar = () => {
    const canvas = canvasRef.current
    if (!canvas || !avatarImageRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw avatar image
    ctx.drawImage(avatarImageRef.current, 0, 0, canvas.width, canvas.height)
  }

  // Draw hands at specified positions
  const drawHands = (rightHandPos: [number, number], leftHandPos: [number, number]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas and redraw avatar
    drawAvatar()

    // Draw right hand
    const rightX = rightHandPos[0] * canvas.width
    const rightY = rightHandPos[1] * canvas.height
    ctx.fillStyle = "rgba(99, 102, 241, 0.7)" // Indigo color
    ctx.beginPath()
    ctx.arc(rightX, rightY, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw left hand
    const leftX = leftHandPos[0] * canvas.width
    const leftY = leftHandPos[1] * canvas.height
    ctx.fillStyle = "rgba(99, 102, 241, 0.7)" // Indigo color
    ctx.beginPath()
    ctx.arc(leftX, leftY, 20, 0, Math.PI * 2)
    ctx.fill()
  }

  // Process text into sign language animations
  useEffect(() => {
    if (!isTranslating || !signText || !canvasRef.current) return

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Split text into words
    const words = signText.toLowerCase().split(/\s+/)
    let wordIndex = 0
    let frameIndex = 0
    let lastTimestamp = 0

    // Animation function
    const animateSign = (timestamp: number) => {
      if (!isTranslating) return

      // Control animation speed based on timestamp and playback speed
      const frameDuration = 500 / playbackSpeed // milliseconds per frame

      if (!lastTimestamp || timestamp - lastTimestamp > frameDuration) {
        // Get current word
        const word = words[wordIndex]
        setCurrentWord(word)

        // Get sign animation for current word
        const signAnimation = signDictionary[word] || signDictionary["hello"] // Default to "hello" if word not found

        // Update hand positions based on current frame
        if (signAnimation && signAnimation[frameIndex]) {
          const { rightHand, leftHand } = signAnimation[frameIndex]
          drawHands(rightHand, leftHand)
        }

        // Update animation frame
        frameIndex++
        setAnimationFrame(frameIndex)

        // Move to next word if all frames for current word are done
        if (!signAnimation || frameIndex >= signAnimation.length) {
          wordIndex = (wordIndex + 1) % words.length
          frameIndex = 0
        }

        // Update animation progress
        const progress = (wordIndex / words.length) * 100
        setAnimationProgress(progress)

        lastTimestamp = timestamp
      }

      // Continue animation
      if (isTranslating) {
        animationRef.current = requestAnimationFrame(animateSign)
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animateSign)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Reset to default state
      drawAvatar()
    }
  }, [isTranslating, signText, playbackSpeed])

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement
        canvasRef.current.width = parent.clientWidth
        canvasRef.current.height = parent.clientHeight
        drawAvatar()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: isLoading ? "none" : "block" }} />

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-80">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <span className="text-sm text-gray-500">Loading avatar...</span>
        </div>
      )}

      {isTranslating && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-md">
          <div className="flex justify-between items-center mb-1">
            <span>Translating: "{currentWord}"</span>
            <span>{Math.round(animationProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${animationProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
