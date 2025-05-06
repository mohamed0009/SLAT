interface ChatbotResponse {
  text: string;
  suggestions?: string[];
}

class ChatbotService {
  private static instance: ChatbotService;
  private readonly knowledgeBase: Record<string, string> = {
    welcome:
      "Welcome to SLAT! I can help you with:\n- Using the webcam detection\n- Converting audio to sign language\n- Converting text to sign language\n- Understanding sign language basics",
    webcam:
      'To use the webcam detection:\n1. Click the "Start Detection" button\n2. Position your hands clearly in front of the camera\n3. Make sign language gestures\n4. The system will detect and display the signs in real-time',
    audio:
      "To convert audio to sign language:\n1. Click the microphone button in the Audio to Sign panel\n2. Speak clearly into your microphone\n3. Your speech will be converted to text\n4. The corresponding sign language animations will be shown",
    text: "To convert text to sign language:\n1. Type your text in the Text to Sign panel\n2. Press Enter or click Convert\n3. The system will show the sign language sequence for your text",
    help: "I can help you with:\n- Webcam detection (/webcam)\n- Audio conversion (/audio)\n- Text conversion (/text)\n- General information (/about)\nType these commands or ask your question naturally!",
    about:
      "SLAT (Sign Language Analysis Tool) is a comprehensive platform that helps you:\n- Learn sign language through real-time detection\n- Convert speech to sign language\n- Convert text to sign language\n- Practice and improve your signing skills",
  };

  private constructor() {}

  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  async processMessage(message: string): Promise<ChatbotResponse> {
    const normalizedMessage = message.toLowerCase().trim();

    // Handle commands
    if (normalizedMessage.startsWith("/")) {
      const command = normalizedMessage.slice(1);
      if (this.knowledgeBase[command]) {
        return {
          text: this.knowledgeBase[command],
          suggestions: ["webcam", "audio", "text", "help"].map((s) => `/${s}`),
        };
      }
    }

    // Handle natural language queries
    if (
      normalizedMessage.includes("webcam") ||
      normalizedMessage.includes("camera") ||
      normalizedMessage.includes("detection")
    ) {
      return { text: this.knowledgeBase["webcam"] };
    }
    if (
      normalizedMessage.includes("audio") ||
      normalizedMessage.includes("speak") ||
      normalizedMessage.includes("voice")
    ) {
      return { text: this.knowledgeBase["audio"] };
    }
    if (
      normalizedMessage.includes("text") ||
      normalizedMessage.includes("type") ||
      normalizedMessage.includes("write")
    ) {
      return { text: this.knowledgeBase["text"] };
    }
    if (
      normalizedMessage.includes("help") ||
      normalizedMessage.includes("how") ||
      normalizedMessage.includes("what")
    ) {
      return {
        text: this.knowledgeBase["help"],
        suggestions: [
          "How to use webcam?",
          "How to convert audio?",
          "How to convert text?",
        ],
      };
    }
    if (
      normalizedMessage.includes("about") ||
      normalizedMessage.includes("slat")
    ) {
      return { text: this.knowledgeBase["about"] };
    }

    // Default response
    return {
      text: "I'm not sure about that. Here are some topics I can help you with:",
      suggestions: [
        "How to use webcam?",
        "How to convert audio?",
        "How to convert text?",
        "/help",
      ],
    };
  }
}

export const chatbotService = ChatbotService.getInstance();
export default chatbotService;
