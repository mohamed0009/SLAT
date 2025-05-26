import React, { useEffect, useState, useRef } from 'react';
import { Mic, Play, Pause, Volume2, VolumeX, Info, Loader2, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import textToSignService from '@/services/textToSign';
import Image from 'next/image';

export const AudioToSign: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [signSequence, setSignSequence] = useState<string[]>([]);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentSignImage, setCurrentSignImage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [listeningTime, setListeningTime] = useState(0);
  const [showListeningTip, setShowListeningTip] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>(0);
  const listeningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Wave animation for audio recording
  const waveformBars = 20;
  const [waveform, setWaveform] = useState<number[]>(Array(waveformBars).fill(10));
  
  useEffect(() => {
    if (isListening) {
      // Animate waveform when listening
      const animateWaveform = () => {
        setWaveform(prev => 
          prev.map(() => Math.floor(10 + Math.random() * 30))
        );
        animationRef.current = requestAnimationFrame(animateWaveform);
      };
      animationRef.current = requestAnimationFrame(animateWaveform);
    } else {
      // Stop animation when not listening
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setWaveform(Array(waveformBars).fill(10));
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  // Handle sign sequence playback
  useEffect(() => {
    if (isPlaying && signSequence.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSignIndex((prev) => {
          if (prev === signSequence.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // Change sign every second
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, signSequence]);

  // Update sign image when sign changes
  useEffect(() => {
    const updateSignImage = async () => {
      const currentSign = signSequence[currentSignIndex];
      if (currentSign) {
        const imagePath = await textToSignService.getSignImage(currentSign);
        setCurrentSignImage(imagePath);
        // Generate random confidence between 80 and 98 for demonstration
        setConfidence(80 + Math.floor(Math.random() * 18));
      } else {
        setCurrentSignImage(null);
        setConfidence(0);
      }
    };
    updateSignImage();
  }, [currentSignIndex, signSequence]);

  const handleStartListening = async () => {
    setError(null);
    setIsListening(true);
    setCurrentText('');
    setIsProcessing(true);
    setShowListeningTip(false);
    setListeningTime(0);
    
    // Start a timer to show listening duration
    if (listeningTimerRef.current) clearInterval(listeningTimerRef.current);
    listeningTimerRef.current = setInterval(() => {
      setListeningTime(prev => prev + 1);
    }, 1000);
    
    // Show tips after 5 seconds if no speech is detected
    if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
    tipTimerRef.current = setTimeout(() => {
      if (isListening && !currentText) {
        setShowListeningTip(true);
      }
    }, 5000);
    
    try {
      await textToSignService.startAudioRecognition(
        async (text) => {
          setCurrentText(text);
          setIsProcessing(false);
          setShowListeningTip(false); // Hide tip when speech is detected
          
          // Only process if we have meaningful text
          if (text.trim().length > 0) {
            const signs = await textToSignService.translateText(text);
            setSignSequence(signs);
            setCurrentSignIndex(0);
            setIsPlaying(true);
          }
        },
        (error) => {
          setError(error);
          setIsListening(false);
          setIsProcessing(false);
          
          // Clear timers
          if (listeningTimerRef.current) {
            clearInterval(listeningTimerRef.current);
            listeningTimerRef.current = null;
          }
          
          if (tipTimerRef.current) {
            clearTimeout(tipTimerRef.current);
            tipTimerRef.current = null;
          }
        }
      );
    } catch (error) {
      setIsProcessing(false);
      setIsListening(false);
      setError("An error occurred accessing the microphone. Please check your permissions.");
      
      // Clear timers
      if (listeningTimerRef.current) {
        clearInterval(listeningTimerRef.current);
        listeningTimerRef.current = null;
      }
      
      if (tipTimerRef.current) {
        clearTimeout(tipTimerRef.current);
        tipTimerRef.current = null;
      }
    }
  };

  const handleStopListening = () => {
    textToSignService.stopAudioRecognition();
    setIsListening(false);
    setShowListeningTip(false);
    
    // Clear timers
    if (listeningTimerRef.current) {
      clearInterval(listeningTimerRef.current);
      listeningTimerRef.current = null;
    }
    
    if (tipTimerRef.current) {
      clearTimeout(tipTimerRef.current);
      tipTimerRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (signSequence.length === 0) return;
    
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If at the end, restart from beginning
      if (currentSignIndex >= signSequence.length - 1) {
        setCurrentSignIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const simulatedListen = () => {
    setIsListening(true);
    setIsProcessing(true);
    setCurrentText('');
    
    // Simulate processing time
    setTimeout(() => {
      const phrases = [
        "Hello, how are you?",
        "I am learning sign language",
        "Thank you for your help",
        "Nice to meet you"
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCurrentText(randomPhrase);
      setIsProcessing(false);
      
      // Create a simulated sign sequence
      const words = randomPhrase.toLowerCase().replace(/[.,?!]/g, '').split(' ');
      setSignSequence(words);
      setCurrentSignIndex(0);
      setIsPlaying(true);
      setIsListening(false);
    }, 2000);
  };

  // Reset timers when component unmounts
  useEffect(() => {
    return () => {
      if (listeningTimerRef.current) clearInterval(listeningTimerRef.current);
      if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main recording button and status */}
      <div className="relative flex flex-col items-center mb-6">
        <Button
          onClick={isListening ? handleStopListening : handleStartListening}
          className={`
            w-20 h-20 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center
            ${isListening 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"}
          `}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </Button>
        
        <span className="mt-3 text-indigo-700 font-medium">
          {isListening ? (
            <>
              Listening... {listeningTime > 0 && `(${Math.floor(listeningTime / 60)}:${(listeningTime % 60).toString().padStart(2, '0')})`}
            </>
          ) : (
            isProcessing ? "Processing..." : "Click to Start"
          )}
        </span>
        
        {isListening && (
          <div className="absolute -bottom-8 flex items-end justify-center gap-[2px] h-8 w-full overflow-hidden">
            {waveform.map((height, index) => (
              <div 
                key={index}
                className="w-1 bg-gradient-to-t from-blue-800 to-blue-900 rounded-full transition-all duration-100"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Listening tips */}
      {showListeningTip && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 text-sm w-full">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">No speech detected yet</p>
              <ul className="text-xs space-y-1 list-disc pl-4">
                <li>Speak clearly into your microphone</li>
                <li>Make sure your microphone is working</li>
                <li>Try speaking a bit louder</li>
                <li>Check browser permissions for microphone access</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm w-full">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Recognized text */}
      {currentText && (
        <div className="w-full mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="text-xs text-indigo-600 mb-1">Recognized speech:</p>
          <p className="text-indigo-900 font-medium">{currentText}</p>
        </div>
      )}

      {/* Sign image display */}
      {currentSignImage && (
        <div className="w-full mb-4">
          <div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-indigo-800">
                Sign: <span className="text-indigo-600">{signSequence[currentSignIndex]}</span>
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-indigo-600 font-medium">{confidence}%</span>
                <div className="w-16 h-2 bg-indigo-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-800 to-blue-900 rounded-full"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div 
              key={currentSignIndex}
              className="relative w-full h-60 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden transition-opacity duration-300"
            >
              <Image
                src={currentSignImage}
                alt={`Sign for ${signSequence[currentSignIndex]}`}
                fill
                className="object-contain p-2"
              />
            </div>
            
            {/* Playback controls */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-indigo-600">
                  {currentSignIndex + 1}/{signSequence.length}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={handleMuteToggle}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="h-3 w-3 mr-1" />
                Info
              </Button>
            </div>
          </div>
          
          {/* Sign information popup */}
          {showInfo && (
            <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm">
              <p className="text-indigo-800 font-medium mb-1">About this sign</p>
              <p className="text-indigo-600 text-xs mb-2">
                The sign for "{signSequence[currentSignIndex]}" involves hand positioning and movement 
                that represents the concept in American Sign Language (ASL).
              </p>
              <div className="flex items-center gap-2 text-xs text-indigo-700">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Commonly used in everyday conversation</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Demo button for testing without microphone access */}
      {!isListening && !isProcessing && (
        <Button
          variant="outline"
          size="sm"
          onClick={simulatedListen}
          className="text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 mt-2"
        >
          Demo without microphone
        </Button>
      )}
    </div>
  );
};

export default AudioToSign; 