/**
 * Main Application Orchestrator & Narrative State Machine
 * Coordinates narrative scenes, seamless transitions, and user choices.
 * Features the playful escaping button for "Sigamos conociéndonos",
 * guaranteeing the romantic "Sí, me encantaría" outcome with no exit!
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
    this.declarationPromptBlock = document.getElementById('declaration-prompt-block');
    this.celebrationOutcome = document.getElementById('celebration-outcome');
    this.celebrationTitle = document.getElementById('celebration-title');
    this.celebrationText = document.getElementById('celebration-text');
    this.optionsGrid = document.querySelector('.declaration-options-grid');
    this.dodgeLockoutUntil = 0;

    // Replay controls
    this.btnReplayRing = document.getElementById('btn-replay-ring');
    this.btnReplaySphere = document.getElementById('btn-replay-sphere');

    // Escaping button state
    this.escapeCount = 0;
    this.escapePhrases = [
      'Sigamos conociéndonos 🌷',
      '¡Epa! No se vale 🤭',
      '¿Segura? Piénsalo bien 🙈',
      '¡El otro botón es más bonito! 💕',
      '¡Casi me atrapas! 😜',
      '¡Por aquí no! jeje 🌸',
      'Solo te queda decir que sí 🎀'
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupEscapingButton();

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
        if (window.romanticAtmosphere) {
          window.romanticAtmosphere.setConvergeMode(true);
        }

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
        this.resetChoiceButtons();
        this.goToScene('scene-declaration');
      });
    }

    // 4. "Sí, me encantaría 💕" (The only true selectable choice!)
    if (this.btnChoiceYes) {
      this.btnChoiceYes.addEventListener('click', (e) => {
        // Prevent accidental triggers when escaping button dodges!
        if (Date.now() < this.dodgeLockoutUntil) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          return;
        }

        this.handleChoice(
          'yes',
          '¡No te imaginas la ilusión que me da! 💖',
          'No sé exactamente qué pueda pasar más adelante, pero me muero de ganas por descubrirlo contigo. Quiero conocer todas tus facetas: tus momentos felices, pero también cuando estés irritada, molesta o con tu genio... porque hasta eso me encanta y me parece súper tierno de ti jeje. Prometo cuidar cada detalle y hacer que cada momento valga la pena. ♡'
        );
      });
    }

    // 5. Navigation: Volver a abrir el estuche y ver el anillo (resetea para revivir la animación)
    if (this.btnReplayRing) {
      this.btnReplayRing.addEventListener('click', () => {
        if (window.goldenRingManager) {
          window.goldenRingManager.resetBox();
        }
        this.resetChoiceButtons();
        this.goToScene('scene-gift-box');
      });
    }

    // 6. Navigation: Explorar las estrellas nuevamente (resetea para que la animación del regalo y anillo se repitan de nuevo)
    if (this.btnReplaySphere) {
      this.btnReplaySphere.addEventListener('click', () => {
        if (this.sphereManager) {
          this.sphereManager.createCards();
        }
        if (window.goldenRingManager) {
          window.goldenRingManager.resetBox();
        }
        this.resetChoiceButtons();
        this.goToScene('scene-sphere');
      });
    }
  }

  setupEscapingButton() {
    if (!this.btnChoicePace) return;

    const escapeAction = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Lock out "Sí, me encantaría" for 650ms so accidental touch release or synthetic click NEVER triggers it
      this.dodgeLockoutUntil = Date.now() + 650;
      if (this.btnChoiceYes) {
        this.btnChoiceYes.style.pointerEvents = 'none';
        setTimeout(() => {
          if (this.btnChoiceYes) this.btnChoiceYes.style.pointerEvents = 'auto';
        }, 550);
      }

      this.escapeCount++;

      // Change button text to playful teasing phrases
      const phraseIndex = Math.min(this.escapeCount, this.escapePhrases.length - 1);
      this.btnChoicePace.innerHTML = `<span>${this.escapePhrases[phraseIndex]}</span>`;

      // Safe displacement: ALWAYS dodge away from btnChoiceYes (right / down)!
      // Clamp displacement so it never leaves the card or crosses 'Sí'
      const isMobile = window.innerWidth < 480;
      const step = this.escapeCount % 4;
      let posX = 0;
      let posY = 0;

      if (isMobile) {
        // On mobile: dodge strictly downwards and slightly to the right, never left!
        switch (step) {
          case 1: posX = 35; posY = 45; break;
          case 2: posX = 10; posY = 65; break;
          case 3: posX = 30; posY = 80; break;
          default: posX = 15; posY = 50; break;
        }
      } else {
        switch (step) {
          case 1: posX = 80; posY = 35; break;
          case 2: posX = 105; posY = -15; break;
          case 3: posX = 70; posY = 55; break;
          default: posX = 60; posY = 20; break;
        }
      }

      this.btnChoicePace.style.transition = 'transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1)';
      this.btnChoicePace.style.transform = `translate(${posX}px, ${posY}px)`;

      // Make the "Sí, me encantaría" button grow slightly bigger and pulse more brightly
      if (this.btnChoiceYes) {
        const growthScale = Math.min(1.2, 1 + this.escapeCount * 0.04);
        this.btnChoiceYes.style.transform = `scale(${growthScale.toFixed(2)})`;
      }
    };

    // Trigger escape on touch, click, or hover so she can NEVER click it!
    this.btnChoicePace.addEventListener('pointerdown', escapeAction);
    this.btnChoicePace.addEventListener('touchstart', escapeAction, { passive: false });
    this.btnChoicePace.addEventListener('mouseenter', escapeAction);
    this.btnChoicePace.addEventListener('click', escapeAction);
  }

  handleChoice(type, title, text) {
    // Smoothly swap out the prompt block so the card doesn't overflow the mobile screen!
    if (this.declarationPromptBlock) {
      this.declarationPromptBlock.style.display = 'none';
    }

    if (this.celebrationTitle) this.celebrationTitle.textContent = title;
    if (this.celebrationText) this.celebrationText.textContent = text;
    if (this.celebrationOutcome) this.celebrationOutcome.classList.add('visible');

    // Trigger non-stop romantic celebration cascade
    if (window.romanticAtmosphere) {
      window.romanticAtmosphere.triggerCelebration('full');
    }
  }

  resetChoiceButtons() {
    // Restore prompt block
    if (this.declarationPromptBlock) {
      this.declarationPromptBlock.style.display = 'block';
    }
    if (this.optionsGrid) {
      this.optionsGrid.style.display = 'flex';
    }
    if (this.celebrationOutcome) {
      this.celebrationOutcome.classList.remove('visible');
    }

    // Reset escaping button position, text, and scaling
    this.escapeCount = 0;
    this.dodgeLockoutUntil = 0;
    if (this.btnChoicePace) {
      this.btnChoicePace.style.transform = 'translate(0, 0)';
      this.btnChoicePace.innerHTML = `<span>Sigamos conociéndonos 🌷</span>`;
    }
    if (this.btnChoiceYes) {
      this.btnChoiceYes.style.transform = 'scale(1)';
      this.btnChoiceYes.style.pointerEvents = 'auto';
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
