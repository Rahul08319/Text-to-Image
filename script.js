let isPlaying = false;
const music = document.getElementById('bgMusic');
const musicBtn = document.querySelector('.music-control');
const musicText = document.querySelector('.music-text');

function toggleMusic() {
  if (isPlaying) {
    music.pause();
    musicText.textContent = 'Play Music';
    musicBtn.querySelector('i').className = 'fas fa-music neon-icon';
  } else {
    music.play()
      .then(() => {
        musicText.textContent = 'Pause Music';
        musicBtn.querySelector('i').className = 'fas fa-pause neon-icon';
      })
      .catch(error => {
        console.log('Audio playback failed:', error);
        alert('Please interact with the page first to enable audio');
      });
  }
  isPlaying = !isPlaying;
  
  // Add pulse effect
  musicBtn.style.transform = 'scale(1.1)';
  setTimeout(() => {
    musicBtn.style.transform = '';
  }, 300);
}

function updateContent() {
  const name = document.getElementById('nameInput').value.trim() || "Amit & Neha";
  const msg = document.getElementById('msgInput').value.trim() || "Wishing you a lifetime of love and laughter together!";

  document.getElementById('nameDisplay').innerHTML = `${name}'s Anniversary! <i class="fas fa-heart" style="color: var(--neon-pink);"></i>`;
  document.getElementById('msgDisplay').innerHTML = `${msg} <i class="fas fa-glass-cheers" style="color: var(--neon-yellow);"></i>`;

  const shareText = `🎉 Celebrate love with ${name}! 💖\n"${msg}"\nCheck out our anniversary page: ${window.location.href}`;
  document.getElementById('whatsappShare').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  
  // Add confirmation effect
  const btn = document.querySelector('.update-btn');
  btn.innerHTML = '<i class="fas fa-check neon-icon" style="color: var(--neon-green);"></i> Updated!';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-sync-alt neon-icon" style="color: var(--neon-purple);"></i> Update Message';
  }, 2000);
}

// Set initial WhatsApp link
updateContent();

// Create floating hearts
function createHearts() {
  const colors = ['var(--neon-pink)', 'var(--neon-blue)', 'var(--neon-green)', 'var(--neon-purple)', 'var(--neon-yellow)'];
  
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 100 + 'vh';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.animationDuration = (Math.random() * 10 + 5) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    document.body.appendChild(heart);
  }
}

createHearts();

// Enhanced Fireworks JS
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const colors = [
  '#ff00ff', '#00ffff', '#00ff00', 
  '#9d00ff', '#fff700', '#ff8c00',
  '#ff1493', '#00bfff', '#7fff00'
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

class Firework {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height / 2;
    this.speed = 2 + Math.random() * 3;
    this.radius = 3;
    this.color = randomColor();
    this.particles = [];
    this.exploded = false;
  }
  
  explode() {
    const particleCount = 100 + Math.floor(Math.random() * 50);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 5 + 1;
      const size = Math.random() * 4 + 1;
      
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: size,
        color: this.color,
        life: 100 + Math.random() * 50,
        friction: 0.95 + Math.random() * 0.03,
        gravity: 0.1 + Math.random() * 0.1
      });
    }
    this.exploded = true;
  }
  
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      
      if (this.y <= this.targetY) {
        this.explode();
      }
      
      return true;
    } else {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        
        p.x += p.vx;
        p.y += p.vy;
        
        p.life--;
      }
      
      this.particles = this.particles.filter(p => p.life > 0);
      
      if (this.particles.length === 0) {
        this.reset();
        return false;
      }
      
      return true;
    }
  }
  
  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Trail
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + 10);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 3
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  // Clear with semi-transparent for trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add new fireworks randomly
  if (Math.random() < 0.05) {
    fireworks.push(new Firework());
  }
  
  // Update and draw fireworks
  for (let i = 0; i < fireworks.length; i++) {
    if (fireworks[i].update()) {
      fireworks[i].draw();
    } else {
      fireworks.splice(i, 1);
      i--;
    }
  }
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Initial fireworks
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    fireworks.push(new Firework());
  }, i * 300);
}

async function generateImage() {
  const prompt = document.getElementById('imagePrompt').value.trim();
  if (!prompt) {
    alert('Please enter a description for the image.');
    return;
  }

  const generatedImage = document.getElementById('generatedImage');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const generateBtn = document.querySelector('.generate-btn');

  // Show loading state
  loadingIndicator.style.display = 'block';
  generatedImage.style.display = 'none';
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin neon-icon"></i> Generating...';

  try {
    const response = await fetch('/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image.');
    }

    const { image_url } = await response.json();
    generatedImage.src = image_url;
    generatedImage.style.display = 'block';

  } catch (error) {
    console.error('Image generation error:', error);
    alert(`Error: ${error.message}`);
    generatedImage.style.display = 'none';
  } finally {
    // Hide loading state
    loadingIndicator.style.display = 'none';
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-magic neon-icon" style="color: var(--neon-blue);"></i> Generate Image';
  }
}
