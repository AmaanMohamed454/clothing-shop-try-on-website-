// ==========================================
// PROCEDURAL CINEMATIC ROMANTIC SYNTHESIZER
// ==========================================
class RomanticSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.gainNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
    
    // Smooth master volume fade-in
    this.gainNode.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 3.0);
  }

  playTone(freq, type, startTime, duration, volume) {
    if (!this.ctx) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, startTime);
      
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.45, startTime);
      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.25, startTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(delay); // Feedback
      delayGain.connect(this.gainNode);
      
      osc.start(startTime);
      osc.stop(startTime + duration + 1.0);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  start() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    
    // Chords: Dbmaj7 -> Abmaj7 -> Bbm7 -> Gbmaj7
    const chords = [
      [138.59, 174.61, 207.65, 261.63], // Db3, F3, Ab3, C4
      [207.65, 261.63, 311.13, 392.00], // Ab3, C4, Eb4, G4
      [116.54, 138.59, 174.61, 207.65], // Bb2, Db3, F3, Ab3
      [92.50, 233.08, 277.18, 349.23]   // Gb2, Bb3, Db4, F4
    ];
    
    // Melody notes in scale of Db major
    const melodyScale = [554.37, 622.25, 698.46, 830.61, 932.33, 1046.50, 1108.73];
    
    let chordIdx = 0;
    let time = this.ctx.currentTime + 0.1;
    
    const playBar = () => {
      if (!this.isPlaying || !this.ctx) return;
      
      const currentChord = chords[chordIdx];
      currentChord.forEach(freq => {
        this.playTone(freq, 'triangle', time, 6.0, 0.07);
      });
      
      for (let i = 0; i < 8; i++) {
        const noteTime = time + i * 0.75;
        if (Math.random() < 0.65) {
          const freq = melodyScale[Math.floor(Math.random() * melodyScale.length)];
          this.playTone(freq, 'sine', noteTime, 2.5, 0.035);
        }
      }
      
      chordIdx = (chordIdx + 1) % chords.length;
      time += 6.0;
      
      this.timerId = setTimeout(playBar, 6000);
    };
    
    playBar();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearTimeout(this.timerId);
    
    if (this.ctx && this.gainNode) {
      try {
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
        
        setTimeout(() => {
          if (this.ctx) {
            this.ctx.close().then(() => {
              this.ctx = null;
            });
          }
        }, 1200);
      } catch (e) {
        console.warn("Error stopping synthesizer:", e);
      }
    }
  }
}

const synth = new RomanticSynth();

// ==========================================
// CANVAS PARTICLES (ROSE PETALS & BOKEH & LIGHT RAYS)
// ==========================================
const canvas = document.getElementById('apology-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

let isForgiven = false;
let time = 0;

class Petal {
  constructor() {
    this.reset();
    this.y = Math.random() * height; // distribute initially
  }

  reset() {
    this.x = Math.random() * width;
    this.y = -20;
    this.z = Math.random() * 1.4 + 0.4;
    this.size = (Math.random() * 8 + 8) * this.z;
    this.speedY = (Math.random() * 1.5 + 0.8) * this.z;
    this.speedX = (Math.random() * 0.8 - 0.4) + 0.6;
    this.rotationX = Math.random() * Math.PI;
    this.rotationY = Math.random() * Math.PI;
    this.rotationZ = Math.random() * Math.PI;
    this.spinX = Math.random() * 0.015 - 0.007;
    this.spinY = Math.random() * 0.02 + 0.005;
    this.spinZ = Math.random() * 0.01 - 0.005;
    
    const tones = ['#d32f2f', '#c2185b', '#ff1744', '#b71c1c', '#e91e63'];
    this.color = tones[Math.floor(Math.random() * tones.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y / 40) * 0.4;
    this.rotationX += this.spinX;
    this.rotationY += this.spinY;
    this.rotationZ += this.spinZ;

    if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationZ);
    ctx.scale(Math.sin(this.rotationX), Math.cos(this.rotationY));

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    grad.addColorStop(0, '#ff4081');
    grad.addColorStop(0.3, this.color);
    grad.addColorStop(1, '#5c000e');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.quadraticCurveTo(this.size, -this.size, this.size, 0);
    ctx.quadraticCurveTo(this.size, this.size, 0, this.size);
    ctx.quadraticCurveTo(-this.size, this.size, -this.size, 0);
    ctx.quadraticCurveTo(-this.size, -this.size, 0, -this.size);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.6, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();
  }
}

class Sparkle {
  constructor() {
    this.reset();
    this.y = Math.random() * height;
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height + 10;
    this.size = Math.random() * 2 + 1;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.speedX = Math.random() * 0.4 - 0.2;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.decay = Math.random() * 0.005 + 0.002;
    this.hue = Math.random() * 20 + 40;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.alpha -= this.decay;
    if (this.alpha <= 0 || this.y < -10) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Bokeh {
  constructor() {
    this.reset();
    this.y = Math.random() * height;
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height + height / 2;
    this.size = Math.random() * 40 + 20;
    this.speedY = -(Math.random() * 0.3 + 0.1);
    this.speedX = Math.random() * 0.2 - 0.1;
    this.alpha = Math.random() * 0.07 + 0.03;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y < -this.size) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ff8a80';
    ctx.filter = 'blur(4px)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const petals = Array.from({ length: 45 }, () => new Petal());
const sparkles = Array.from({ length: 60 }, () => new Sparkle());
const bokehs = Array.from({ length: 15 }, () => new Bokeh());
let confetti = [];

function triggerConfetti() {
  isForgiven = true;
  for (let i = 0; i < 150; i++) {
    const c = new Petal();
    c.y = height / 2 + (Math.random() * 100 - 50);
    c.x = width / 2 + (Math.random() * 100 - 50);
    c.speedY = Math.random() * -6 - 2;
    c.speedX = Math.random() * 10 - 5;
    c.size = Math.random() * 12 + 6;
    confetti.push(c);
  }
}

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

function animationLoop() {
  time++;
  ctx.clearRect(0, 0, width, height);

  // 1. Draw volumetric rays
  ctx.save();
  const lightX = width / 2;
  const lightY = 0;
  const rayCount = 5;
  const maxLen = Math.max(width, height) * 1.5;
  
  for (let i = 0; i < rayCount; i++) {
    const angleOsc = Math.sin(time * 0.0006 + i * 2.5) * 0.03;
    const angle = Math.PI / 2 + (i - (rayCount - 1) / 2) * 0.22 + angleOsc;
    const spread = 0.06;

    const x1 = lightX + Math.cos(angle - spread) * maxLen;
    const y1 = lightY + Math.sin(angle - spread) * maxLen;
    const x2 = lightX + Math.cos(angle + spread) * maxLen;
    const y2 = lightY + Math.sin(angle + spread) * maxLen;

    const rayGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, maxLen);
    rayGrad.addColorStop(0, `rgba(255, 230, 160, ${0.08 + Math.sin(time * 0.001 + i) * 0.03})`);
    rayGrad.addColorStop(0.4, `rgba(255, 210, 150, ${0.03 + Math.sin(time * 0.0015 + i) * 0.01})`);
    rayGrad.addColorStop(1, 'rgba(255, 200, 120, 0)');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 2. Draw bokehs
  bokehs.forEach(b => {
    b.update();
    b.draw();
  });

  // 3. Draw sparkles
  sparkles.forEach(s => {
    s.update();
    s.draw();
  });

  // 4. Draw standard petals
  petals.forEach(p => {
    p.update();
    p.draw();
  });

  // 5. Draw confetti
  if (isForgiven && confetti.length > 0) {
    confetti.forEach((c, idx) => {
      c.y += c.speedY;
      c.x += c.speedX;
      c.speedY += 0.08; // gravity
      c.speedX *= 0.98; // friction
      c.rotationX += c.spinX * 2;
      c.rotationY += c.spinY * 2;
      c.draw();
      
      if (c.y > height + 20) {
        confetti.splice(idx, 1);
      }
    });
  }

  requestAnimationFrame(animationLoop);
}

animationLoop();

// ==========================================
// ROSE HEART COORDINATE GENERATION & RENDERING
// ==========================================
const roseHeart = document.getElementById('rose-heart');
const heartName = document.getElementById('heart-name');
let roses = [];

const roseSVGCode = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
  <defs>
    <radialGradient id="rose-grad-cell" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff3d00" />
      <stop offset="50%" stop-color="#d50000" />
      <stop offset="100%" stop-color="#4a0007" />
    </radialGradient>
    <linearGradient id="leaf-grad-cell" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#81c784" />
      <stop offset="100%" stop-color="#1b5e20" />
    </linearGradient>
  </defs>
  <path d="M50 50 Q43 78 50 96" stroke="#2e7d32" stroke-width="3" fill="none" />
  <path d="M47 72 C32 70 25 58 35 55 C45 52 47 62 47 72 Z" fill="url(#leaf-grad-cell)" />
  <path d="M53 79 C68 77 75 65 65 62 C55 59 53 69 53 79 Z" fill="url(#leaf-grad-cell)" />
  <path d="M50 12 C28 12 18 32 38 52 C50 64 50 64 50 64 C50 64 50 64 62 52 C82 32 72 12 50 12 Z" fill="url(#rose-grad-cell)" />
  <path d="M50 20 C36 20 28 35 42 47 C50 55 50 55 50 55 C50 55 50 55 58 47 C72 35 64 20 50 20 Z" fill="#ff1744" />
  <path d="M50 27 C42 27 38 38 46 45 C50 49 50 49 50 49 C50 49 50 49 54 45 C62 38 58 27 50 27 Z" fill="#ff5252" />
  <circle cx="50" cy="36" r="6" fill="#880e4f" />
  <circle cx="50" cy="36" r="2.5" fill="#ffe082" class="gold-center" />
</svg>
`;

function createHeartStructure() {
  const count = 42;
  const isMobile = window.innerWidth < 550;
  const scaleX = isMobile ? 8.5 : 12.5;
  const scaleY = isMobile ? 8.5 : 12.5;
  
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3) * scaleX;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scaleY;

    const roseItem = document.createElement('div');
    roseItem.className = 'rose-item';
    roseItem.innerHTML = roseSVGCode;
    
    const scatterAngle = (i / count) * Math.PI * 2;
    const startX = Math.cos(scatterAngle) * (window.innerWidth + 200);
    const startY = Math.sin(scatterAngle) * (window.innerHeight + 200);
    
    roseItem.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(0) rotate(${Math.random() * 360}deg)`;
    roseItem.style.opacity = '0';
    
    roseHeart.appendChild(roseItem);
    roses.push({ element: roseItem, targetX: x, targetY: y });
  }
}

function formHeart() {
  roses.forEach((rose, idx) => {
    setTimeout(() => {
      rose.element.style.transform = `translate3d(${rose.targetX}px, ${rose.targetY}px, 0) scale(1) rotate(0deg)`;
      rose.element.style.opacity = '1';
      rose.element.classList.add('glowing');
    }, idx * 45);
  });
}

function openHeart() {
  roses.forEach((rose) => {
    const dirX = rose.targetX < 0 ? -250 : 250;
    const rotateDeg = rose.targetX < 0 ? -45 : 45;
    
    rose.element.style.transform = `translate3d(${rose.targetX + dirX}px, ${rose.targetY - 50}px, 0) scale(0) rotate(${rotateDeg}deg)`;
    rose.element.style.opacity = '0';
    rose.element.style.transition = 'transform 2.2s ease-in-out, opacity 1.8s ease-in-out';
  });
  
  heartName.classList.remove('visible');
  heartName.style.opacity = '0';
}

// ==========================================
// BUTTON INTERACTIONS & SCENE TRANSITIONS
// ==========================================
const openBtn = document.getElementById('open-btn');
const soundToggle = document.getElementById('sound-toggle');
const introScreen = document.getElementById('intro-screen');
const heartScreen = document.getElementById('heart-screen');
const apologyCard = document.getElementById('apology-card');
const successCard = document.getElementById('success-card');
const forgiveBtn = document.getElementById('forgive-btn');
const madBtn = document.getElementById('mad-btn');
const heartTip = document.getElementById('heart-tip');

let isMuted = false;

openBtn.addEventListener('click', () => {
  introScreen.classList.add('hide');
  soundToggle.classList.remove('hide');
  heartScreen.classList.remove('hide');
  
  synth.start();
  
  createHeartStructure();
  
  setTimeout(() => {
    formHeart();
  }, 100);
  
  setTimeout(() => {
    roseHeart.classList.add('beating');
    heartName.classList.add('visible');
    heartTip.innerText = 'Tap the heart to open my feelings...';
  }, 3800);
});

roseHeart.addEventListener('click', () => {
  if (!roseHeart.classList.contains('beating')) return; // wait till formed
  
  openHeart();
  
  setTimeout(() => {
    heartScreen.classList.add('hide');
    apologyCard.classList.remove('hide');
  }, 1800);
});

soundToggle.addEventListener('click', () => {
  if (isMuted) {
    synth.start();
    soundToggle.innerText = '🔊';
    isMuted = false;
  } else {
    synth.stop();
    soundToggle.innerText = '🔇';
    isMuted = true;
  }
});

function dodgeButton() {
  const margin = 100;
  const maxX = window.innerWidth - 180 - margin;
  const maxY = window.innerHeight - 60 - margin;
  const randomX = Math.max(margin, Math.random() * maxX);
  const randomY = Math.max(margin, Math.random() * maxY);

  madBtn.style.position = 'fixed';
  madBtn.style.left = `${randomX}px`;
  madBtn.style.top = `${randomY}px`;
  madBtn.style.zIndex = 9999;
  madBtn.style.transition = 'all 0.2s cubic-bezier(0.19, 1, 0.22, 1)';
}

madBtn.addEventListener('mouseenter', dodgeButton);
madBtn.addEventListener('touchstart', dodgeButton);
madBtn.addEventListener('click', dodgeButton);

forgiveBtn.addEventListener('click', () => {
  apologyCard.classList.add('hide');
  successCard.classList.remove('hide');
  triggerConfetti();
});
