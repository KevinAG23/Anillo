/**
 * Main Application Orchestrator & Narrative State Machine
 * Coordinates narrative scenes, seamless transitions, and user choices.
 * (100% focused on romantic visuals and rich animations, zero audio)
 */

// ============================================================================
// CONFIGURACIÓN PARA RECIBIR LA RESPUESTA
// Si quieres que el botón de WhatsApp te envíe el mensaje directamente a tu número,
// escribe aquí tu número con código de país (ejemplo Ecuador: '593987654321' o México: '52155...').
// Si lo dejas vacío (''), abrirá WhatsApp para que ella elija tu chat con el mensaje listo.
// ============================================================================
const NOTIFICATION_CONFIG = {
  whatsappPhone: '', // <-- Tu número de WhatsApp aquí (opcional)
  webhookUrl: ''     // <-- Webhook opcional (Discord / Formspree / Telegram)
};

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
    this.btnSendWhatsApp = document.getElementById('btn-send-whatsapp');
    this.btnChooseAgain = document.getElementById('btn-choose-again');

    // Replay controls
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

    // 4. Declaration Choices (Can choose and switch as many times as she wants)
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

    // 5. Button to switch / choose another option
    if (this.btnChooseAgain) {
      this.btnChooseAgain.addEventListener('click', () => {
        this.resetChoiceButtons();
      });
    }

    // 6. Navigation: Volver a ver el anillo (permite volver a la declaración después)
    if (this.btnReplayRing) {
      this.btnReplayRing.addEventListener('click', () => {
        this.resetChoiceButtons();
        this.goToScene('scene-ring');
      });
    }

    // 7. Navigation: Explorar las estrellas nuevamente (prepara la animación del regalo y anillo para repetirse)
    if (this.btnReplaySphere) {
      this.btnReplaySphere.addEventListener('click', () => {
        // Re-generar las tarjetas de la esfera
        if (this.sphereManager) {
          this.sphereManager.createCards();
        }
        // Reiniciar la caja de regalo para que al avanzar salga NUEVAMENTE la animación completa del anillo
        if (window.goldenRingManager) {
          window.goldenRingManager.resetBox();
        }
        // Preparar las opciones de la declaración para la próxima visita
        this.resetChoiceButtons();

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

    // Preparar el enlace directo de WhatsApp con la respuesta seleccionada
    if (this.btnSendWhatsApp) {
      const respText = type === 'yes'
        ? '¡Sí, me encantaría! 💕'
        : 'Sigamos conociéndonos paso a paso 🌷';
      const defaultMsg = `Hola ♡ Acabo de ver la sorpresa tan hermosa del anillo... y mi respuesta es: ${respText} ✨`;
      const encodedMsg = encodeURIComponent(defaultMsg);

      if (NOTIFICATION_CONFIG.whatsappPhone && NOTIFICATION_CONFIG.whatsappPhone.trim() !== '') {
        const cleanPhone = NOTIFICATION_CONFIG.whatsappPhone.replace(/[^0-9]/g, '');
        this.btnSendWhatsApp.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
      } else {
        this.btnSendWhatsApp.href = `https://api.whatsapp.com/send?text=${encodedMsg}`;
      }
    }

    // Notificación en segundo plano (guarda en localStorage y opcionalmente dispara webhook)
    this.recordResponseLocally(type);
    if (NOTIFICATION_CONFIG.webhookUrl) {
      this.sendSilentNotification(type);
    }

    // Disparar cascada de celebración continua
    if (window.romanticAtmosphere) {
      window.romanticAtmosphere.triggerCelebration(type);
    }
  }

  recordResponseLocally(type) {
    try {
      const history = JSON.parse(localStorage.getItem('romantic_responses') || '[]');
      history.push({
        choice: type,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('romantic_responses', JSON.stringify(history));
    } catch (e) {}
  }

  sendSilentNotification(type) {
    try {
      fetch(NOTIFICATION_CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'romantic_choice_selected',
          choice: type,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      }).catch(() => {});
    } catch (e) {}
  }

  resetChoiceButtons() {
    if (this.optionsGrid) {
      this.optionsGrid.style.display = 'flex';
    }
    if (this.celebrationOutcome) {
      this.celebrationOutcome.classList.remove('visible');
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

    // Scroll al tope de la escena destino
    targetScene.scrollTop = 0;
  }
}

// Boot application upon DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appNarrative = new RomanticNarrativeController();
});
