/**
 * Main Application Orchestrator & Narrative State Machine
 * Coordinates 8 narrative scenes, transitions, and user choices.
 */

class RomanticNarrativeController {
  constructor() {
    this.currentSceneId = 'scene-welcome';
    this.sphereManager = null;

    // Elements
    this.btnStart = document.getElementById('btn-start');
    this.btnToGift = document.getElementById('btn-to-gift');
    this.btnToDeclaration = document.getElementById('btn-to-declaration');
    this.btnAudioToggle = document.getElementById('btn-audio-toggle');
    this.audioIcon = document.getElementById('audio-icon');

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
    this.setupAudioControls();

    // Initialize 3D Sphere
    if (window.FibonacciSphereManager) {
      this.sphereManager = new window.FibonacciSphereManager();
    }
  }

  bindEvents() {
    // 1. Start from Welcome Screen
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => {
        // Unlock and start romantic music box
        if (window.romanticAudio) {
          window.romanticAudio.start();
          this.updateAudioButtonUI(true);
        }
        this.goToScene('scene-sphere');
      });
    }

    // 2. Transition from Sphere to Gift Box
    if (this.btnToGift) {
      this.btnToGift.addEventListener('click', () => {
        if (window.romanticAudio) {
          window.romanticAudio.playChime();
        }

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
        if (window.romanticAudio) {
          window.romanticAudio.playChime();
        }
        this.goToScene('scene-declaration');
      });
    }

    // 4. Declaration Choices
    if (this.btnChoiceYes) {
      this.btnChoiceYes.addEventListener('click', () => {
        this.handleChoice(
          'yes',
          '¡Me haces el más feliz del mundo! 💖',
          'Prometo que este será solo el comienzo de muchos momentos bonitos, sonrisas compartidas y detalles que te recuerden lo especial que eres para mí.'
        );
      });
    }

    if (this.btnChoicePace) {
      this.btnChoicePace.addEventListener('click', () => {
        this.handleChoice(
          'pace',
          'Qué bonita respuesta... 🌸',
          'Lo más bonito es que podamos disfrutar cada momento, sin prisa y con mucho cariño. Me ilusiona muchísimo seguir conociéndote paso a paso.'
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

    // Trigger celebration effects
    if (window.romanticAtmosphere) {
      window.romanticAtmosphere.triggerCelebration(type);
    }

    if (window.romanticAudio) {
      window.romanticAudio.playCelebration();
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
      }, 800);
    }

    targetScene.classList.add('active');
    this.currentSceneId = targetSceneId;

    // Scroll to top of target scene
    targetScene.scrollTop = 0;
  }

  setupAudioControls() {
    if (!this.btnAudioToggle) return;

    this.btnAudioToggle.addEventListener('click', () => {
      if (window.romanticAudio) {
        if (!window.romanticAudio.isPlaying) {
          window.romanticAudio.start();
          this.updateAudioButtonUI(true);
        } else {
          const isAudible = window.romanticAudio.toggleMute();
          this.updateAudioButtonUI(isAudible);
        }
      }
    });

    // Handle tab visibility to pause music gracefully
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (window.romanticAudio && window.romanticAudio.isPlaying && !window.romanticAudio.isMuted) {
          window.romanticAudio.toggleMute();
          this.updateAudioButtonUI(false);
        }
      }
    });
  }

  updateAudioButtonUI(isAudible) {
    if (!this.btnAudioToggle) return;
    if (isAudible) {
      this.btnAudioToggle.classList.add('audio-playing');
      if (this.audioIcon) this.audioIcon.textContent = '🎵';
      this.btnAudioToggle.title = 'Silenciar música';
    } else {
      this.btnAudioToggle.classList.remove('audio-playing');
      if (this.audioIcon) this.audioIcon.textContent = '🔇';
      this.btnAudioToggle.title = 'Activar música';
    }
  }
}

// Boot application upon DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appNarrative = new RomanticNarrativeController();
});
