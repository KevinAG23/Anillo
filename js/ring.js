/**
 * Golden Ring & Gift Box Interactive Engine
 * Handles 3D luxury gift box opening, golden ray bursting, interactive parallax tilt,
 * continuous specular flare reflections, and dual luxury presentation toggle.
 */

class GoldenRingManager {
  constructor() {
    // Gift Box Elements
    this.boxStage = document.getElementById('gift-box-stage');
    this.btnOpenBox = document.getElementById('btn-open-box');

    // Ring Presentation Elements
    this.ringStage = document.getElementById('ring-stage');
    this.ringPod = document.getElementById('ring-pod');
    this.ringDisplayImg = document.getElementById('ring-display-img');
    this.ringVelvetImg = document.getElementById('ring-velvet-img');
    this.btnViewToggle = document.getElementById('ring-view-toggle');

    // Tilt physics state
    this.tiltX = 0;
    this.tiltY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.isShowingVelvet = false;
    this.animFrameId = null;

    this.init();
  }

  init() {
    this.setupGiftBoxOpening();
    this.setupRingParallax();
    this.setupViewToggle();
    this.startPhysicsLoop();
  }

  setupGiftBoxOpening() {
    if (!this.btnOpenBox) return;

    this.btnOpenBox.addEventListener('click', () => {
      this.openGiftBox();
    });

    if (this.boxStage) {
      this.boxStage.addEventListener('click', () => {
        this.openGiftBox();
      });
    }
  }

  openGiftBox() {
    if (!this.boxStage || this.boxStage.classList.contains('opening')) return;

    // Trigger box opening 3D animation
    this.boxStage.classList.add('opening');

    // Trigger golden stardust convergence
    if (window.romanticAtmosphere) {
      window.romanticAtmosphere.setConvergeMode(true);
    }

    // Transition to Ring Scene after cinematic opening
    setTimeout(() => {
      if (window.romanticAtmosphere) {
        window.romanticAtmosphere.setConvergeMode(false);
      }
      if (window.appNarrative) {
        window.appNarrative.goToScene('scene-ring');
      }
    }, 1450);
  }

  setupRingParallax() {
    if (!this.ringStage || !this.ringPod) return;

    const handlePointerMove = (clientX, clientY) => {
      const rect = this.ringStage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (clientX - centerX) / (rect.width / 2);
      const normY = (clientY - centerY) / (rect.height / 2);

      // Tilt angles (degrees)
      this.targetTiltY = Math.max(-18, Math.min(18, normX * 18));
      this.targetTiltX = Math.max(-18, Math.min(18, -normY * 18));
    };

    // Pointer move / touch move over the stage
    this.ringStage.addEventListener('pointermove', (e) => {
      handlePointerMove(e.clientX, e.clientY);
    }, { passive: true });

    // Touch support for mobile devices
    this.ringStage.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Return gently to rest when pointer leaves
    this.ringStage.addEventListener('pointerleave', () => {
      this.targetTiltX = 0;
      this.targetTiltY = 0;
    });

    this.ringStage.addEventListener('touchend', () => {
      this.targetTiltX = 0;
      this.targetTiltY = 0;
    });
  }

  setupViewToggle() {
    if (!this.btnViewToggle) return;

    this.btnViewToggle.addEventListener('click', () => {
      this.isShowingVelvet = !this.isShowingVelvet;

      if (this.isShowingVelvet) {
        this.ringDisplayImg.style.opacity = '0';
        this.ringVelvetImg.classList.add('visible');
        this.btnViewToggle.innerHTML = `<span>💍</span> <span>Ver anillo en oro puro</span>`;
      } else {
        this.ringDisplayImg.style.opacity = '1';
        this.ringVelvetImg.classList.remove('visible');
        this.btnViewToggle.innerHTML = `<span>🌹</span> <span>Ver en estuche con rosas</span>`;
      }
    });
  }

  startPhysicsLoop() {
    const loop = () => {
      // Spring interpolation
      this.tiltX += (this.targetTiltX - this.tiltX) * 0.08;
      this.tiltY += (this.targetTiltY - this.tiltY) * 0.08;

      if (this.ringPod) {
        this.ringPod.style.transform = `perspective(750px) rotateX(${this.tiltX.toFixed(2)}deg) rotateY(${this.tiltY.toFixed(2)}deg) translateZ(12px)`;
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  resetBox() {
    if (this.boxStage) {
      this.boxStage.classList.remove('opening');
    }
  }
}

// Global instance
window.goldenRingManager = new GoldenRingManager();
