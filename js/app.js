/**
 * Main Application Orchestrator & Narrative State Machine
 * Coordinates narrative scenes, seamless transitions, and user choices.
 * (100% focused on romantic visuals and rich animations, zero audio)
 */

class RomanticNarrativeController {
  constructor() {
    this.currentSceneId = 'scene-welcome';
    this.sphereManager = null;

    // Elements
    this.btnStart = document.getElementById('btn-start');
    this.btnToGift = document.getElementById('btn-to-gift');
    this.btnToDeclaration = document.getElementById('btn-to-declaration');

    // Declaration choices
    this.btnChoiceYes = document.getElementById('btn-choice-yes');
    this.btnChoicePace = document.getElementById('btn-choice-pace');
    this.celebrationOutcome = document.getElementById('celebration-outcome');
    this.celebrationTitle = document.getElementById('celebration-title');
    this.celebrationText = document.getElementById('celebration-text');
    this.optionsGrid = document.querySelector('.declaration-options-grid');

    // Replay controls
    this.btnReplayStart = document.getElementById('btn-replay-start');
    this.btnReplayRing = document.getElementById('btn-replay-ring');
    this.btnReplaySphere = document.getElementById('btn-replay-sphere');

    this.init();
  }

  init() {
    this.bindEvents();

    // Initialize 3D Sphere
    if (window.FibonacciSphereManager) {
      this.sphereManager = new window.FibonacciSphereManager();
    }
  }

  bindEvents() {
    // 1. Start from Welcome Screen
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => {
        this.goToScene('scene-sphere');
      });
    }

    // 2. Transition from Sphere to Gift Box
    if (this.btnToGift) {
      this.btnToGift.addEventListener('click', () => {
        // Particle converge effect
        if (window.romanticAtmosphere) {
          window.romanticAtmosphere.setConvergeMode(true);
        }

        // Disperse sphere cards into stardust
        if (this.sphereManager) {
          this.sphereManager.disperseIntoStardust(() => {
            this.goToScene('scene-gift-box');
            if (window.romanticAtmosphere) {
              window.romanticAtmosphere.setConvergeMode(false);
            }
          });
        } else {
          this.goToScene('scene-gift-box');
        }
      });
    }

    // 3. Transition from Ring to Declaration
    if (this.btnToDeclaration) {
      this.btnToDeclaration.addEventListener('click', () => {
        this.goToScene('scene-declaration');
      });
    }

    // 4. Declaration Choices
    if (this.btnChoiceYes) {
      this.btnChoiceYes.addEventListener('click', () => {
        this.handleChoice(
          'yes',
          '¡No te imaginas la ilusión que me da! 💖',
          'No sé exactamente qué pueda pasar más adelante, pero me muero de ganas por descubrirlo contigo. Quiero conocer todas tus facetas: tus momentos felices, pero también cuando estés irritada, molesta o con tu genio... porque hasta eso me encanta y me parece súper tierno de ti jeje. Prometo cuidar cada detalle y hacer que cada momento valga la pena. ♡'
        );
      });
    }

    if (this.btnChoicePace) {
      this.btnChoicePace.addEventListener('click', () => {
        this.handleChoice(
          'pace',
          'Paso a paso, con todo el corazón... 🌸',
          'Sin prisas y disfrutando cada instante. Quiero conocerte de verdad: en tus días alegres y también cuando andes molesta o irritada, porque me gusta todo de ti jeje. Me hace demasiada ilusión seguir compartiendo momentos a tu lado. ♡'
        );
      });
    }

    // 5. Replay Navigation
    if (this.btnReplayStart) {
      this.btnReplayStart.addEventListener('click', () => {
        this.resetExperience();
        this.goToScene('scene-welcome');
      });
    }

    if (this.btnReplayRing) {
      this.btnReplayRing.addEventListener('click', () => {
        this.goToScene('scene-ring');
      });
    }

    if (this.btnReplaySphere) {
      this.btnReplaySphere.addEventListener('click', () => {
        if (this.sphereManager) {
          this.sphereManager.createCards();
        }
        this.goToScene('scene-sphere');
      });
    }
  }

  handleChoice(type, title, text) {
    if (this.optionsGrid) {
      this.optionsGrid.style.display = 'none';
    }

    if (this.celebrationTitle) this.celebrationTitle.textContent = title;
    if (this.celebrationText) this.celebrationText.textContent = text;
    if (this.celebrationOutcome) this.celebrationOutcome.classList.add('visible');

    // Trigger non-stop romantic celebration cascade
    if (window.romanticAtmosphere) {
      window.romanticAtmosphere.triggerCelebration(type);
    }
  }

  resetExperience() {
    // Reset celebration card
    if (this.optionsGrid) {
      this.optionsGrid.style.display = 'flex';
    }
    if (this.celebrationOutcome) {
      this.celebrationOutcome.classList.remove('visible');
    }

    // Reset box opening
    if (window.goldenRingManager) {
      window.goldenRingManager.resetBox();
    }

    // Reset cards in sphere
    if (this.sphereManager) {
      this.sphereManager.createCards();
    }
  }

  goToScene(targetSceneId) {
    const currentScene = document.getElementById(this.currentSceneId);
    const targetScene = document.getElementById(targetSceneId);

    if (!targetScene || targetSceneId === this.currentSceneId) return;

    if (currentScene) {
      currentScene.classList.remove('active');
      currentScene.classList.add('exit-prev');
      setTimeout(() => {
        currentScene.classList.remove('exit-prev');
      }, 850);
    }

    targetScene.classList.add('active');
    this.currentSceneId = targetSceneId;

    // Scroll to top of target scene
    targetScene.scrollTop = 0;
  }
}

// Boot application upon DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appNarrative = new RomanticNarrativeController();
});
