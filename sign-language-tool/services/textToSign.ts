/**
 * Text to Sign Language Translation Service
 * 
 * This service provides functionality to:
 * 1. Convert speech to text using the Web Speech API
 * 2. Translate text to sign language
 * 3. Get sign language images for words
 */

// Type declarations for the Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    item(index: number): { item(index: number): { transcript: string } };
    [index: number]: { [index: number]: { transcript: string } };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Speech recognition instance
let recognition: SpeechRecognition | null = null;
let isInitialized = false;
let isManualStopped = false;

// Service to handle text to sign language conversion
const textToSignService = {
  /**
   * Initialize the service
   * This was used in the previous implementation and is needed by TextToSign component
   */
  initialize: async (): Promise<void> => {
    if (isInitialized) return;
    
    try {
      // Initialize any required resources
      // For example, we could pre-cache sign language images or set up other resources
      console.log('Text to Sign service initialized');
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Text to Sign service:', error);
      throw error;
    }
  },
  
  /**
   * Start speech recognition
   * @param onResult - Callback for when speech is recognized
   * @param onError - Callback for when an error occurs
   */
  startAudioRecognition: async (
    onResult: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        onError('Speech recognition is not supported in this browser');
        return;
      }

      // Don't create a new recognition instance if one already exists
      if (recognition) {
        onError('Speech recognition is already running');
        return;
      }
      
      // Reset manual stop flag when starting a new recognition session
      isManualStopped = false;

      // Create speech recognition instance
      const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognitionImpl();
      
      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Set up event handlers
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from({ length: event.results.length }, (_, i) => {
          return event.results[i][0].transcript;
        }).join(' ');
        
        onResult(transcript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Handle "no-speech" as a non-critical error
        if (event.error === 'no-speech') {
          // Don't report this as an error to the user since it's expected behavior
          console.log('No speech detected, continuing to listen...');
          
          // Don't reset recognition for this specific error
          return;
        }
        
        // For all other errors, report to the user and reset
        onError(`Error occurred in recognition: ${event.error}`);
        // Reset recognition on other errors
        recognition = null;
      };
      
      recognition.onend = () => {
        // Only restart if not manually stopped and recognition reference still exists
        if (recognition && !isManualStopped) {
          try {
            // Small timeout to ensure the previous session is fully terminated
            setTimeout(() => {
              if (recognition && !isManualStopped) {
                recognition.start();
              }
            }, 100);
          } catch (error) {
            console.error('Failed to restart speech recognition:', error);
            recognition = null;
          }
        } else {
          // Clean up if manually stopped
          recognition = null;
        }
      };
      
      // Start listening
      recognition.start();
    } catch (error) {
      onError(`Failed to start speech recognition: ${error}`);
      recognition = null;
    }
  },
  
  /**
   * Stop speech recognition
   */
  stopAudioRecognition: () => {
    if (recognition) {
      // Set flag to prevent auto-restart in onend handler
      isManualStopped = true;
      
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      
      // Reset recognition variable after stopping
      recognition = null;
    }
  },
  
  /**
   * Translate text to sign language
   * @param text - Text to translate
   * @returns Array of sign language words
   */
  translateText: async (text: string): Promise<string[]> => {
    // In a real app, this would call an API to translate text
    // For now, we'll just split the text into words and filter out non-words
    return text
      .toLowerCase()
      .replace(/[.,?!;]/g, '')
      .split(' ')
      .filter(word => word.length > 0);
  },
  
  /**
   * Get sign language image for a word
   * @param word - Word to get sign for
   * @returns URL of sign language image
   */
  getSignImage: async (word: string): Promise<string> => {
    // First, check if we have an actual ASL hand sign for single letters or numbers
    const character = word.toLowerCase().trim();
    
    // Complete list of ASL alphabet letters
    const completeASLAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    
    // Complete list of ASL numbers
    const completeASLNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    // Currently available custom SVG signs (letters only)
    const availableCustomSigns = ['a', 'b', 'c', 'd', 'f', 'l', 'o', 'r', 'u', 'v', 'y'];
    
    // Check if it's a single character (letter or number)
    const isLetter = character.length === 1 && completeASLAlphabet.includes(character);
    const isNumber = character.length === 1 && completeASLNumbers.includes(character);
    
    // If it's a single letter or number, try different image sources in order of preference
    if (isLetter || isNumber) {
      try {
        // Option 1: Try 3D ASL images (letters and numbers)
        // These are stored in /images/asl-signs/ directory
        const iconscout3DPath = `/images/asl-signs/asl-${character}-3d.png`;
        
        // Check if 3D image exists
        const has3DImage = true; // Set to true when you have the 3D images
        
        if (has3DImage) {
          return iconscout3DPath;
        }
        
        // Option 2: Try our custom SVG signs (letters only, no numbers yet)
        if (isLetter && availableCustomSigns.includes(character)) {
          return `/images/asl-signs/asl-${character}.svg`;
        }
        
        // Option 3: Generate enhanced text representation for characters not yet available
        console.info(`ASL sign for ${isNumber ? 'number' : 'letter'} ${character.toUpperCase()} not yet available, using text representation`);
        
      } catch (error) {
        console.warn(`Failed to load ASL sign for ${character}, falling back to text image`);
      }
    }
    
    // For words or characters we don't have ASL signs for, create a text-based image
    // Generate a color based on the word
    const colors = [
      { bg: '#1e40af', text: '#ffffff' }, // blue
      { bg: '#1e3a8a', text: '#ffffff' }, // dark blue
      { bg: '#1e40af', text: '#ffffff' }, // blue
      { bg: '#d946ef', text: '#ffffff' }, // fuchsia
      { bg: '#ec4899', text: '#ffffff' }, // pink
      { bg: '#f43f5e', text: '#ffffff' }  // rose
    ];
    
    // Determine color based on the first character of the word
    const index = Math.abs(word.charCodeAt(0) % colors.length);
    const color = colors[index];
    
    // Determine what type of character this is
    const isLetterChar = character.length === 1 && completeASLAlphabet.includes(character);
    const isNumberChar = character.length === 1 && completeASLNumbers.includes(character);
    const characterType = isNumberChar ? 'Number' : isLetterChar ? 'Letter' : 'Word';
    
    // Enhanced text representation with better styling
    const svgImage = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <!-- Background with gradient -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color.bg}dd;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#bgGradient)" />
        
        <!-- Main text -->
        <text x="200" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold"
              fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
          ${word.toUpperCase()}
        </text>
        
        <!-- Type indicator -->
        <text x="200" y="240" font-family="Arial, sans-serif" font-size="16" 
              fill="${color.text}" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
          ${characterType}
        </text>
        
        <!-- Status indicator -->
        <text x="200" y="320" font-family="Arial, sans-serif" font-size="12" 
              fill="${color.text}" text-anchor="middle" dominant-baseline="middle" opacity="0.6">
          ${(isLetterChar || isNumberChar) ? 'ASL sign coming soon' : 'Text representation'}
        </text>
        
        <!-- 3D signs attribution -->
        ${(isLetterChar || isNumberChar) ? `
        <text x="200" y="380" font-family="Arial, sans-serif" font-size="10" 
              fill="${color.text}" text-anchor="middle" dominant-baseline="middle" opacity="0.4">
          3D ASL signs available
        </text>` : ''}
      </svg>
    `;
    
    // Convert SVG to a base64 data URL
    const dataUrl = `data:image/svg+xml;base64,${btoa(svgImage.trim())}`;
    return dataUrl;
  }
};

export default textToSignService;
export { textToSignService };
