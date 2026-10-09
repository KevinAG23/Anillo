/**
 * Ambient Particle & Romance Atmosphere Engine
 * Renders glowing hearts, golden stardust, bokeh orbs, and confetti.
 */

class RomanticAtmosphereManager {
  constructor(canvasId = 'ambient-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isConverging = false;
    this.convergeTarget = { x: this.width / 2, y: this.height / 2 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Spawn initial atmospheric particles
    const count = window.innerWidth < 600 ? 40 : 70;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.convergeTarget = { x: this.width / 2, y: this.height / 2 };
  }

  createParticle(fromBottom = false) {
    const types = ['heart', 'sparkle', 'orb', 'goldStar'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = type === 'heart' ? (8 + Math.random() * 10) : (2 + Math.random() * 5);

    return {
      type,
      x: Math.random() * this.width,
      y: fromBottom ? this.height + 20 : Math.random() * this.height,
      size,
      speedY: 0.3 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.2 + Math.random() * 0.6,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      color: type === 'goldStar'
        ? 'rgba(212, 175, 55, '
        : (Math.random() > 0.4 ? 'rgba(255, 92, 154, ' : 'rgba(255, 143, 184, ')
    };
  }

  setConvergeMode(enabled, targetX = this.width / 2, targetY = this.height / 2) {
    this.isConverging = enabled;
    this.convergeTarget = { x: targetX, y: targetY };
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color + opacity + ')';
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, size / 3,
      0, size
    );
    // Right curve
    ctx.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

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

  drawOrb(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.fillStyle = color + (opacity * 0.5) + ')';
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.pulse += p.pulseSpeed;
      p.rotation += p.rotationSpeed;
      const currentOpacity = p.opacity * (0.8 + 0.2 * Math.sin(p.pulse));

      if (this.isConverging) {
        // Accelerate toward target center during transition
        const dx = this.convergeTarget.x - p.x;
        const dy = this.convergeTarget.y - p.y;
        p.x += dx * 0.04;
        p.y += dy * 0.04;
        p.size *= 0.98;
        if (Math.hypot(dx, dy) < 20 || p.size < 0.5) {
          this.particles[i] = this.createParticle(true);
        }
      } else {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.pulse) * 0.3;

        if (p.y < -30) {
          this.particles[i] = this.createParticle(true);
        }
      }

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, currentOpacity, p.rotation);
      } else if (p.type === 'sparkle' || p.type === 'goldStar') {
        this.drawSparkle(this.ctx, p.x, p.y, p.size, p.color, currentOpacity, p.rotation);
      } else {
        this.drawOrb(this.ctx, p.x, p.y, p.size, p.color, currentOpacity);
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  // Romantic Celebration Confetti & Sparkles
  triggerCelebration(mode = 'full') {
    if (typeof confetti === 'function') {
      const colors = ['#FF5C9A', '#FF8FB8', '#D4AF37', '#FFF9FC', '#FFD6E7'];

      // Burst 1: Center Explosion
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true
      });

      // Burst 2 & 3: Side Canons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.7 },
          colors: colors
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.7 },
          colors: colors
        });
      }, 300);

      // Heart shapes if supported
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 120,
          origin: { y: 0.5 },
          shapes: ['circle'],
          colors: ['#FF5C9A', '#D4AF37', '#FF8FB8']
        });
      }, 700);
    }
  }
}

// Global instance
window.romanticAtmosphere = new RomanticAtmosphereManager();
