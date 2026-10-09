/**
 * Apple Design System 2026 — Text-to-Image & Anniversary Studio
 * Complete Client Logic: Physics-based Fireworks, Auto-Year Logic,
 * Realistic AI Generation, Apple Audio Player, Theme Controller.
 */

// ==========================================
// 1. Automatic Year & Milestone Engine
// ==========================================
function initAutomaticYearLogic() {
  const currentYear = new Date().getFullYear();
  
  // Update all elements requiring current year
  const yearElements = document.querySelectorAll('.auto-current-year');
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
  
  // Calculate dynamic anniversary years
  updateMilestoneDisplay();
}

function updateMilestoneDisplay() {
  const currentYear = new Date().getFullYear();
  const baseYearInput = document.getElementById('anniversaryYearInput');
  const baseYear = baseYearInput ? parseInt(baseYearInput.value) || 2020 : 2020;
  
  const yearsTogether = Math.max(0, currentYear - baseYear);
  const milestoneTag = document.getElementById('milestoneTag');
  
  if (milestoneTag) {
    if (yearsTogether === 0) {
      milestoneTag.textContent = `🌟 Celebrating Year One in ${currentYear}!`;
    } else {
      const ordinal = getOrdinalSuffix(yearsTogether);
      milestoneTag.textContent = `💖 Celebrating ${yearsTogether}${ordinal} Anniversary (${currentYear})`;
    }
  }
}

function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ==========================================
// 2. Cupertino Theme Controller
// ==========================================
const ThemeController = {
  init() {
    const savedTheme = localStorage.getItem('apple_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
      });
    }

    // Listen for OS preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('apple_theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('apple_theme', theme);
    const themeIcon = document.getElementById('themeToggleIcon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
};

// ==========================================
// 3. Realistic Physics Fireworks Engine
// ==========================================
class RealisticFireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.fireworks = [];
    this.particles = [];
    this.colors = [
      '#ff2d55', '#0071e3', '#af52de', '#34c759', 
      '#ff9500', '#5856d6', '#ffcc00', '#5ac8fa'
    ];
    this.isRunning = true;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Launch fireworks on click
    window.addEventListener('click', (e) => {
      // Avoid triggering when clicking buttons or inputs
      if (['BUTTON', 'INPUT', 'A', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('button')) {
        return;
      }
      this.launchToCoordinate(e.clientX, e.clientY);
    });

    this.loop();
    this.startAutoLaunch();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  randomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  launchToCoordinate(targetX, targetY) {
    const startX = targetX + (Math.random() * 80 - 40);
    const startY = this.canvas.height;
    const speed = 12 + Math.random() * 4;
    const angle = Math.atan2(targetY - startY, targetX - startX);

    this.fireworks.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: this.randomColor(),
      radius: 2.5,
      trail: []
    });
  }

  startAutoLaunch() {
    setInterval(() => {
      if (!document.hidden && this.isRunning) {
        const targetX = Math.random() * (this.canvas.width * 0.8) + (this.canvas.width * 0.1);
        const targetY = Math.random() * (this.canvas.height * 0.4) + 60;
        this.launchToCoordinate(targetX, targetY);
      }
    }, 2400);
  }

  explode(x, y, color) {
    const count = 75 + Math.floor(Math.random() * 45);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.016,
        size: Math.random() * 2.8 + 1.2,
        gravity: 0.08,
        friction: 0.96
      });
    }
  }

  loop() {
    requestAnimationFrame(() => this.loop());

    // Semi-transparent clearing for realistic motion blur trail
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'lighter';

    // Update & draw ascending rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;

      // Track rocket trail
      fw.trail.push({ x: fw.x, y: fw.y });
      if (fw.trail.length > 5) fw.trail.shift();

      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = fw.color;
      this.ctx.fill();

      // Check distance to target
      const dist = Math.hypot(fw.targetX - fw.x, fw.targetY - fw.y);
      if (dist < 18 || fw.y <= fw.targetY) {
        this.explode(fw.x, fw.y, fw.color);
        this.fireworks.splice(i, 1);
      }
    }

    // Update & draw exploding spark particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

// ==========================================
// 4. Floating Hearts Ambient Layer
// ==========================================
function initFloatingHearts() {
  const container = document.getElementById('heartsContainer') || document.body;
  const colors = ['#ff2d55', '#af52de', '#ff375f', '#ff6482'];
  
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.left = `${Math.random() * 95}vw`;
    heart.style.fontSize = `${Math.random() * 16 + 10}px`;
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.animationDuration = `${Math.random() * 8 + 8}s`;
    heart.style.animationDelay = `${Math.random() * 6}s`;
    container.appendChild(heart);
  }
}

// ==========================================
// 5. Celebration Card & WhatsApp Messenger
// ==========================================
function updateCelebrationCard() {
  const namesInput = document.getElementById('nameInput');
  const msgInput = document.getElementById('msgInput');
  const names = (namesInput && namesInput.value.trim()) || "Amit & Neha";
  const msg = (msgInput && msgInput.value.trim()) || "Wishing you a lifetime of timeless love, endless laughter, and boundless joy!";

  const namesDisplay = document.getElementById('nameDisplay');
  const msgDisplay = document.getElementById('msgDisplay');

  if (namesDisplay) namesDisplay.textContent = `${names}'s Celebration`;
  if (msgDisplay) msgDisplay.textContent = msg;

  updateMilestoneDisplay();

  // WhatsApp share link
  const currentYear = new Date().getFullYear();
  const shareText = `🎉 Celebrating Love & Milestones with ${names}! ✨\n"${msg}"\nDesigned with Apple HIG & AI Text-to-Image Studio (${currentYear})\n${window.location.href}`;
  const whatsappShare = document.getElementById('whatsappShare');
  if (whatsappShare) {
    whatsappShare.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  }

  // Toast confirmation
  showToast("Celebration card updated successfully!");
}

// ==========================================
// 6. Text-to-Image Generation Engine
// ==========================================
let currentAspectRatio = { width: 1024, height: 1024, ratio: '1:1' };
let currentStylePrompt = '';

function setAspectRatio(ratio, element) {
  document.querySelectorAll('.ratio-option').forEach(el => el.classList.remove('active'));
  element.classList.add('active');

  switch (ratio) {
    case '16:9':
      currentAspectRatio = { width: 1280, height: 720, ratio: '16:9' };
      break;
    case '9:16':
      currentAspectRatio = { width: 720, height: 1280, ratio: '9:16' };
      break;
    case '4:3':
      currentAspectRatio = { width: 1024, height: 768, ratio: '4:3' };
      break;
    default:
      currentAspectRatio = { width: 1024, height: 1024, ratio: '1:1' };
  }
}

function setPresetStyle(styleName, promptModifier, element) {
  document.querySelectorAll('.preset-pill').forEach(el => el.classList.remove('active'));
  if (currentStylePrompt === promptModifier) {
    currentStylePrompt = '';
  } else {
    element.classList.add('active');
    currentStylePrompt = promptModifier;
  }
}

function setQuickPrompt(promptText) {
  const promptInput = document.getElementById('imagePrompt');
  if (promptInput) {
    promptInput.value = promptText;
    promptInput.focus();
  }
}

async function generateImage() {
  const promptInput = document.getElementById('imagePrompt');
  const rawPrompt = promptInput ? promptInput.value.trim() : '';

  if (!rawPrompt) {
    showToast("Please enter an image prompt first.");
    promptInput?.focus();
    return;
  }

  const fullPrompt = currentStylePrompt 
    ? `${rawPrompt}, ${currentStylePrompt}, ultra-detailed 8k, award winning composition, masterpiece`
    : `${rawPrompt}, ultra-detailed, photorealistic, 8k resolution`;

  const generatedImage = document.getElementById('generatedImage');
  const placeholder = document.getElementById('viewportPlaceholder');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const generateBtn = document.getElementById('generateBtn');
  const canvasActions = document.getElementById('canvasActions');

  // UI loading transition
  if (placeholder) placeholder.style.display = 'none';
  if (generatedImage) generatedImage.style.display = 'none';
  if (canvasActions) canvasActions.style.display = 'none';
  if (loadingIndicator) loadingIndicator.style.display = 'flex';
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Masterpiece...';
  }

  try {
    let imageUrl = '';

    // First attempt: Call local backend endpoint (/generate-image)
    try {
      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (response.ok) {
        const data = await response.json();
        // If backend returned a valid image (not a broken or raw placeholder)
        if (data.image_url && !data.image_url.includes('picsum.photos')) {
          imageUrl = data.image_url;
        }
      }
    } catch (backendError) {
      console.warn("Backend not active or offline; falling back to direct AI generation:", backendError);
    }

    // High-fidelity fallback: Pollinations.ai generative pipeline (produces real high-resolution AI art)
    if (!imageUrl) {
      const randomSeed = Math.floor(Math.random() * 9999999);
      const encodedPrompt = encodeURIComponent(fullPrompt);
      imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${currentAspectRatio.width}&height=${currentAspectRatio.height}&seed=${randomSeed}&nologo=true&model=flux`;
    }

    // Preload image before revealing
    const imgLoader = new Image();
    imgLoader.src = imageUrl;

    imgLoader.onload = () => {
      if (generatedImage) {
        generatedImage.src = imageUrl;
        generatedImage.style.display = 'block';
      }
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (canvasActions) canvasActions.style.display = 'inline-flex';
      showToast("Masterpiece generated successfully! ✨");
    };

    imgLoader.onerror = () => {
      // Fallback to high quality unsplash artistic imagery if provider has network glitch
      const fallbackUrl = `https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=${currentAspectRatio.width}&q=80`;
      if (generatedImage) {
        generatedImage.src = fallbackUrl;
        generatedImage.style.display = 'block';
      }
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (canvasActions) canvasActions.style.display = 'inline-flex';
      showToast("Image loaded with high-resolution fallback.");
    };

  } catch (err) {
    console.error("Image generation failure:", err);
    showToast("Error generating image. Please try again.");
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  } finally {
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-sparkles"></i> Generate Image';
    }
  }
}

// Download High-Resolution Image
function downloadCurrentImage() {
  const generatedImage = document.getElementById('generatedImage');
  if (!generatedImage || !generatedImage.src) {
    showToast("No generated image to download.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `Apple-TextToImage-${timestamp}.png`;

  // Fetch as blob for proper filename download
  fetch(generatedImage.src)
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast("Download started!");
    })
    .catch(() => {
      // Direct link fallback
      window.open(generatedImage.src, '_blank');
    });
}

// Copy Image Link to Clipboard
function copyImageLink() {
  const generatedImage = document.getElementById('generatedImage');
  if (generatedImage && generatedImage.src) {
    navigator.clipboard.writeText(generatedImage.src).then(() => {
      showToast("Image link copied to clipboard!");
    }).catch(() => {
      showToast("Could not copy link.");
    });
  }
}

// ==========================================
// 7. Ambient Audio Controller
// ==========================================
let isAudioPlaying = false;
function toggleAudioPlayback() {
  const audio = document.getElementById('bgMusic');
  const audioBtn = document.getElementById('musicControlBtn');
  const audioText = document.getElementById('musicStatusText');
  const audioIcon = document.getElementById('musicStatusIcon');

  if (!audio) return;

  if (isAudioPlaying) {
    audio.pause();
    isAudioPlaying = false;
    if (audioText) audioText.textContent = "Play Sound";
    if (audioIcon) audioIcon.className = "fas fa-play";
    showToast("Audio paused.");
  } else {
    audio.play().then(() => {
      isAudioPlaying = true;
      if (audioText) audioText.textContent = "Pause Sound";
      if (audioIcon) audioIcon.className = "fas fa-pause";
      showToast("Playing celebratory soundscape 🎶");
    }).catch(e => {
      console.warn("Audio play prevented:", e);
      showToast("Tap again to allow audio playback.");
    });
  }
}

// ==========================================
// 8. Apple Toast Notification System
// ==========================================
function showToast(message) {
  let toast = document.getElementById('appleToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appleToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '28px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.background = 'rgba(28, 28, 30, 0.88)';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.65rem 1.4rem';
    toast.style.borderRadius = '980px';
    toast.style.fontSize = '0.875rem';
    toast.style.fontWeight = '500';
    toast.style.backdropFilter = 'blur(20px)';
    toast.style.webkitBackdropFilter = 'blur(20px)';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2800);
}

// ==========================================
// 9. App Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeController.init();
  initAutomaticYearLogic();
  initFloatingHearts();
  new RealisticFireworksEngine('fireworks');
  updateCelebrationCard();
});
