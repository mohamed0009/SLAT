// Sign language processing utilities

// Map of common words to sign language gestures
export const signLanguageMap: Record<string, string[]> = {
  hello: ["wave", "palm_forward", "smile"],
  goodbye: ["wave", "palm_away", "neutral"],
  thank: ["flat_hand", "touch_chin", "move_forward"],
  you: ["point_forward", "hold", "neutral"],
  me: ["point_self", "touch_chest", "neutral"],
  please: ["flat_hand", "circle_chest", "smile"],
  sorry: ["fist", "circle_chest", "sad"],
  yes: ["nod", "fist_up_down", "smile"],
  no: ["head_shake", "hand_wave_horizontal", "serious"],
  help: ["palm_up", "lift", "concerned"],
  want: ["hands_pull_in", "determined", "neutral"],
  love: ["cross_arms", "hands_to_heart", "smile"],
  good: ["thumb_up", "nod", "smile"],
  bad: ["thumb_down", "shake_head", "frown"],
  eat: ["hand_to_mouth", "chew", "neutral"],
  drink: ["cup_hand", "to_mouth", "swallow"],
  name: ["finger_spell", "point_self", "questioning"],
  what: ["palms_up", "shrug", "questioning"],
  where: ["point_around", "look_around", "questioning"],
  when: ["tap_wrist", "questioning", "neutral"],
  who: ["chin_touch", "point_out", "questioning"],
  how: ["palms_up", "circular_motion", "questioning"],
  why: ["index_to_temple", "questioning", "serious"],
}

// Convert text to sign language sequence
export function textToSignSequence(text: string): string[] {
  const words = text.toLowerCase().trim().split(/\s+/)
  let sequence: string[] = []

  words.forEach((word) => {
    // Remove punctuation
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")

    if (signLanguageMap[cleanWord]) {
      sequence = [...sequence, ...signLanguageMap[cleanWord]]
    } else {
      // For words not in our dictionary, we'll finger spell them
      sequence.push("finger_spell_" + cleanWord)
    }
  })

  return sequence
}

// Analyze sign language video for recognition
export function analyzeSignVideo(videoData: Blob): Promise<string> {
  return new Promise((resolve) => {
    // In a real implementation, this would send the video to a machine learning model
    // For demo purposes, we'll simulate a response after a delay
    setTimeout(() => {
      resolve("hello how are you")
    }, 2000)
  })
}

// Get confidence score for sign language recognition
export function getRecognitionConfidence(signData: any): number {
  // In a real implementation, this would calculate a confidence score
  // For demo purposes, we'll return a random score between 70 and 100
  return Math.floor(Math.random() * 30) + 70
}

// Export sign language translation to different formats
export function exportTranslation(text: string, format: "video" | "gif" | "text"): string {
  // In a real implementation, this would generate the requested format
  // For demo purposes, we'll return a placeholder message
  switch (format) {
    case "video":
      return "Translation exported as video"
    case "gif":
      return "Translation exported as GIF"
    case "text":
      return "Translation exported as text: " + text
    default:
      return "Unknown export format"
  }
}
