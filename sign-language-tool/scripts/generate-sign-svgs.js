const fs = require('fs');
const path = require('path');

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const outputDir = path.join(__dirname, '../public/images/signs');

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVG for each letter
letters.forEach(letter => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f3f4f6" />
  <text x="50" y="50" font-family="Arial" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="#4f46e5">${letter}</text>
</svg>`;

  fs.writeFileSync(path.join(outputDir, `${letter.toLowerCase()}.svg`), svgContent);
  console.log(`Generated SVG for letter ${letter}`);
});

console.log('All SVGs generated successfully!'); 