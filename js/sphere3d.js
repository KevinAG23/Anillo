/**
 * Fibonacci Sphere 3D Engine & Lightbox Manager
 * Implements mathematical spherical distribution, touch drag, inertia damping,
 * camera perspective, depth attenuation, and interactive modal transitions.
 */

class FibonacciSphereManager {
  constructor(viewportId = 'sphere-viewport', worldId = 'sphere-world') {
    this.viewport = document.getElementById(viewportId);
    this.world = document.getElementById(worldId);
    this.cardsData = [
      {
        id: 1,
        title: "Un destello en mi rutina",
        message: "Desde que llegaste, hay algo más bonito en mis días.",
        img: "Imagenes/dvAz5GIfEVTztzVOu3T0EmIRMI6DkHfhmuwLzUXzDNI2NxqwtkifaC3P3_MdFgyC1sU6NMPYkpdKqbWOYJEApDzljdszu6_GdNz1LFqCB7S4lZVQ0HbfqCdwuJ1vXmDIi1lqSGVA2WD8pQaIM5DlnMSeMobhkv4hw6NzSVzKKjvDMFJC14yCZEgWNoujyJcM.jpg"
      },
      {
        id: 2,
        title: "Tu magia especial",
        message: "Tu sonrisa tiene esa magia de mejorar cualquier momento.",
        img: "Imagenes/75135705c67e2e7f223b94a5e967e13d.jpg"
      },
      {
        id: 3,
        title: "Coincidir contigo",
        message: "Entre tantas casualidades, qué bonito haber coincidido contigo.",
        img: "Imagenes/Hello_Kitty.webp"
      },
      {
        id: 4,
        title: "Alguien única",
        message: "Hay personas que se vuelven especiales sin siquiera intentarlo. Tú eres una de ellas.",
        img: "Imagenes/ieP699VN72ey6sm4yBRZpRzmUrNmLmKJc5D2Sl6HicYNGJKlhq_e7gXzaw3K9ouEG6fOybIDZv2NDOgBooH2EZaja5ZdFnm2nwh9qxML0km-WG-UtLYzhiXDIA7p775UoanaCiqASDr82nAAELAsGPSea5YOKOBGR9uiMKlxG5FzBeFiK56ntlSqUPNp-Dlj.jpg"
      },
      {
        id: 5,
        title: "Pequeños momentos",
        message: "Me gusta cómo haces que lo sencillo se sienta extraordinario.",
        img: "Imagenes/cf30cf427312bb9c78b2d5baefea7c8b.jpg"
      },
      {
        id: 6,
        title: "Un deseo sincero",
        message: "Si pudiera pedir un deseo, sería seguir compartiendo sonrisas contigo.",
        img: "Imagenes/f83f82ac-fb5e-4341-9400-10a1364d6bc0.avif"
      },
      {
        id: 7,
        title: "Paz y complicidad",
        message: "No necesito un día perfecto; a veces basta con hablar contigo.",
        img: "Imagenes/images.jpg"
      },
      {
        id: 8,
        title: "Tu luz propia",
        message: "Tienes una luz que no se encuentra todos los días.",
        img: "Imagenes/4de517355433794b17804626cef27261.jpg"
      },
      {
        id: 9,
        title: "Tantas sonrisas",
        message: "Ojalá pudiera regalarte tantas sonrisas como las que tú me provocas.",
        img: "Imagenes/dc5452c787476f78b5956f6a73bf302d.jpg"
      },
      {
        id: 10,
        title: "Descubrir tu esencia",
        message: "Me encanta la idea de seguir descubriendo lo bonita que eres por dentro.",
        img: "Imagenes/e8f58980ec98abb146ab03ca36ae6b3a.jpg"
      },
      {
        id: 11,
        title: "Una razón para sonreír",
        message: "Quisiera convertirme en una razón más para que sonrías.",
        img: "Imagenes/images (1).jpg"
      },
      {
        id: 12,
        title: "La ilusión del mañana",
        message: "No sé qué nos depara el futuro, pero me ilusiona imaginar momentos contigo.",
        img: "Imagenes/jfTL5id-Kv1iflwVJsnK2m8M2zVl1RxO6erm_Hs-3YP20LUxsVdhqR93-TwxUSTP5z_KplpsWr8F7xuMj-GLZzp2J0Hz7Oav1Ivml0dWNKSYv0BPodzKCYBT6ILSV421UkjDp3nO9LjlT_-Nqckuj1MzCC2DGJjc0nEhp9BaJEsizCF_ssRAqBg83IZ4qga3.jpg"
      }
    ];

    this.cardElements = [];
    this.rotX = 0;
    this.rotY = 0;
    this.velX = 0;
    this.velY = 0;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.sphereRadius = 180;
    this.perspective = 850;
    this.animationFrameId = null;

    // Lightbox modal elements
    this.modal = document.getElementById('lightbox-modal');
    this.modalImg = document.getElementById('lightbox-img');
    this.modalNum = document.getElementById('lightbox-num');
    this.modalTitle = document.getElementById('lightbox-title');
    this.modalMsg = document.getElementById('lightbox-msg');
    this.modalClose = document.getElementById('lightbox-close');

    this.init();
  }

  init() {
    if (!this.viewport || !this.world) return;
    this.calculateRadius();
    window.addEventListener('resize', () => {
      this.calculateRadius();
    }, { passive: true });

    this.createCards();
    this.setupInteractions();
    this.setupLightbox();
    this.startRenderLoop();
  }

  calculateRadius() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minDim = Math.min(width, height);
    if (width < 600) {
      // Mobile viewport
      this.sphereRadius = Math.max(130, Math.min(minDim * 0.38, 175));
    } else {
      // Tablet / Desktop
      this.sphereRadius = Math.max(180, Math.min(minDim * 0.32, 270));
    }
  }

  createCards() {
    this.world.innerHTML = '';
    this.cardElements = [];

    const N = this.cardsData.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden Angle (~137.5 deg)

    for (let i = 0; i < N; i++) {
      const data = this.cardsData[i];

      // Fibonacci Sphere Coordinates
      const y = 1 - (i / Math.max(1, N - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * goldenAngle;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Card DOM node
      const cardEl = document.createElement('div');
      cardEl.className = 'sphere-card';
      cardEl.dataset.index = i;
      cardEl.innerHTML = `
        <div class="sphere-card-img-wrap">
          <img src="${data.img}" alt="${data.title}" class="sphere-card-img" loading="eager" />
        </div>
        <div class="sphere-card-info">
          <div class="sphere-card-num">#${String(data.id).padStart(2, '0')} ♡</div>
          <div class="sphere-card-snippet">${data.title}</div>
        </div>
      `;

      cardEl.addEventListener('click', (e) => {
        // Prevent opening if the user was just dragging
        if (Math.abs(this.velX) > 0.008 || Math.abs(this.velY) > 0.008) return;
        this.openLightbox(data);
      });

      this.world.appendChild(cardEl);
      this.cardElements.push({
        el: cardEl,
        x,
        y,
        z,
        data
      });
    }
  }

  setupInteractions() {
    const onStart = (x, y) => {
      this.isDragging = true;
      this.lastPointerX = x;
      this.lastPointerY = y;
      this.velX = 0;
      this.velY = 0;
    };

    const onMove = (x, y) => {
      if (!this.isDragging) return;
      const deltaX = x - this.lastPointerX;
      const deltaY = y - this.lastPointerY;

      // Sensitivity tuning
      const factor = window.innerWidth < 600 ? 0.0065 : 0.0045;
      this.velX = deltaX * factor;
      this.velY = -deltaY * factor;

      this.rotY += this.velX;
      this.rotX = Math.max(-0.65, Math.min(0.65, this.rotX + this.velY));

      this.lastPointerX = x;
      this.lastPointerY = y;
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    // Pointer Events (supports Touch & Mouse unified)
    this.viewport.addEventListener('pointerdown', (e) => {
      onStart(e.clientX, e.clientY);
      this.viewport.setPointerCapture(e.pointerId);
    }, { passive: true });

    this.viewport.addEventListener('pointermove', (e) => {
      onMove(e.clientX, e.clientY);
    }, { passive: true });

    this.viewport.addEventListener('pointerup', (e) => {
      onEnd();
      try { this.viewport.releasePointerCapture(e.pointerId); } catch(err) {}
    }, { passive: true });

    this.viewport.addEventListener('pointercancel', (e) => {
      onEnd();
    }, { passive: true });
  }

  setupLightbox() {
    if (!this.modal) return;

    const closeHandler = () => {
      this.modal.classList.remove('active');
    };

    if (this.modalClose) {
      this.modalClose.addEventListener('click', closeHandler);
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        closeHandler();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        closeHandler();
      }
    });
  }

  openLightbox(data) {
    if (this.modalImg) this.modalImg.src = data.img;
    if (this.modalNum) this.modalNum.textContent = `Detalle #${String(data.id).padStart(2, '0')} ♡`;
    if (this.modalTitle) this.modalTitle.textContent = data.title;
    if (this.modalMsg) this.modalMsg.textContent = data.message;
    if (this.modal) this.modal.classList.add('active');
  }

  startRenderLoop() {
    const loop = () => {
      // Continuous cosmic orbit & inertia damping (Never stops rotating!)
      if (!this.isDragging) {
        this.rotY += this.velX + 0.0022;
        this.rotX = Math.max(-0.65, Math.min(0.65, this.rotX + this.velY));

        this.velX *= 0.94; // Smooth damping
        this.velY *= 0.94;
      }

      this.updateCardTransforms();
      this.animationFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  updateCardTransforms() {
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);
    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);

    for (let i = 0; i < this.cardElements.length; i++) {
      const card = this.cardElements[i];

      // 1. Rotate around Y axis
      const rx1 = card.x * cosY + card.z * sinY;
      const rz1 = -card.x * sinY + card.z * cosY;
      const ry1 = card.y;

      // 2. Rotate around X axis
      const ry2 = ry1 * cosX - rz1 * sinX;
      const rz2 = ry1 * sinX + rz1 * cosX;
      const rx2 = rx1;

      // 3. Project to pixels
      const px = rx2 * this.sphereRadius;
      const py = ry2 * this.sphereRadius;
      const pz = rz2 * this.sphereRadius;

      // 4. Perspective factor
      const factor = this.perspective / (this.perspective - pz);
      const scale = Math.max(0.42, Math.min(1.28, factor));

      // 5. Depth attenuation
      const normZ = (pz + this.sphereRadius) / (2 * this.sphereRadius); // 0 (back) to 1 (front)
      const opacity = 0.35 + 0.65 * Math.pow(normZ, 1.4);
      const zIndex = Math.round(normZ * 1000);
      const blur = (1 - normZ) * 2.2;
      const brightness = 0.7 + 0.3 * normZ;

      // Hardware accelerated transform
      card.el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) scale(${scale.toFixed(3)})`;
      card.el.style.opacity = opacity.toFixed(2);
      card.el.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;
      card.el.style.zIndex = zIndex;
      card.el.style.pointerEvents = normZ > 0.4 ? 'auto' : 'none';
    }
  }

  // Animation to explode cards gently into stardust during Scene 4 transition
  disperseIntoStardust(onComplete) {
    let progress = 0;
    const duration = 900;
    const startTime = performance.now();

    const animateDisperse = (time) => {
      progress = Math.min(1, (time - startTime) / duration);
      const expandFactor = 1 + progress * 2.5;

      for (let i = 0; i < this.cardElements.length; i++) {
        const card = this.cardElements[i];
        card.el.style.opacity = (1 - progress).toFixed(2);
        card.el.style.transform += ` scale(${1 - progress * 0.5})`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateDisperse);
      } else {
        if (typeof onComplete === 'function') onComplete();
      }
    };

    requestAnimationFrame(animateDisperse);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Global instance
window.FibonacciSphereManager = FibonacciSphereManager;
