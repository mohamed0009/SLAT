'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  HandMetal, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Languages, 
  User, 
  Info, 
  Loader2, 
  Globe, 
  History, 
  BookOpen, 
  Settings,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import textToSignService from '@/services/textToSign';
import Image from 'next/image';

interface TextToSignProps {
  onTranslate?: (text: string) => void;
}

export const TextToSign = ({ onTranslate }: TextToSignProps) => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [translatedText, setTranslatedText] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [signImages, setSignImages] = useState<Record<string, string>>({});
  const [currentSignImage, setCurrentSignImage] = useState<string>('');
  const [recentTranslations, setRecentTranslations] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [fullScreenView, setFullScreenView] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize the service
  useEffect(() => {
    const initService = async () => {
      try {
        await textToSignService.initialize();
        
        // Load recent translations from localStorage if available
        const savedTranslations = localStorage.getItem('recentTextTranslations');
        if (savedTranslations) {
          try {
            setRecentTranslations(JSON.parse(savedTranslations).slice(0, 5));
          } catch (e) {
            console.error('Failed to parse saved translations', e);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Text to Sign service:', error);
      }
    };

    initService();
    
    // Clean up on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update current sign image when currentIndex changes
  useEffect(() => {
    const updateSignImage = async () => {
      if (translatedText.length > 0 && currentIndex < translatedText.length) {
        const letter = translatedText[currentIndex];
        const imageUrl = await textToSignService.getSignImage(letter);
        setCurrentSignImage(imageUrl);
      }
    };

    updateSignImage();
  }, [currentIndex, translatedText]);

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  // Handle speed change
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  // Save recent translation to localStorage
  const saveRecentTranslation = (translationText: string) => {
    // Only save if not already in the list
    if (!recentTranslations.includes(translationText)) {
      const newTranslations = [translationText, ...recentTranslations].slice(0, 5);
      setRecentTranslations(newTranslations);
      try {
        localStorage.setItem('recentTextTranslations', JSON.stringify(newTranslations));
      } catch (e) {
        console.error('Failed to save translations to localStorage', e);
      }
    }
  };

  // Handle translate button click
  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      // Use the service to translate text
      const words = await textToSignService.translateText(text);
      setTranslatedText(words);
      setCurrentIndex(0);
      setIsPlaying(autoAdvance);
      
      // Save to recent translations
      saveRecentTranslation(text);
      
      // Call the onTranslate callback if provided
      if (onTranslate) {
        onTranslate(text);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle previous word
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle next word
  const handleNext = () => {
    if (currentIndex < translatedText.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Use a recent translation
  const useRecentTranslation = (savedText: string) => {
    setText(savedText);
    
    // Focus on input and add a small timeout to ensure UI updates first
    if (inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => {
        handleTranslate();
      }, 100);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isPlaying && translatedText.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex < translatedText.length - 1) {
            return prevIndex + 1;
          } else {
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, 1000 / speed);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, translatedText.length, speed]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (translatedText.length === 0) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          // Prevent space from triggering button clicks
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [translatedText.length, currentIndex]);

  // UI rendering based on component state
  const renderSignDisplay = () => {
    if (translatedText.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <div className="bg-indigo-100 p-4 rounded-full mb-3">
            <User className="h-10 w-10 text-indigo-500" />
          </div>
          <p className="text-indigo-700 font-medium">Ready to translate</p>
          <p className="text-indigo-500 text-sm mt-1 max-w-xs">
            Enter text in the field below and click Translate to see it in sign language
          </p>
        </div>
      );
    }

    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        {/* Current word indicator */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">
            {currentIndex + 1} of {translatedText.length}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-3 w-3 mr-1" />
            Info
          </Button>
        </div>
        
        {/* Current word */}
        <div className="mb-4 text-center">
          <div className="text-4xl font-bold text-indigo-800">
            {translatedText[currentIndex]}
          </div>
          <div className="text-xs text-indigo-500 mt-1">
            {currentIndex > 0 && (
              <span className="mr-2 opacity-50">{translatedText[currentIndex - 1]}</span>
            )}
            <span className="font-bold underline">{translatedText[currentIndex]}</span>
            {currentIndex < translatedText.length - 1 && (
              <span className="ml-2 opacity-50">{translatedText[currentIndex + 1]}</span>
            )}
          </div>
        </div>
        
        {/* Sign image */}
        <div className="relative w-full max-w-xs h-36 sm:h-48 md:h-60 mb-2">
          {currentSignImage && (
            <Image
              src={currentSignImage}
              alt={`Sign for ${translatedText[currentIndex]}`}
              fill
              className="object-contain p-1"
              priority
            />
          )}
        </div>
        
        {/* Playback controls */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={handleNext}
            disabled={currentIndex === translatedText.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Info panel */}
        {showInfo && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm w-full">
            <p className="text-indigo-800 font-medium mb-1">About this sign</p>
            <p className="text-indigo-600 text-xs mb-2">
              The sign for "{translatedText[currentIndex]}" involves hand positioning and movement 
              that represents the concept in American Sign Language (ASL).
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-700">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Use keyboard arrows to navigate between signs</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow w-full max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3 text-white">
        <Languages className="h-5 w-5" />
        <h2 className="text-lg font-medium">Text to Sign Language</h2>
      </div>

      <div className="p-4">
        {/* Main display area */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center h-[280px] sm:h-[320px] md:h-[350px] relative overflow-hidden shadow-sm border border-indigo-100">
          {renderSignDisplay()}
        </div>

        <div className="mt-4 space-y-4">
          {/* Input and translate button */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text to translate to sign language..."
              className="flex-1 h-10 sm:h-12 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTranslate();
                }
              }}
            />
            <button 
              type="button"
              className="sm:w-auto w-full h-10 sm:h-12 px-3 sm:px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md flex items-center justify-center"
              onClick={handleTranslate}
              disabled={isLoading || !text.trim()}
              title="Translate"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Globe className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Speed control */}
          <div className="bg-indigo-50 rounded-lg p-2 sm:p-3 border border-indigo-100">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-medium text-indigo-900">Playback Settings</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <label className="text-sm text-indigo-700 whitespace-nowrap">Speed:</label>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-indigo-500">Slow</span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={speed} 
                  onChange={handleSpeedChange} 
                  className="flex-1 accent-indigo-600" 
                />
                <span className="text-xs text-indigo-500">Fast</span>
                <span className="text-sm font-medium text-indigo-700 ml-1 min-w-[30px]">{speed}x</span>
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <label className="text-sm text-indigo-700 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={() => setAutoAdvance(!autoAdvance)}
                  className="accent-indigo-600"
                />
                Auto-advance after translation
              </label>
            </div>
          </div>

          {/* Recent translations */}
          {recentTranslations.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-medium text-indigo-900">Recent Translations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentTranslations.map((recent, index) => (
                  <Button 
                    key={index} 
                    variant="outline"
                    size="sm"
                    className="text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => useRecentTranslation(recent)}
                  >
                    {recent.length > 20 ? recent.substring(0, 20) + '...' : recent}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard shortcuts tip */}
          <div className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Tip: Use arrow keys ←→ to navigate and space to play/pause</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TextToSign; 