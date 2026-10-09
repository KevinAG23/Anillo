# 🎀 Hello Kitty — Pink Romantic Dream — A Golden Ring for You 💍

Una experiencia web interactiva, cinematográfica, romántica y mobile-first inspirada en el universo de **Hello Kitty**, culminando con la revelación de un precioso anillo dorado.

---

## ✨ Características Principales

1. **Escena 1 — Bienvenida Romántica:**
   - Mensaje de bienvenida: *"Hay algo muy especial que quiero mostrarte... 🎀"*
   - Microinteracciones, atmósfera rosa pastel, Hello Kitty con halo y botón interactivo.
2. **Escena 2 — Universo 3D Fibonacci de Hello Kitty:**
   - Distribución matemática sobre una esfera 3D basada en la espiral de Fibonacci.
   - Rotación táctil y con mouse, inercia de movimiento, profundidad y atenuación de elementos posteriores.
   - Mensaje central con compensación de rotación: *"Entre tantas estrellas, mis ojos te encontraron a ti. ♡"*
3. **Escena 3 — Lightbox de Mensajes Románticos:**
   - Visualización ampliada con animaciones suaves, imágenes en alta resolución y las 12 frases dedicadas.
4. **Escena 4 & 5 — Transición y Caja de Regalo 3D:**
   - Dispersión de las estrellas hacia polvo dorado y convergencia de partículas al centro.
   - Caja de regalo rosa pastel con lazos dorados y emblema de Hello Kitty.
5. **Escena 6 & 7 — Revelación del Anillo Dorado (Máxima Prioridad):**
   - Apertura cinematográfica de la caja con haces de luz dorada y estrellas brillantes.
   - Presentación del anillo dorado con diamantes en forma de corazón (`images (2)`).
   - Efecto Parallax 3D interactivo al deslizar el dedo o mouse, destellos especulares.
   - Modo de vista alternativo: presentación en estuche de terciopelo con rosas.
   - Mensaje romántico progresivo.
6. **Escena 8 — Declaración Romántica y Celebración:**
   - Pregunta: *"¿Me permitirías seguir conquistando tu corazón? 💗"*
   - Dos opciones dulces y respetuosas: *"Sí, me encantaría 💕"* y *"Sigamos conociéndonos 🌷"*.
   - Celebración con lluvia de confeti, corazones y fanfarria musical.
7. **Música y Efectos de Sonido:**
   - Caja de música celestial sintetizada con Web Audio API (cero dependencias externas).
   - Botón flotante para activar o silenciar en cualquier momento.

---

## 🚀 Ejecución Local con Docker

Para construir y levantar el contenedor en `http://localhost:8080`:

```bash
docker compose up -d --build
```

O utilizando Docker directamente:

```bash
docker build -t hello-kitty-ring .
docker run -d -p 8080:80 --name hello-kitty-ring-app hello-kitty-ring
```

Accede a [http://localhost:8080](http://localhost:8080) desde tu navegador.

---

## 🌐 Publicación en GitHub Pages

El proyecto incluye el workflow automatizado `.github/workflows/deploy.yml`.

Al hacer push a la rama `main`:
1. GitHub Actions compila y valida los archivos estáticos.
2. Despliega automáticamente en GitHub Pages.

---

Con mucho cariño para una persona muy especial. ♡
