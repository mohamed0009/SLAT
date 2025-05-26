/**
 * Text to Sign Language Translation Module
 * Handles the translation of text input to sign language animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const textInput = document.getElementById('textToTranslate');
  const translateButton = document.getElementById('translateButton');
  const avatarDisplay = document.getElementById('avatarDisplay');
  const avatarPlaceholder = document.querySelector('.avatar-placeholder');
  const speedSlider = document.getElementById('translationSpeed');
  const speedValue = document.querySelector('.slider-value');
  const historyList = document.getElementById('translationHistoryList');
  const statusText = document.querySelector('.avatar-status');
  const themeToggleButton = document.querySelector('.footer-theme-toggle');

  // Translation history storage
  let translationHistory = [];
  
  // Initialize the module
  function init() {
    // Event listeners
    translateButton.addEventListener('click', handleTranslate);
    textInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleTranslate();
      }
    });
    
    speedSlider.addEventListener('input', function() {
      speedValue.textContent = `${this.value}x`;
      updateAvatarSpeed(this.value);
    });
    
    // Load translation history from localStorage if available
    loadTranslationHistory();
  }
  
  // Handle translation request
  function handleTranslate() {
    const text = textInput.value.trim();
    
    if (!text) {
      setStatus('Please enter text to translate', 'warning');
      return;
    }
    
    setStatus('Translating...', 'processing');
    
    // Simulate API call to translation service
    // In production, this would be a real API call to a translation service
    setTimeout(() => {
      displayAvatar(text);
      
      // Add to history
      addToHistory(text);
      
      // Clear input
      textInput.value = '';
    }, 1000);
  }
  
  // Display avatar with animations for the translated text
  function displayAvatar(text) {
    // Here you would normally load the appropriate animations from a sign language API
    // For now, we'll just simulate the avatar display
    
    avatarPlaceholder.style.display = 'none';
    avatarDisplay.classList.add('active');
    
    // Create a simulated avatar element with enhanced hand structure for better sign language visualization
    avatarDisplay.innerHTML = `
      <div class="simulated-avatar">
        <div class="avatar-head"></div>
        <div class="avatar-body"></div>
        <div class="avatar-arms">
          <div class="avatar-arm left">
            <div class="avatar-hand left">
              <div class="avatar-palm left"></div>
              <div class="avatar-finger thumb left"></div>
              <div class="avatar-finger index left"></div>
              <div class="avatar-finger middle left"></div>
              <div class="avatar-finger ring left"></div>
              <div class="avatar-finger pinky left"></div>
              <div class="avatar-wrist left"></div>
            </div>
          </div>
          <div class="avatar-arm right">
            <div class="avatar-hand right">
              <div class="avatar-palm right"></div>
              <div class="avatar-finger thumb right"></div>
              <div class="avatar-finger index right"></div>
              <div class="avatar-finger middle right"></div>
              <div class="avatar-finger ring right"></div>
              <div class="avatar-finger pinky right"></div>
              <div class="avatar-wrist right"></div>
            </div>
          </div>
        </div>
        <div class="current-word">${text.split(' ')[0]}</div>
        <div class="sign-description">Showing sign language interpretation</div>
      </div>
    `;
    
    // Update colors based on theme
    updateAvatarColors();
    
    // Add additional styling for improved hand visualization
    enhanceAvatarStyling();
    
    // Simulate sign language animation sequence
    animateAvatar(text);
  }
  
  // Update avatar colors based on theme
  function updateAvatarColors() {
    const avatarElement = document.querySelector('.simulated-avatar');
    if (!avatarElement) return;
    
    const head = avatarElement.querySelector('.avatar-head');
    const body = avatarElement.querySelector('.avatar-body');
    const arms = avatarElement.querySelectorAll('.avatar-arm');
    const hands = avatarElement.querySelectorAll('.avatar-hand');
    const fingers = avatarElement.querySelectorAll('.avatar-finger');
    const palms = avatarElement.querySelectorAll('.avatar-palm');
    const wrists = avatarElement.querySelectorAll('.avatar-wrist');
    const currentWord = avatarElement.querySelector('.current-word');
    const signDescription = avatarElement.querySelector('.sign-description');
    
    // Default light mode colors
    const lightColor = '#1e40af';
    const darkColor = '#1e3a8a';
    const accentColor = '#3b82f6';
    
    head.style.background = `linear-gradient(135deg, ${lightColor}, ${darkColor})`;
    body.style.background = `linear-gradient(to bottom, ${lightColor}, ${darkColor})`;
    
    arms.forEach(arm => {
      arm.style.background = `linear-gradient(to bottom, ${lightColor}, ${darkColor})`;
    });
    
    hands.forEach(hand => {
      hand.style.background = `linear-gradient(to bottom, ${darkColor}, ${accentColor})`;
      hand.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    });
    
    fingers.forEach(finger => {
      finger.style.background = `linear-gradient(to bottom, ${darkColor}, ${accentColor})`;
      finger.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)';
    });
    
    palms.forEach(palm => {
      palm.style.background = `linear-gradient(to bottom, ${darkColor}, ${accentColor})`;
    });
    
    wrists.forEach(wrist => {
      wrist.style.background = `linear-gradient(to bottom, ${darkColor}, ${accentColor})`;
    });
    
    currentWord.style.background = 'rgba(255, 255, 255, 0.8)';
    currentWord.style.color = 'var(--primary-color)';
    currentWord.style.boxShadow = 'var(--shadow-sm)';
    
    if (signDescription) {
      signDescription.style.color = 'var(--text-secondary)';
    }
  }
  
  // Animate the avatar to show sign language gestures
  function animateAvatar(text) {
    const words = text.split(' ');
    const currentWordElement = document.querySelector('.current-word');
    const avatarArms = document.querySelectorAll('.avatar-arm');
    const leftHand = document.querySelector('.avatar-hand.left');
    const rightHand = document.querySelector('.avatar-hand.right');
    const leftFingers = document.querySelectorAll('.avatar-hand.left .avatar-finger');
    const rightFingers = document.querySelectorAll('.avatar-hand.right .avatar-finger');
    let currentIndex = 0;
    
    setStatus('Signing: ' + text, 'active');
    
    // Simulate animation for each word
    const interval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(interval);
        setStatus('Translation complete', 'success');
        
        // Reset after 3 seconds
        setTimeout(() => {
          resetAvatar();
        }, 3000);
        return;
      }
      
      // Update current word display
      const currentWord = words[currentIndex].toLowerCase();
      currentWordElement.textContent = words[currentIndex];
      
      // Apply specific hand sign animation based on word or first letter
      applyHandSign(currentWord, leftHand, rightHand, leftFingers, rightFingers);
      
      // Animate arms with more natural movements
      animateArms(avatarArms, currentWord);
      
      currentIndex++;
    }, 1500 / parseFloat(speedSlider.value)); // Slightly longer duration for each word
  }
  
  // Apply specific hand sign configuration based on the word
  function applyHandSign(word, leftHand, rightHand, leftFingers, rightFingers) {
    // Simple mapping of some example hand signs
    // In a real implementation, this would use a comprehensive dictionary of sign language gestures
    
    // Reset hands to neutral position
    resetHandPosition(leftHand, leftFingers);
    resetHandPosition(rightHand, rightFingers);
    
    // Get first letter to determine hand sign for demonstration
    const firstLetter = word.charAt(0);
    
    if (signDictionary[firstLetter]) {
      // Use predefined sign from dictionary
      const sign = signDictionary[firstLetter];
      
      // Apply sign to left hand
      if (sign.left) {
        applyFingerPositions(leftFingers, sign.left.fingers);
        leftHand.style.transform = sign.left.rotation || 'rotate(0deg)';
      }
      
      // Apply sign to right hand
      if (sign.right) {
        applyFingerPositions(rightFingers, sign.right.fingers);
        rightHand.style.transform = sign.right.rotation || 'rotate(0deg)';
      }
    } else {
      // Default "generic" sign - spelling with fingers
      spellWithFingers(firstLetter, leftFingers);
      rightHand.classList.add('resting');
    }
  }
  
  // Reset hand to neutral position
  function resetHandPosition(hand, fingers) {
    hand.className = hand.className.split(' ')[0] + ' ' + hand.className.split(' ')[1]; // Keep only 'avatar-hand' and 'left/right' classes
    hand.style.transform = 'rotate(0deg)';
    
    fingers.forEach(finger => {
      finger.className = finger.className.split(' ')[0] + ' ' + finger.className.split(' ')[1]; // Keep only 'avatar-finger' and specific finger name
      finger.style.transform = 'rotate(0deg)';
    });
  }
  
  // Apply finger positions according to configuration
  function applyFingerPositions(fingers, positions) {
    if (!positions) return;
    
    // Apply each finger position
    fingers.forEach((finger, index) => {
      if (positions[index]) {
        // Add classes
        if (positions[index].state) {
          finger.classList.add(positions[index].state);
        }
        
        // Apply rotation if provided
        if (positions[index].rotation) {
          finger.style.transform = positions[index].rotation;
        }
      }
    });
  }
  
  // Simple finger spelling for letters
  function spellWithFingers(letter, fingers) {
    letter = letter.toLowerCase();
    
    // Get the corresponding hand element
    const isLeft = fingers[0].classList.contains('left');
    const hand = document.querySelector(`.avatar-hand.${isLeft ? 'left' : 'right'}`);
    
    // Reset all fingers first
    fingers.forEach(finger => {
      finger.classList.remove('extended', 'bent', 'folded');
      finger.style.transform = '';
      finger.style.height = '';
    });
    
    // Reset hand position
    if (hand) {
      hand.style.transform = `translateX(-50%)`;
    }
    
    // Enhanced ASL fingerspelling based on actual sign language configurations
    switch(letter) {
      case 'a':
        // A: fist with thumb resting at the side
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(0deg) translateX(3px)';
            finger.style.height = '24px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'b':
        // B: fingers up, thumb across palm
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '30px';
          }
        });
        break;
        
      case 'c':
        // C: fingers and thumb form a C shape
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(5px)';
            finger.style.height = '24px';
          } else {
            // Slightly different angles for each finger
            const rotation = 40 - (i - 1) * 5;
            finger.style.transform = `rotate(${rotation}deg)`;
            finger.style.height = '26px';
          }
        });
        
        // Curve the hand slightly
        if (hand) {
          hand.style.transform = `translateX(-50%) rotate(${isLeft ? '-5' : '5'}deg)`;
        }
        break;
        
      case 'd':
        // D: index up, rest in
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'e':
        // E: all fingers curled
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px) translateY(-2px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = `rotate(80deg) translateY(${i * 2}px)`;
            finger.style.height = '16px';
          }
        });
        break;
        
      case 'f':
        // F: index and thumb form a circle, others straight
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(30deg) translateX(5px) translateY(-2px)';
            finger.style.height = '22px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(30deg) translateX(-6px) translateY(8px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '28px';
          }
        });
        break;
        
      case 'g':
        // G: index points forward, thumb extends out
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(0deg) translateX(5px)';
            finger.style.height = '24px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(0deg) translateY(-5px)';
            finger.style.height = '28px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        
        // Adjust hand position
        if (hand) {
          hand.style.transform = `translateX(-50%) rotate(${isLeft ? '90' : '-90'}deg)`;
        }
        break;
        
      case 'h':
        // H: index and middle extended, thumb between
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(0deg) translateX(5px)';
            finger.style.height = '24px';
          } else if (i === 1 || i === 2) { // Index and middle
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        
        // Adjust hand position
        if (hand) {
          hand.style.transform = `translateX(-50%) rotate(${isLeft ? '90' : '-90'}deg)`;
        }
        break;
        
      case 'i':
        // I: pinky extended
        fingers.forEach((finger, i) => {
          if (i === 4) { // Pinky
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '24px';
          } else if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'j':
        // J: pinky extended with movement
        fingers.forEach((finger, i) => {
          if (i === 4) { // Pinky
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '24px';
          } else if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        
        // Simulate J movement by rotating the hand
        if (hand) {
          hand.style.transform = `translateX(-50%) rotate(${isLeft ? '-15' : '15'}deg)`;
        }
        break;
        
      case 'k':
        // K: index and middle extended upward, thumb at middle
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '22px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(-10deg)';
            finger.style.height = '30px';
          } else if (i === 2) { // Middle
            finger.style.transform = 'rotate(10deg)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'l':
        // L: index extended upward, thumb extended sideways
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(0deg) translateX(10px)';
            finger.style.height = '24px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'm':
        // M: three fingers folded over thumb
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = `rotate(90deg) translateY(${(i - 1) * 3}px)`;
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'n':
        // N: two fingers folded over thumb
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else if (i <= 2) { // First two fingers
            finger.style.transform = `rotate(90deg) translateY(${(i - 1) * 3}px)`;
            finger.style.height = '18px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'o':
        // O: fingers form an O shape
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(40deg) translateX(5px)';
            finger.style.height = '24px';
          } else {
            // Varying angles for a circle
            const rotation = 45 - (i - 1) * 5;
            finger.style.transform = `rotate(${rotation}deg)`;
            finger.style.height = '26px';
          }
        });
        break;
        
      case 'p':
        // P: middle finger points down, thumb and index extended
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '22px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '28px';
          } else if (i === 2) { // Middle
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '28px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        
        // Orient hand pointing down
        if (hand) {
          hand.style.transform = `translateX(-50%) rotate(${isLeft ? '180' : '180'}deg)`;
        }
        break;
        
      case 'r':
        // R: crossed fingers
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '20px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(-10deg)';
            finger.style.height = '30px';
          } else if (i === 2) { // Middle
            finger.style.transform = 'rotate(10deg) translateX(-3px)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 's':
        // S: fist with thumb wrapped
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '22px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 't':
        // T: fist with thumb between index and middle
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(0deg) translateX(3px) translateY(-5px)';
            finger.style.height = '20px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'u':
        // U: index and middle extended together
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else if (i === 1 || i === 2) { // Index and middle
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'v':
        // V: index and middle extended in V shape
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(-15deg)';
            finger.style.height = '30px';
          } else if (i === 2) { // Middle
            finger.style.transform = 'rotate(15deg)';
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'w':
        // W: index, middle, and ring fingers extended
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else if (i > 0 && i <= 3) { // First three fingers
            const rotation = (i - 2) * 15;
            finger.style.transform = `rotate(${rotation}deg)`;
            finger.style.height = '30px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'x':
        // X: index finger bent at middle joint
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(90deg) translateX(-5px)';
            finger.style.height = '20px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(45deg)';
            finger.style.height = '25px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'y':
        // Y: thumb and pinky extended
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(-10deg) translateX(8px)';
            finger.style.height = '24px';
          } else if (i === 4) { // Pinky
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '24px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        break;
        
      case 'z':
        // Z: index finger out (simulates tracing Z)
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(45deg) translateX(3px)';
            finger.style.height = '22px';
          } else if (i === 1) { // Index
            finger.style.transform = 'rotate(0deg)';
            finger.style.height = '28px';
          } else {
            finger.style.transform = 'rotate(90deg)';
            finger.style.height = '18px';
          }
        });
        
        // Orient hand for Z motion
        if (hand) {
          hand.style.transform = `translateX(-50%) rotate(${isLeft ? '90' : '-90'}deg)`;
        }
        break;
        
      default:
        // For anything else, use neutral hand
        fingers.forEach((finger, i) => {
          if (i === 0) { // Thumb
            finger.style.transform = 'rotate(30deg) translateX(3px)';
            finger.style.height = '22px';
          } else {
            finger.style.transform = 'rotate(15deg)';
            finger.style.height = '26px';
          }
        });
    }
  }
  
  // Animate arms with natural movements
  function animateArms(arms, word) {
    arms.forEach(arm => {
      arm.style.animation = 'none';
      void arm.offsetWidth; // Trigger reflow
      
      const isLeft = arm.classList.contains('left');
      const duration = (1 + Math.random() * 0.5) / parseFloat(speedSlider.value);
      
      // Determine arm position based on current word or letter
      const firstLetter = word.charAt(0);
      let angle = 0;
      
      // Simple mapping of some movements based on first letter
      if (['a', 'e', 'i', 'o', 'u'].includes(firstLetter)) {
        // For vowels, positions near face or upper body
        angle = isLeft ? -30 : 30;
      } else if (['b', 'c', 'd', 'f'].includes(firstLetter)) {
        // For some consonants, positions in front of body
        angle = isLeft ? -15 : 15;
      } else if (['g', 'h', 'j', 'k'].includes(firstLetter)) {
        // For some other consonants, positions to the sides
        angle = isLeft ? -45 : 45;
      } else {
        // Default arm positions
        angle = isLeft ? -20 : 20;
      }
      
      // Apply the animation
      if (isLeft) {
        arm.style.animation = `signArmLeft ${duration}s ease-in-out`;
        arm.style.transform = `rotate(${angle}deg)`;
      } else {
        arm.style.animation = `signArmRight ${duration}s ease-in-out`;
        arm.style.transform = `rotate(${angle}deg)`;
      }
    });
  }
  
  // Reset avatar to initial state
  function resetAvatar() {
    avatarDisplay.classList.remove('active');
    avatarDisplay.innerHTML = '';
    avatarPlaceholder.style.display = 'flex';
    setStatus('Ready to translate', 'ready');
  }
  
  // Update avatar animation speed
  function updateAvatarSpeed(speed) {
    // This would adjust the playback speed of avatar animations
    // For the simulated version, this is handled when creating animations
    const avatarElement = document.querySelector('.simulated-avatar');
    if (avatarElement) {
      avatarElement.style.animationDuration = `${1 / speed}s`;
    }
  }
  
  // Set status message and state
  function setStatus(message, state) {
    statusText.textContent = message;
    statusText.className = 'avatar-status ' + state;
  }
  
  // Add translation to history
  function addToHistory(text) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = { text, timestamp };
    
    // Add to beginning of array
    translationHistory.unshift(historyItem);
    
    // Keep only last 10 items
    if (translationHistory.length > 10) {
      translationHistory.pop();
    }
    
    // Save to localStorage
    saveTranslationHistory();
    
    // Update the UI
    updateHistoryList();
  }
  
  // Update history list in the UI
  function updateHistoryList() {
    historyList.innerHTML = '';
    
    translationHistory.forEach(item => {
      const li = document.createElement('li');
      
      li.innerHTML = `
        <span class="history-text">${item.text}</span>
        <span class="history-time">${item.timestamp}</span>
      `;
      
      li.addEventListener('click', () => {
        textInput.value = item.text;
      });
      
      historyList.appendChild(li);
    });
    
    // If no history, show message
    if (translationHistory.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No translation history yet';
      li.style.justifyContent = 'center';
      li.style.color = 'var(--text-secondary)';
      historyList.appendChild(li);
    }
  }
  
  // Save translation history to localStorage
  function saveTranslationHistory() {
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
  }
  
  // Load translation history from localStorage
  function loadTranslationHistory() {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      translationHistory = JSON.parse(savedHistory);
      updateHistoryList();
    }
  }
  
  // Add enhanced styling for the avatar hands and fingers
  function enhanceAvatarStyling() {
    let styleElement = document.getElementById('enhanced-avatar-styles');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'enhanced-avatar-styles';
      
      const styles = `
        /* Enhanced hand styling for better sign language representation */
        .avatar-wrist {
          width: 30px;
          height: 10px;
          background: linear-gradient(to bottom, #1e40af, #1e3a8a);
          border-radius: 5px;
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
        }
        
        .avatar-hand {
          width: 45px;
          height: 55px;
          border-radius: 14px 14px 20px 20px;
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%);
          transform-origin: center top;
          transition: transform 0.4s ease-out;
        }
        
        .avatar-palm {
          width: 40px;
          height: 38px;
          border-radius: 12px;
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }
        
        /* Enhanced finger positioning for ASL */
        .avatar-finger {
          z-index: 2;
          transition: all 0.3s ease-out;
          transform-origin: bottom center;
        }
        
        .avatar-finger.left {
          left: calc(50% - 20px + var(--finger-offset, 0px));
        }
        
        .avatar-finger.right {
          left: calc(50% + var(--finger-offset, 0px));
        }
        
        .avatar-finger.thumb {
          width: 10px;
          height: 24px;
          --finger-offset: -15px;
          bottom: 15px;
          transform-origin: bottom left;
          border-radius: 5px;
        }
        
        .avatar-finger.index {
          width: 8px;
          height: 28px;
          --finger-offset: -8px;
          bottom: 32px;
        }
        
        .avatar-finger.middle {
          width: 8px;
          height: 30px;
          --finger-offset: 0px;
          bottom: 35px;
        }
        
        .avatar-finger.ring {
          width: 8px;
          height: 28px;
          --finger-offset: 8px;
          bottom: 32px;
        }
        
        .avatar-finger.pinky {
          width: 7px;
          height: 24px;
          --finger-offset: 15px;
          bottom: 30px;
        }
        
        .sign-description {
          position: absolute;
          bottom: -70px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
          opacity: 0.8;
          font-style: italic;
        }
        
        /* Animation keyframes for more fluid ASL motions */
        @keyframes handRotate {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(var(--hand-rotation, 0deg)); }
        }
        
        @keyframes handMove {
          0% { transform: translate(-50%, 0); }
          100% { transform: translate(-50%, var(--hand-offset, 0)); }
        }
      `;
      
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
  }
  
  // Initialize module
  init();
  
  // Add keyframe animations to the document for avatar movements
  addKeyframeAnimations();
});

// Add keyframe animations for avatar movements
function addKeyframeAnimations() {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = `
    @keyframes signArmLeft {
      0% { transform: rotate(0deg); }
      40% { transform: rotate(-15deg); }
      100% { transform: rotate(var(--target-angle, -20deg)); }
    }
    
    @keyframes signArmRight {
      0% { transform: rotate(0deg); }
      40% { transform: rotate(15deg); }
      100% { transform: rotate(var(--target-angle, 20deg)); }
    }
    
    @keyframes fingerBend {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(45deg); }
    }
    
    @keyframes fingerExtend {
      0% { transform: rotate(45deg); }
      100% { transform: rotate(0deg); }
    }
    
    @keyframes handRotate {
      0% { transform: translateX(-50%) rotate(0deg); }
      100% { transform: translateX(-50%) rotate(var(--hand-rotation, 0deg)); }
    }
    
    @keyframes handMove {
      0% { transform: translate(-50%, 0); }
      100% { transform: translate(-50%, var(--hand-offset, 0)); }
    }
    
    .simulated-avatar {
      position: relative;
      width: 240px;
      height: 340px;
      margin: 0 auto;
    }
    
    .avatar-head {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #1e40af, #1e3a8a);
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .avatar-body {
      width: 100px;
      height: 150px;
      background: linear-gradient(to bottom, #1e40af, #1e3a8a);
      border-radius: 50px;
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .avatar-arms {
      position: absolute;
      top: 100px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    
    .avatar-arm {
      width: 20px;
      height: 100px;
      background: linear-gradient(to bottom, #1e40af, #1e3a8a);
      border-radius: 10px;
      position: relative;
      transform-origin: top center;
    }
    
    .avatar-arm.left {
      left: 40px;
    }
    
    .avatar-arm.right {
      right: 40px;
    }
    
    /* Hand styling - more detailed for sign language */
    .avatar-hand {
      width: 40px;
      height: 50px;
      background: linear-gradient(to bottom, #1e3a8a, #3b82f6);
      border-radius: 12px 12px 20px 20px;
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      transform-origin: center top;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 5px;
      z-index: 5;
      transition: transform 0.3s ease-in-out;
    }
    
    .avatar-hand.left {
      transform: translateX(-50%) rotate(0deg);
    }
    
    .avatar-hand.right {
      transform: translateX(-50%) rotate(0deg);
    }
    
    .avatar-hand.resting {
      opacity: 0.7;
    }
    
    .avatar-palm {
      width: 38px;
      height: 35px;
      background: linear-gradient(to bottom, #1e3a8a, #3b82f6);
      border-radius: 10px;
      position: absolute;
      top: 15px;
      z-index: 1;
    }
    
    /* Finger styling - more articulated for detailed signs */
    .avatar-finger {
      width: 8px;
      height: 25px;
      background: linear-gradient(to bottom, #1e3a8a, #3b82f6);
      border-radius: 4px;
      position: absolute;
      transform-origin: bottom center;
      z-index: 2;
      transition: transform 0.3s ease-in-out, height 0.2s ease-in-out;
    }
    
    /* Finger positions */
    .avatar-finger.thumb {
      width: 9px;
      height: 22px;
      left: 0px;
      top: 12px;
      transform-origin: bottom left;
    }
    
    .avatar-finger.index {
      left: 10px;
      top: -10px;
    }
    
    .avatar-finger.middle {
      left: 20px;
      top: -12px;
    }
    
    .avatar-finger.ring {
      left: 30px;
      top: -10px;
    }
    
    .avatar-finger.pinky {
      width: 7px;
      height: 20px;
      left: 40px;
      top: -5px;
    }
    
    /* Finger states - more variations for sign language */
    .avatar-finger.extended {
      transform: rotate(0deg);
    }
    
    .avatar-finger.folded {
      transform: rotate(90deg);
      height: 18px;
    }
    
    .avatar-finger.bent {
      transform: rotate(45deg);
      height: 22px;
    }
    
    .avatar-finger.half-bent {
      transform: rotate(30deg);
      height: 23px;
    }
    
    .avatar-finger.touching-thumb {
      transform: rotate(45deg) translateY(8px);
      height: 20px;
    }
    
    .current-word {
      position: absolute;
      bottom: -40px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--primary-color);
      background: rgba(255, 255, 255, 0.8);
      padding: 0.5rem;
      border-radius: 20px;
      box-shadow: var(--shadow-sm);
    }
    
    /* Status styles */
    .avatar-status.warning {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }
    
    .avatar-status.processing {
      background: rgba(30, 64, 175, 0.2);
      color: #1e40af;
      animation: pulse 1s infinite;
    }
    
    .avatar-status.active {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      animation: pulse 1.5s infinite;
    }
    
    .avatar-status.success {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }
    
    .avatar-status.ready {
      background: rgba(99, 102, 241, 0.1);
      color: var(--text-secondary);
    }
  `;
  document.head.appendChild(styleSheet);
} 