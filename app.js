/**
 * bloon — AI Venture Studio Landing Page Scripts
 * Includes CurvedLoop React Bits Marquee Component (Vanilla JS Engine), 
 * GSAP Animations, Typewriter Intro, Magnetic Interactivity, Sea Canvas Background, 
 * Drawer Control & Keyboard Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const linkProducts = document.getElementById('link-products');
  const linkHiring = document.getElementById('link-hiring');
  const drawerProducts = document.getElementById('drawer-products');
  const drawerHiring = document.getElementById('drawer-hiring');
  const closeProducts = document.getElementById('close-products');
  const closeHiring = document.getElementById('close-hiring');
  const backdropProducts = document.getElementById('backdrop-products');
  const backdropHiring = document.getElementById('backdrop-hiring');

  const keyHintP = document.getElementById('key-hint-p');
  const keyHintH = document.getElementById('key-hint-h');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  // 1. Animated Sea Vibe Background Canvas Engine
  initSeaCanvas();

  // 2. 2D Sea Horizon Waves Canvas Animation Engine
  init2DSeaAnimation();

  // 3. Minimalist Rain & Clouds Engine
  initRainClouds();

  function initRainClouds() {
    const canvas = document.getElementById('rain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    // ── Rain drop pool — full-width, spawns from top of screen ───────────────
    const DROP_COUNT = 120;
    const drops = Array.from({ length: DROP_COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,          // stagger initial positions
      speed: 2.2 + Math.random() * 2.6,
      len:   14 + Math.random() * 20,
      alpha: 0.18 + Math.random() * 0.20
    }));

    function render() {
      ctx.clearRect(0, 0, W, H);

      drops.forEach(drop => {
        drop.y += drop.speed;
        if (drop.y > H + drop.len) {
          drop.y = -drop.len;
          drop.x = Math.random() * W;
        }

        // Fade near the top (first 15% of screen) and near the bottom (last 10%)
        const topFade    = Math.min(1, drop.y / (H * 0.15));
        const bottomFade = Math.min(1, (H - drop.y) / (H * 0.10));
        const alpha      = drop.alpha * topFade * bottomFade;

        ctx.beginPath();
        ctx.moveTo(drop.x,       drop.y);
        ctx.lineTo(drop.x + 1.0, drop.y + drop.len);
        ctx.strokeStyle = `rgba(160, 185, 210, ${alpha.toFixed(3)})`;
        ctx.lineWidth   = 1.0;
        ctx.lineCap     = 'round';
        ctx.stroke();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  function init2DSeaAnimation() {
    const canvas = document.getElementById('sea-waves-2d-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.18);

    window.addEventListener('resize', () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight * 0.18;
    });

    // 4 layered waves that perfectly fill the anchored strip
    const layers = [
      { color: 'rgba(10,  61, 98,  0.13)', speed: 0.012, length: 0.005, amplitude: 18, offsetY: 0.12 },
      { color: 'rgba(30,  90, 168, 0.22)', speed: 0.018, length: 0.007, amplitude: 22, offsetY: 0.32 },
      { color: 'rgba(59, 130, 246, 0.36)', speed: 0.024, length: 0.009, amplitude: 28, offsetY: 0.54 },
      { color: 'rgba(124,203, 255, 0.60)', speed: 0.030, length: 0.013, amplitude: 20, offsetY: 0.74 }
    ];

    // Subtle floating foam specks
    const bubbles = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.8,
      speed: Math.random() * 0.35 + 0.15,
      alpha: Math.random() * 0.45 + 0.15
    }));

    let step = 0;

    function drawLayer(layer, time) {
      ctx.beginPath();
      ctx.fillStyle = layer.color;
      const baseY = height * layer.offsetY;
      ctx.moveTo(0, height);
      ctx.lineTo(0, baseY);
      for (let x = 0; x <= width; x += 6) {
        ctx.lineTo(x, baseY + Math.sin(x * layer.length + time) * layer.amplitude);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }

    function render2DSea() {
      step += 0.025;
      ctx.clearRect(0, 0, width, height);

      layers.forEach(l => drawLayer(l, step * l.speed * 35));

      ctx.fillStyle = 'rgba(124, 203, 255, 0.55)';
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(step + b.r) * 0.3;
        if (b.y < -6) {
          b.y = height + 6;
          b.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.globalAlpha = b.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      requestAnimationFrame(render2DSea);
    }

    render2DSea();
  }

  function initSeaCanvas() {
    const canvas = document.getElementById('sea-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    // Floating Sea Mist / Bioluminescent Specks
    const particleCount = 35;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    let time = 0;

    function renderSea() {
      time += 0.012;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Base Calm Water Waves Caustics (Layer 1)
      const grad1 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.8) * 80,
        height * 0.3 + Math.cos(time * 0.6) * 60,
        50,
        width * 0.5,
        height * 0.3,
        width * 0.7
      );
      grad1.addColorStop(0, 'rgba(191, 239, 255, 0.35)');
      grad1.addColorStop(0.5, 'rgba(124, 203, 255, 0.15)');
      grad1.addColorStop(1, 'rgba(248, 252, 255, 0)');

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Deep Water Reflection (Layer 2)
      const grad2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(time * 0.7) * 90,
        height * 0.7 + Math.sin(time * 0.5) * 70,
        30,
        width * 0.8,
        height * 0.7,
        width * 0.6
      );
      grad2.addColorStop(0, 'rgba(124, 203, 255, 0.25)');
      grad2.addColorStop(1, 'rgba(248, 252, 255, 0)');

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Mouse Light Reflection Glow
      const mouseGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        280
      );
      mouseGrad.addColorStop(0, 'rgba(143, 231, 255, 0.22)');
      mouseGrad.addColorStop(0.6, 'rgba(124, 203, 255, 0.06)');
      mouseGrad.addColorStop(1, 'rgba(248, 252, 255, 0)');

      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Floating Sea Particles
      ctx.fillStyle = '#7CCBFF';
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += Math.sin(time + i) * 0.4;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      requestAnimationFrame(renderSea);
    }

    renderSea();
  }

  // 2. Typewriter Intro Effect for "Bloon" with GSAP Integration
  const brandTitle = document.getElementById('brand-title');
  if (brandTitle) {
    const fullText = 'Bloon';
    brandTitle.innerHTML = `<span id="typed-text"></span><span class="type-cursor" id="type-cursor">|</span>`;
    const typedTextSpan = document.getElementById('typed-text');
    const typeCursor = document.getElementById('type-cursor');

    let charIndex = 0;
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          typedTextSpan.textContent += fullText.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Line indicating type vanishes immediately when finished
          if (typeCursor) {
            typeCursor.style.display = 'none';
          }

          // Trigger GSAP Sub-Headline Entrance Reveal
          if (typeof gsap !== 'undefined') {
            gsap.fromTo('.hero-statement', 
              { autoAlpha: 0, y: 16 }, 
              { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );

            gsap.fromTo('.action-links', 
              { autoAlpha: 0, y: 16 }, 
              { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power2.out' }
            );
          }
        }
      }, 140);
    }, 150);
  }

  // 3. GSAP Core Animations & Magnetic Interactions
  if (typeof gsap !== 'undefined') {
    // Header Entrance Animation Timeline
    const tlHeader = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tlHeader.fromTo('.studio-header', 
      { autoAlpha: 0, y: -12 }, 
      { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.1 }
    );

    // GSAP Magnetic Hover Effect for Buttons and Links (gsap.quickTo)
    const magneticElems = document.querySelectorAll('.text-link, .key-chip, .close-btn');
    magneticElems.forEach((elem) => {
      const xTo = gsap.quickTo(elem, 'x', { duration: 0.35, ease: 'power2.out' });
      const yTo = gsap.quickTo(elem, 'y', { duration: 0.35, ease: 'power2.out' });

      elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.2);
        yTo(relY * 0.2);
      });

      elem.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });

    // GSAP Mouse Parallax for Hero Ambient Aura
    window.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.04;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.04;

      gsap.to('.hero-ambient-aura', {
        x: moveX,
        y: moveY,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  }

  // Update Copyright Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 5. Drawer Control Functions with GSAP Slide & Stagger Animations
  function openDrawer(drawerElement, triggerLink) {
    closeAllDrawers();
    drawerElement.classList.add('active');
    drawerElement.setAttribute('aria-hidden', 'false');
    if (triggerLink) triggerLink.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    const content = drawerElement.querySelector('.drawer-content');
    const items = drawerElement.querySelectorAll('.product-item, .role-card');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(content, 
        { x: '100%' }, 
        { x: '0%', duration: 0.45, ease: 'power3.out' }
      );

      gsap.fromTo(items, 
        { y: 20, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.07, delay: 0.15, ease: 'power2.out' }
      );
    }

    const closeBtn = drawerElement.querySelector('.close-btn');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 150);
    }
  }

  function closeDrawer(drawerElement) {
    if (!drawerElement.classList.contains('active')) return;
    const content = drawerElement.querySelector('.drawer-content');

    if (typeof gsap !== 'undefined') {
      gsap.to(content, {
        x: '100%',
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          drawerElement.classList.remove('active');
          drawerElement.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          linkProducts.setAttribute('aria-expanded', 'false');
          linkHiring.setAttribute('aria-expanded', 'false');
        }
      });
    } else {
      drawerElement.classList.remove('active');
      drawerElement.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      linkProducts.setAttribute('aria-expanded', 'false');
      linkHiring.setAttribute('aria-expanded', 'false');
    }
  }

  function closeAllDrawers() {
    closeDrawer(drawerProducts);
    closeDrawer(drawerHiring);
  }

  // Event Listeners for Navigation Links
  linkProducts.addEventListener('click', (e) => {
    e.preventDefault();
    if (drawerProducts.classList.contains('active')) {
      closeDrawer(drawerProducts);
    } else {
      openDrawer(drawerProducts, linkProducts);
    }
  });

  linkHiring.addEventListener('click', (e) => {
    e.preventDefault();
    if (drawerHiring.classList.contains('active')) {
      closeDrawer(drawerHiring);
    } else {
      openDrawer(drawerHiring, linkHiring);
    }
  });

  // Close triggers
  closeProducts.addEventListener('click', () => closeDrawer(drawerProducts));
  closeHiring.addEventListener('click', () => closeDrawer(drawerHiring));
  backdropProducts.addEventListener('click', () => closeDrawer(drawerProducts));
  backdropHiring.addEventListener('click', () => closeDrawer(drawerHiring));

  // Footer Keyboard Chips
  if (keyHintP) keyHintP.addEventListener('click', () => openDrawer(drawerProducts, linkProducts));
  if (keyHintH) keyHintH.addEventListener('click', () => openDrawer(drawerHiring, linkHiring));

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Ignore keypresses if user is typing in an input/textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'Escape') {
      closeAllDrawers();
    } else if (e.key === 'p' || e.key === 'P') {
      openDrawer(drawerProducts, linkProducts);
    } else if (e.key === 'h' || e.key === 'H') {
      openDrawer(drawerHiring, linkHiring);
    }
  });

  // Role Application Buttons Handling
  const applyButtons = document.querySelectorAll('.apply-btn');
  applyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const roleName = btn.getAttribute('data-role') || 'Role';
      const mailtoUrl = `mailto:careers@bloon.ai?subject=${encodeURIComponent('Application: ' + roleName + ' - bloon')}`;
      
      // Copy email to clipboard as fallback & open mailto
      navigator.clipboard.writeText('careers@bloon.ai').then(() => {
        showToast(`Copied careers@bloon.ai to clipboard`);
      }).catch(() => {
        showToast(`Opening mail client...`);
      });

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  });

  // Toast System
  let toastTimer = null;
  function showToast(text) {
    if (!toast) return;
    toastMessage.textContent = text;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 3000);
  }

  // Console Brand Signature
  console.log(
    '%c Bloon %c AI venture studio — Building AI products used by millions of users.',
    'background: #0A3D62; color: #7CCBFF; padding: 4px 8px; border-radius: 2px; font-family: monospace; font-weight: bold;',
    'color: #1E5AA8; font-family: monospace; padding-left: 8px;'
  );
});
