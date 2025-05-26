"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Printer } from 'lucide-react';

interface HandSignDiagram {
  letter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  keyPoints: string[];
  svgPath: string;
}

const handSignData: HandSignDiagram[] = [
  {
    letter: 'A',
    difficulty: 'easy',
    description: 'Make a fist with your thumb on the side',
    keyPoints: [
      'Close all fingers into a fist',
      'Thumb should be visible on the side',
      'Keep hand steady and well-lit'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="120" rx="35" ry="45" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb (visible on side) -->
        <ellipse cx="65" cy="110" rx="12" ry="20" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Closed fingers (fist) -->
        <rect x="85" y="85" width="30" height="35" rx="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Knuckles -->
        <circle cx="90" cy="90" r="3" fill="#e09891"/>
        <circle cx="100" cy="88" r="3" fill="#e09891"/>
        <circle cx="110" cy="90" r="3" fill="#e09891"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">A</text>
      </svg>
    `
  },
  {
    letter: 'B',
    difficulty: 'easy',
    description: 'Hold up 4 fingers straight, thumb folded across palm',
    keyPoints: [
      'All 4 fingers straight up',
      'Thumb folded across the palm',
      'Fingers should be close together'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="130" rx="25" ry="35" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Four fingers up -->
        <rect x="85" y="60" width="8" height="40" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <rect x="95" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <rect x="105" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <rect x="115" y="60" width="8" height="40" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb across palm -->
        <ellipse cx="85" cy="125" rx="8" ry="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">B</text>
      </svg>
    `
  },
  {
    letter: 'C',
    difficulty: 'easy',
    description: 'Curve your hand like holding a cup',
    keyPoints: [
      'Make a "C" shape with your hand',
      'Thumb and fingers curved, not touching',
      'Like holding a small cup or ball'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Curved palm -->
        <path d="M 70 80 Q 100 70 130 80 Q 135 120 130 140 Q 100 150 70 140 Q 65 120 70 80" 
              fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Curved fingers -->
        <path d="M 75 75 Q 85 65 95 75" fill="none" stroke="#e09891" stroke-width="3" stroke-linecap="round"/>
        <path d="M 85 70 Q 95 60 105 70" fill="none" stroke="#e09891" stroke-width="3" stroke-linecap="round"/>
        <path d="M 95 70 Q 105 60 115 70" fill="none" stroke="#e09891" stroke-width="3" stroke-linecap="round"/>
        <path d="M 105 75 Q 115 65 125 75" fill="none" stroke="#e09891" stroke-width="3" stroke-linecap="round"/>
        
        <!-- Thumb -->
        <ellipse cx="65" cy="100" rx="8" ry="18" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">C</text>
      </svg>
    `
  },
  {
    letter: 'D',
    difficulty: 'medium',
    description: 'Point index finger up, other fingers and thumb make a circle',
    keyPoints: [
      'Index finger straight up',
      'Thumb touches middle finger tip',
      'Ring and pinky fingers folded down',
      'Forms a "D" shape'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="130" rx="25" ry="30" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Index finger up -->
        <rect x="96" y="50" width="8" height="50" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb and middle finger circle -->
        <ellipse cx="85" cy="115" rx="8" ry="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="105" cy="110" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Connection line showing circle -->
        <path d="M 85 105 Q 95 100 105 105" fill="none" stroke="#1e40af" stroke-width="2" stroke-dasharray="3,3"/>
        
        <!-- Folded fingers -->
        <ellipse cx="115" cy="120" rx="6" ry="10" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="122" cy="125" rx="5" ry="8" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">D</text>
      </svg>
    `
  },
  {
    letter: 'F',
    difficulty: 'medium',
    description: 'Touch thumb to index finger, other 3 fingers up',
    keyPoints: [
      'Make "OK" sign but with 3 fingers up',
      'Thumb and index finger touch at tips',
      'Middle, ring, and pinky fingers straight up',
      'Clear circle between thumb and index'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="130" rx="25" ry="30" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Three fingers up -->
        <rect x="95" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <rect x="105" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <rect x="115" y="60" width="8" height="40" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb and index finger circle -->
        <ellipse cx="80" cy="110" rx="8" ry="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="88" cy="95" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Circle indicator -->
        <circle cx="84" cy="102" r="8" fill="none" stroke="#1e40af" stroke-width="2" stroke-dasharray="3,3"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">F</text>
      </svg>
    `
  },
  {
    letter: 'L',
    difficulty: 'easy',
    description: 'Index finger up, thumb out to side (like an "L")',
    keyPoints: [
      'Index finger pointing straight up',
      'Thumb pointing to the side',
      'Other fingers folded down',
      'Makes a clear "L" shape'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="120" rx="25" ry="35" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Index finger up -->
        <rect x="96" y="50" width="8" height="50" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb out to side -->
        <rect x="65" y="116" width="25" height="8" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Folded fingers -->
        <ellipse cx="110" cy="105" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="118" cy="108" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="125" cy="112" rx="5" ry="10" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- L-shape indicator -->
        <path d="M 100 45 L 100 125 L 125 125" fill="none" stroke="#1e40af" stroke-width="2" stroke-dasharray="5,5"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">L</text>
      </svg>
    `
  },
  {
    letter: 'O',
    difficulty: 'easy',
    description: 'Make a circle with all fingers and thumb',
    keyPoints: [
      'All fingertips touch thumb tip',
      'Forms a circular/oval shape',
      'Keep the circle shape clear and visible'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Circle formed by fingers -->
        <circle cx="100" cy="100" r="35" fill="none" stroke="#fdbcb4" stroke-width="15"/>
        
        <!-- Fingertips -->
        <circle cx="100" cy="65" r="4" fill="#e09891"/>
        <circle cx="125" cy="80" r="4" fill="#e09891"/>
        <circle cx="135" cy="100" r="4" fill="#e09891"/>
        <circle cx="125" cy="120" r="4" fill="#e09891"/>
        <circle cx="100" cy="135" r="4" fill="#e09891"/>
        <circle cx="75" cy="120" r="4" fill="#e09891"/>
        <circle cx="65" cy="100" r="4" fill="#e09891"/>
        <circle cx="75" cy="80" r="4" fill="#e09891"/>
        
        <!-- Center circle to show the "O" -->
        <circle cx="100" cy="100" r="20" fill="none" stroke="#1e40af" stroke-width="2" stroke-dasharray="3,3"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">O</text>
      </svg>
    `
  },
  {
    letter: 'R',
    difficulty: 'medium',
    description: 'Index and middle fingers crossed',
    keyPoints: [
      'Index finger straight up',
      'Middle finger crosses over index',
      'Ring and pinky folded down',
      'Thumb folded across palm'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="130" rx="25" ry="30" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Index finger up -->
        <rect x="96" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Middle finger crossed over -->
        <rect x="102" y="60" width="8" height="40" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2" transform="rotate(15 106 80)"/>
        
        <!-- Crossing indicator -->
        <path d="M 100 70 L 110 75" stroke="#1e40af" stroke-width="3" stroke-linecap="round"/>
        
        <!-- Folded fingers -->
        <ellipse cx="115" cy="115" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="122" cy="120" rx="5" ry="10" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb across palm -->
        <ellipse cx="85" cy="125" rx="8" ry="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">R</text>
      </svg>
    `
  },
  {
    letter: 'U',
    difficulty: 'medium',
    description: 'Index and middle fingers up together',
    keyPoints: [
      'Index and middle fingers straight up',
      'Fingers should be close together',
      'Ring and pinky folded down',
      'Thumb folded across palm'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="130" rx="25" ry="30" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Two fingers up together -->
        <rect x="94" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <rect x="104" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Connection line showing they're together -->
        <path d="M 98 60 L 108 60" stroke="#1e40af" stroke-width="2"/>
        
        <!-- Folded fingers -->
        <ellipse cx="115" cy="115" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="122" cy="120" rx="5" ry="10" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb across palm -->
        <ellipse cx="85" cy="125" rx="8" ry="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">U</text>
      </svg>
    `
  },
  {
    letter: 'V',
    difficulty: 'easy',
    description: 'Index and middle fingers up in "V" shape (peace sign)',
    keyPoints: [
      'Index and middle fingers up',
      'Fingers separated in "V" shape',
      'Ring and pinky folded down',
      'Like peace sign or victory sign'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="130" rx="25" ry="30" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Two fingers in V shape -->
        <rect x="90" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2" transform="rotate(-10 94 77)"/>
        <rect x="108" y="55" width="8" height="45" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2" transform="rotate(10 112 77)"/>
        
        <!-- V-shape indicator -->
        <path d="M 94 60 L 100 80 L 112 60" fill="none" stroke="#1e40af" stroke-width="2" stroke-dasharray="3,3"/>
        
        <!-- Folded fingers -->
        <ellipse cx="118" cy="115" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="125" cy="120" rx="5" ry="10" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb across palm -->
        <ellipse cx="85" cy="125" rx="8" ry="15" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">V</text>
      </svg>
    `
  },
  {
    letter: 'Y',
    difficulty: 'easy',
    description: 'Thumb and pinky out, other fingers folded',
    keyPoints: [
      'Thumb pointing up',
      'Pinky finger extended out',
      'Index, middle, and ring fingers folded down',
      'Like "rock on" or "hang loose" gesture'
    ],
    svgPath: `
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <!-- Palm -->
        <ellipse cx="100" cy="120" rx="25" ry="35" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Thumb up -->
        <rect x="75" y="80" width="8" height="25" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Pinky out -->
        <rect x="125" y="95" width="8" height="30" rx="4" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Folded fingers -->
        <ellipse cx="95" cy="105" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="105" cy="100" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        <ellipse cx="115" cy="105" rx="6" ry="12" fill="#fdbcb4" stroke="#e09891" stroke-width="2"/>
        
        <!-- Label -->
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#1e40af">Y</text>
      </svg>
    `
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDifficultyStars = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '⭐';
    case 'medium': return '⭐⭐';
    case 'hard': return '⭐⭐⭐';
    default: return '⭐';
  }
};

export const ASLVisualGuide: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string>('A');
  const [showAll, setShowAll] = useState(false);

  const currentSign = handSignData.find(sign => sign.letter === selectedSign) || handSignData[0];
  const displaySigns = showAll ? handSignData : handSignData.slice(0, 6);

  // Function to download SVG as image
  const downloadSignImage = (sign: HandSignDiagram) => {
    const svgData = sign.svgPath;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `ASL-Letter-${sign.letter}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Function to print the current sign
  const printSign = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ASL Letter ${currentSign.letter}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .sign-container { max-width: 400px; margin: 0 auto; }
              .instructions { text-align: left; margin-top: 20px; }
              .key-points { margin-top: 10px; }
              .key-points li { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="sign-container">
              <h1>ASL Letter ${currentSign.letter}</h1>
              <div>${currentSign.svgPath}</div>
              <div class="instructions">
                <h3>How to make this sign:</h3>
                <p><strong>${currentSign.description}</strong></p>
                <h4>Key Points:</h4>
                <ul class="key-points">
                  ${currentSign.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          🤟 ASL Hand Signs Visual Guide
        </h1>
        <p className="text-lg text-gray-600">
          Learn how to make ASL alphabet signs with visual diagrams
        </p>
      </div>

      {/* Letter Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Letter to Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-11 gap-2 mb-4">
            {handSignData.map((sign) => (
              <Button
                key={sign.letter}
                variant={selectedSign === sign.letter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSign(sign.letter)}
                className="aspect-square"
              >
                {sign.letter}
              </Button>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="text-sm"
            >
              {showAll ? 'Show Basic Signs Only' : 'Show All Available Letters'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Sign Detail */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Letter {currentSign.letter}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(currentSign.difficulty)}>
                {getDifficultyStars(currentSign.difficulty)} {currentSign.difficulty}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadSignImage(currentSign)}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={printSign}
                className="flex items-center gap-1"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Visual Diagram */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Visual Diagram</h3>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-100">
                <div 
                  className="w-full h-64 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: currentSign.svgPath }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How to Make This Sign</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium mb-3">
                  {currentSign.description}
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Key Points:</h4>
                <ul className="space-y-2">
                  {currentSign.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practice Tips */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Practice Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Hold the sign steady for 2-3 seconds</li>
                  <li>• Keep your hand well-lit and visible</li>
                  <li>• Practice in front of a mirror first</li>
                  <li>• Use the camera to test your sign</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference - {showAll ? 'All Letters' : 'Beginner Signs'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displaySigns.map((sign) => (
              <div
                key={sign.letter}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSign === sign.letter
                    ? 'border-blue-800 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSign(sign.letter)}
              >
                <div 
                  className="w-full h-20 mb-2"
                  dangerouslySetInnerHTML={{ __html: sign.svgPath }}
                />
                <div className="text-center">
                  <div className="font-bold text-lg">{sign.letter}</div>
                  <div className="text-xs text-gray-500">
                    {getDifficultyStars(sign.difficulty)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate All Images Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">📥 Download All Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-blue-700">
              <p className="font-medium">Download individual signs or create a complete reference sheet</p>
              <p className="text-sm">Perfect for printing and offline practice</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  handSignData.forEach(sign => {
                    setTimeout(() => downloadSignImage(sign), 100);
                  });
                }}
                className="bg-blue-800 hover:bg-blue-900"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All SVGs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">🎯 General Tips for Better Detection</CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">📍 Hand Positioning:</h4>
              <ul className="text-sm space-y-1">
                <li>• Keep hand 1-2 feet from camera</li>
                <li>• Center your hand in the frame</li>
                <li>• Face palm toward the camera</li>
                <li>• Hold signs steady for 2-3 seconds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💡 Lighting & Environment:</h4>
              <ul className="text-sm space-y-1">
                <li>• Use good, even lighting</li>
                <li>• Avoid shadows on your hand</li>
                <li>• Use a plain, contrasting background</li>
                <li>• Face toward a light source</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 