const fs = require('fs');
const path = require('path');

// Hand sign data with SVG paths
const handSignData = [
  {
    letter: 'A',
    description: 'Make a fist with your thumb on the side',
    svgContent: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
    description: 'Hold up 4 fingers straight, thumb folded across palm',
    svgContent: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
    description: 'Curve your hand like holding a cup',
    svgContent: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
    letter: 'L',
    description: 'Index finger up, thumb out to side (like an "L")',
    svgContent: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
    description: 'Make a circle with all fingers and thumb',
    svgContent: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
    letter: 'Y',
    description: 'Thumb and pinky out, other fingers folded',
    svgContent: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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

// Create output directory
const outputDir = path.join(__dirname, '../public/images/asl-signs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVG files
handSignData.forEach(sign => {
  const fileName = `asl-${sign.letter.toLowerCase()}.svg`;
  const filePath = path.join(outputDir, fileName);
  
  // Create a complete SVG with proper header and styling
  const completeSvg = `<?xml version="1.0" encoding="UTF-8"?>
${sign.svgContent.trim()}`;

  fs.writeFileSync(filePath, completeSvg);
  console.log(`✅ Generated ${fileName}`);
});

// Generate a combined reference sheet
const referenceSheetSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="600" height="400" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="300" y="30" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#1e293b">ASL Hand Signs - Quick Reference</text>
  
  <!-- Grid of signs (3x2) -->
  ${handSignData.map((sign, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 50 + col * 180;
    const y = 60 + row * 160;
    
    return `
    <!-- ${sign.letter} -->
    <g transform="translate(${x}, ${y})">
      <rect width="160" height="140" fill="white" stroke="#e2e8f0" stroke-width="1" rx="8"/>
      <g transform="translate(80, 70) scale(0.6)">
        ${sign.svgContent.replace(/<svg[^>]*>|<\/svg>/g, '').replace(/xmlns="[^"]*"/g, '')}
      </g>
      <text x="80" y="130" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">${sign.description}</text>
    </g>`;
  }).join('')}
  
  <!-- Footer -->
  <text x="300" y="380" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">Practice these signs for better detection accuracy</text>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'asl-reference-sheet.svg'), referenceSheetSvg);
console.log('✅ Generated reference sheet: asl-reference-sheet.svg');

// Generate a simple HTML viewer
const htmlViewer = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASL Hand Signs Visual Guide</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .signs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .sign-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .sign-image {
            width: 200px;
            height: 200px;
            margin: 0 auto 15px;
        }
        .sign-letter {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .sign-description {
            color: #64748b;
            font-size: 14px;
        }
        .reference-sheet {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .download-btn {
            display: inline-block;
            background: #1e40af;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            margin: 5px;
        }
        .download-btn:hover {
            background: #1e40af;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤟 ASL Hand Signs Visual Guide</h1>
        <p>Learn how to make ASL alphabet signs with visual diagrams</p>
    </div>

    <div class="signs-grid">
        ${handSignData.map(sign => `
        <div class="sign-card">
            <div class="sign-image">
                <img src="asl-${sign.letter.toLowerCase()}.svg" alt="ASL Letter ${sign.letter}" style="width: 100%; height: 100%;">
            </div>
            <div class="sign-letter">Letter ${sign.letter}</div>
            <div class="sign-description">${sign.description}</div>
            <a href="asl-${sign.letter.toLowerCase()}.svg" download class="download-btn">Download SVG</a>
        </div>
        `).join('')}
    </div>

    <div class="reference-sheet">
        <h2>📋 Complete Reference Sheet</h2>
        <p>Download the complete reference sheet for printing and offline practice</p>
        <img src="asl-reference-sheet.svg" alt="ASL Reference Sheet" style="max-width: 100%; height: auto; margin: 20px 0;">
        <br>
        <a href="asl-reference-sheet.svg" download class="download-btn">Download Reference Sheet</a>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #64748b;">
        <p>💡 <strong>Tips for better detection:</strong></p>
        <p>• Keep your hand well-lit and centered in the camera frame</p>
        <p>• Hold signs steady for 2-3 seconds</p>
        <p>• Practice in front of a mirror first</p>
        <p>• Use a plain background for better contrast</p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), htmlViewer);
console.log('✅ Generated HTML viewer: index.html');

console.log('\n🎉 All ASL hand sign images generated successfully!');
console.log(`📁 Files saved to: ${outputDir}`);
console.log('\n📋 Generated files:');
handSignData.forEach(sign => {
  console.log(`   • asl-${sign.letter.toLowerCase()}.svg`);
});
console.log('   • asl-reference-sheet.svg');
console.log('   • index.html (viewer)');
console.log('\n💡 Open index.html in your browser to view all signs!'); 