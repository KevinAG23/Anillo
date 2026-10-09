/**
 * Romantic Atmosphere & Floating Hearts Engine
 * Renders continuous, lush floating hearts, Hello Kitty bows, golden sparkles,
 * interactive touch trails, and perpetual celebration cascades.
 */

class RomanticAtmosphereManager {
  constructor(canvasId = 'ambient-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.touchParticles = [];
    this.celebrationParticles = [];
    this.isCelebrationActive = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isConverging = false;
    this.convergeTarget = { x: this.width / 2, y: this.height / 2 };
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Optimized density for mobile performance without dropped frames (38 on mobile, 85 on desktop)
    const count = window.innerWidth < 600 ? 38 : 85;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(false));
    }

    // Touch / Mouse interactive trail
    this.setupPointerTrail();

    // Start continuous animation loop
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this.convergeTarget = { x: this.width / 2, y: this.height / 2 };
  }

  setupPointerTrail() {
    let lastSpawnTime = 0;
    const spawnTouchHearts = (x, y) => {
      const now = performance.now();
      const throttleMs = window.innerWidth < 600 ? 65 : 35;
      if (now - lastSpawnTime < throttleMs) return; // throttle for buttery 60fps
      lastSpawnTime = now;

      // Spawn 1 cute mini heart or sparkle at touch point
      this.touchParticles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        size: 8 + Math.random() * 10,
        speedY: -1.2 - Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 1.5,
        opacity: 0.95,
        rotation: (Math.random() - 0.5) * 0.8,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        color: Math.random() > 0.4 ? 'rgba(255, 92, 154, ' : 'rgba(255, 182, 193, ',
        type: Math.random() > 0.3 ? 'heart' : 'sparkle',
        life: 1.0,
        decay: 0.022 + Math.random() * 0.015
      });
    };

    window.addEventListener('pointermove', (e) => {
      spawnTouchHearts(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        spawnTouchHearts(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  createParticle(fromBottom = true) {
    // Variety: large soft hearts, crisp medium hearts, tiny stars, cute mini bows
    const rand = Math.random();
    let type = 'heart';
    let size = 12 + Math.random() * 16;

    if (rand < 0.65) {
      type = 'heart';
      size = 10 + Math.random() * 22; // Visible, rich hearts
    } else if (rand < 0.82) {
      type = 'sparkle';
      size = 3 + Math.random() * 7;
    } else if (rand < 0.93) {
      type = 'goldStar';
      size = 4 + Math.random() * 8;
    } else {
      type = 'bow'; // Cute mini Hello Kitty bow!
      size = 12 + Math.random() * 10;
    }

    const startY = fromBottom ? (this.height + 30 + Math.random() * 50) : (Math.random() * this.height);
    const startX = Math.random() * this.width;

    // Palette: romantic pinks, vivid rose, golden accents, soft ivory
    const colorChoices = [
      'rgba(255, 92, 154, ',  // Pink Primary
      'rgba(255, 143, 184, ', // Pink Romantic
      'rgba(232, 75, 136, ',  // Pink Deep
      'rgba(255, 182, 218, ', // Pastel Rose
      'rgba(255, 214, 231, ', // Pink Pastel
      'rgba(255, 230, 240, ', // Soft White-Pink
      'rgba(212, 175, 55, '   // Gold accent
    ];
    const color = type === 'goldStar' 
      ? 'rgba(255, 215, 0, ' 
      : colorChoices[Math.floor(Math.random() * colorChoices.length)];

    return {
      type,
      x: startX,
      baseX: startX,
      y: startY,
      size,
      speedY: 0.45 + Math.random() * 0.9, // Continuous gentle upward float
      swayAmp: 12 + Math.random() * 24,   // Sine wave sway amplitude
      swayFreq: 0.012 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.5,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      opacity: 0.35 + Math.random() * 0.55, // Much more visible and prominent!
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      color
    };
  }

  setConvergeMode(enabled, targetX = this.width / 2, targetY = this.height / 2) {
    this.isConverging = enabled;
    this.convergeTarget = { x: targetX, y: targetY };
  }

  // Draw smooth, beautiful romantic heart with Bezier curves
  drawHeart(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color + opacity + ')';
    ctx.beginPath();
    
    // Proportional Bezier heart
    const topCurveHeight = size * 0.35;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight * 1.1,
      -size, size / 3,
      0, size
    );
    ctx.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight * 1.1,
      0, topCurveHeight
    );
    ctx.closePath();
    ctx.fill();

    // Subtle soft glossy highlight on top curve of the heart
    if (size > 16 && opacity > 0.4) {
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.45})`;
      ctx.beginPath();
      ctx.arc(-size * 0.3, 0, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw 4-point / 8-point twinkling sparkle
  drawSparkle(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color + opacity + ')';
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw cute Hello Kitty ribbon bow
  drawBow(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color + opacity + ')';

    const w = size * 0.7;
    const h = size * 0.5;

    // Left wing
    ctx.beginPath();
    ctx.ellipse(-w * 0.6, 0, w * 0.55, h * 0.5, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.ellipse(w * 0.6, 0, w * 0.55, h * 0.5, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Center knot
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  animate() {
    this.time += 1;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Update & Render Ambient Continuous Floating Hearts
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.pulse += p.pulseSpeed;
      p.rotation += p.rotationSpeed;
      const currentOpacity = Math.max(0.15, Math.min(0.95, p.opacity * (0.85 + 0.25 * Math.sin(p.pulse))));

      if (this.isConverging) {
        // Converge dynamically toward target during transition
        const dx = this.convergeTarget.x - p.x;
        const dy = this.convergeTarget.y - p.y;
        p.x += dx * 0.045;
        p.y += dy * 0.045;
        p.size *= 0.985;
        if (Math.hypot(dx, dy) < 25 || p.size < 0.8) {
          this.particles[i] = this.createParticle(true);
        }
      } else {
        // Continuous, graceful upward float with sinusoidal wave
        p.y -= p.speedY;
        p.x = p.baseX + Math.sin(this.time * p.swayFreq + p.phase) * p.swayAmp;

        // Loop seamlessly from bottom when exiting top (NEVER CUTS OFF)
        if (p.y < -40) {
          this.particles[i] = this.createParticle(true);
        }
      }

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, currentOpacity, p.rotation);
      } else if (p.type === 'bow') {
        this.drawBow(this.ctx, p.x, p.y, p.size, p.color, currentOpacity, p.rotation);
      } else {
        this.drawSparkle(this.ctx, p.x, p.y, p.size, p.color, currentOpacity, p.rotation);
      }
    }

    // 2. Update & Render Touch/Pointer Interactive Particles
    for (let i = this.touchParticles.length - 1; i >= 0; i--) {
      const tp = this.touchParticles[i];
      tp.x += tp.speedX;
      tp.y += tp.speedY;
      tp.rotation += tp.rotationSpeed;
      tp.life -= tp.decay;

      if (tp.life <= 0) {
        this.touchParticles.splice(i, 1);
        continue;
      }

      const currentOpacity = Math.max(0, tp.opacity * tp.life);
      if (tp.type === 'heart') {
        this.drawHeart(this.ctx, tp.x, tp.y, tp.size, tp.color, currentOpacity, tp.rotation);
      } else {
        this.drawSparkle(this.ctx, tp.x, tp.y, tp.size, 'rgba(255, 215, 0, ', currentOpacity, tp.rotation);
      }
    }

    // 3. Update & Render Continuous Celebration Cascade (Scene 8)
    if (this.isCelebrationActive) {
      this.updateCelebration();
    }

    requestAnimationFrame(() => this.animate());
  }

  // Continuous Romantic Celebration Cascade (Does NOT cut off!)
  triggerCelebration(mode = 'full') {
    this.isCelebrationActive = true;

    // Initial festive burst using canvas-confetti if present
    if (typeof confetti === 'function') {
      const colors = ['#FF4D88', '#FF8FB8', '#FFD700', '#FFF9FC', '#FFB6C1', '#FF69B4'];
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.55 },
        colors: colors,
        disableForReducedMotion: true
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.65 },
          colors: colors
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.65 },
          colors: colors
        });
      }, 350);
    }

    // Spawn a continuous shower of gentle falling rose petals, hearts, and golden stars
    if (this.celebrationParticles.length < 50) {
      for (let i = 0; i < 60; i++) {
        this.celebrationParticles.push(this.createCelebrationParticle(false));
      }
    }
  }

  createCelebrationParticle(fromTop = true) {
    const types = ['heart', 'petal', 'star'];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * this.width;
    const y = fromTop ? (-30 - Math.random() * 60) : (Math.random() * this.height);

    const colors = [
      'rgba(255, 77, 136, ',
      'rgba(255, 143, 184, ',
      'rgba(255, 215, 0, ',
      'rgba(255, 182, 193, ',
      'rgba(255, 105, 180, '
    ];

    return {
      type,
      x,
      baseX: x,
      y,
      size: type === 'heart' ? (10 + Math.random() * 16) : (8 + Math.random() * 14),
      speedY: 1.2 + Math.random() * 1.8, // Gently drifting down
      swayAmp: 15 + Math.random() * 30,
      swayFreq: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      opacity: 0.5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  updateCelebration() {
    for (let i = 0; i < this.celebrationParticles.length; i++) {
      const p = this.celebrationParticles[i];
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.x = p.baseX + Math.sin(this.time * p.swayFreq + p.phase) * p.swayAmp;

      // When reaching bottom, seamlessly respawn at the top for NON-STOP CELEBRATION!
      if (p.y > this.height + 40) {
        this.celebrationParticles[i] = this.createCelebrationParticle(true);
      }

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else if (p.type === 'star') {
        this.drawSparkle(this.ctx, p.x, p.y, p.size, 'rgba(255, 215, 0, ', p.opacity, p.rotation);
      } else {
        // Gentle flower petal
        this.drawPetal(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      }
    }
  }

  drawPetal(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color + opacity + ')';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.45, size * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Global instance
window.romanticAtmosphere = new RomanticAtmosphereManager();
