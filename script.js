/* =====================================================
   ATLAS SQUAD — script.js
   Todo el comportamiento interactivo de la página
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     0. AÑO ACTUAL EN EL FOOTER
  ===================================================== */
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  /* =====================================================
     1. CURSOR PERSONALIZADO
  ===================================================== */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    // El anillo sigue con un pequeño retraso (efecto suave)
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    
    // Cambia de forma al pasar sobre elementos interactivos
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .contact-card, .faq-question');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* =====================================================
     2. HEADER: fondo sólido + barra de progreso al hacer scroll
  ===================================================== */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgress');

  function onScrollHeader() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 40);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* =====================================================
     3. MENÚ MÓVIL (burger)
  ===================================================== */
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav   = document.getElementById('mainNav');

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('is-open');
    mainNav.classList.toggle('is-open');
  });

  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('is-open');
      mainNav.classList.remove('is-open');
    });
  });

  /* =====================================================
     4. TYPEWRITER — eslogan escrito letra por letra
  ===================================================== */
  const typewriterEl = document.getElementById('typewriter');
  const fullText = 'Domina tu mercado con webs que realmente venden';
  let twIndex = 0;

  function typeWriter() {
    if (twIndex <= fullText.length) {
      typewriterEl.textContent = fullText.slice(0, twIndex);
      twIndex++;
      setTimeout(typeWriter, 45);
    }
  }
  setTimeout(typeWriter, 600);

  /* =====================================================
     5. REVEAL AL HACER SCROLL (IntersectionObserver)
  ===================================================== */
  const revealItems = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Pequeño stagger según la posición dentro de su contenedor
        const delay = (entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80; // pequeño escalonado dentro de grupos de 4
    revealObserver.observe(el);
  });

  /* =====================================================
     6. CONTADORES ANIMADOS
  ===================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* =====================================================
     6.1 BARRA DE PROGRESO DE TESTIMONIOS (Oferta de lanzamiento)
  ===================================================== */
  const testimonialFill = document.getElementById('testimonialFill');
  const testimonialCountEl = document.querySelector('.testimonial-count');

  if (testimonialFill && testimonialCountEl) {
    const tCurrent = parseInt(testimonialFill.dataset.current, 10) || 0;
    const tTarget = parseInt(testimonialFill.dataset.target, 10) || 50;
    const tPercent = Math.min((tCurrent / tTarget) * 100, 100);

    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          testimonialFill.style.width = tPercent + '%';
          testimonialCountEl.dataset.target = tCurrent; // el contador sube hasta el número actual, no hasta 50
          animateCount(testimonialCountEl);
          testimonialObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    testimonialObserver.observe(testimonialFill);
  }

  /* =====================================================
     7. LÍNEA DE TIEMPO — progreso al hacer scroll
  ===================================================== */
  const timeline = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');

  function updateTimelineProgress() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const start = viewportH * 0.85;
    const end = -rect.height * 0.4;
    const total = start - end;
    const current = start - rect.top;
    const progress = Math.min(Math.max(current / total, 0), 1);
    timelineProgress.style.width = (progress * 100) + '%';
  }
  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  updateTimelineProgress();

  /* =====================================================
     8. FAQ ACORDEÓN
  ===================================================== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Cierra los demás para un efecto tipo acordeón
      document.querySelectorAll('.faq-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      item.classList.toggle('is-open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* =====================================================
     9. PARALLAX SUAVE (sección Garantía)
  ===================================================== */
  const parallaxEls = document.querySelectorAll('.parallax-bg');

  function updateParallax() {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0.2);
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * speed;
      el.style.transform = `translateY(${offset * -0.3}px)`;
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* =====================================================
     10. PARTÍCULAS FLOTANTES (canvas 2D) — fondo del hero
  ===================================================== */
  const particleCanvas = document.getElementById('particleCanvas');
  const pCtx = particleCanvas.getContext('2d');
  let particles = [];

  function resizeParticleCanvas() {
    particleCanvas.width = particleCanvas.offsetWidth;
    particleCanvas.height = particleCanvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((particleCanvas.width * particleCanvas.height) / 9000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      pCtx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  resizeParticleCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeParticleCanvas();
    createParticles();
  });

  /* =====================================================
     11. MODELO 3D — "ATLAS": estructura tipo globo (Three.js)
     Rota lentamente y reacciona al movimiento del mouse
  ===================================================== */
  const atlasCanvas = document.getElementById('atlasCanvas');

  if (window.THREE && atlasCanvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      atlasCanvas.offsetWidth / atlasCanvas.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 5.4;

    const renderer = new THREE.WebGLRenderer({
      canvas: atlasCanvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(atlasCanvas.offsetWidth, atlasCanvas.offsetHeight);

    // Grupo principal: contiene el globo wireframe y sus meridianos
    const atlasGroup = new THREE.Group();

    // Esfera base wireframe (baja poligonización = estética low-poly / tech)
    const sphereGeometry = new THREE.IcosahedronGeometry(1.7, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x2c5282,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    atlasGroup.add(sphereMesh);

    // Núcleo interior sólido y tenue, para dar profundidad
    const coreGeometry = new THREE.IcosahedronGeometry(1.15, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    atlasGroup.add(coreMesh);

    // Anillos orbitales (como líneas de latitud alrededor del "planeta Atlas")
    function createRing(radius, rotX, rotY, opacity) {
      const ringGeometry = new THREE.TorusGeometry(radius, 0.004, 8, 96);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: opacity
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    }
    atlasGroup.add(createRing(2.05, Math.PI / 2.3, 0, 0.25));
    atlasGroup.add(createRing(2.25, Math.PI / 1.6, Math.PI / 3, 0.15));

    // Puntos de estrellas alrededor del modelo (profundidad extra en 3D)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 400;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const radius = 6 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      starPositions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    scene.add(atlasGroup);

    // Reacción al movimiento del mouse (parallax de rotación)
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetRotY = nx * 0.6;
      targetRotX = ny * 0.4;
    });

    function animateAtlas() {
      // Rotación autónoma lenta
      atlasGroup.rotation.y += 0.0016;
      coreMesh.rotation.y -= 0.0009;

      // Suaviza el seguimiento del mouse (lerp)
      currentRotX += (targetRotX - currentRotX) * 0.04;
      currentRotY += (targetRotY - currentRotY) * 0.04;
      atlasGroup.rotation.x = currentRotX;
      atlasGroup.rotation.z = currentRotY * 0.3;

      starField.rotation.y += 0.0002;

      renderer.render(scene, camera);
      requestAnimationFrame(animateAtlas);
    }
    animateAtlas();

    window.addEventListener('resize', () => {
      camera.aspect = atlasCanvas.offsetWidth / atlasCanvas.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(atlasCanvas.offsetWidth, atlasCanvas.offsetHeight);
    });
  }

  /* =====================================================
     12. GSAP ScrollTrigger — refresco tras cargar todo
     (asegura que las animaciones de reveal recalculen bien
      cuando las imágenes terminan de cargar)
  ===================================================== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* =====================================================
     13. SPOTLIGHT — luz suave que sigue al cursor
  ===================================================== */
  const spotlight = document.getElementById('spotlight');
  if (spotlight && !isTouch) {
    let spotX = window.innerWidth / 2;
    let spotY = window.innerHeight / 2;
    let spotCurrentX = spotX;
    let spotCurrentY = spotY;

    window.addEventListener('mousemove', (e) => {
      spotX = e.clientX;
      spotY = e.clientY;
    });

    function animateSpotlight() {
      spotCurrentX += (spotX - spotCurrentX) * 0.08;
      spotCurrentY += (spotY - spotCurrentY) * 0.08;
      spotlight.style.transform = `translate(${spotCurrentX}px, ${spotCurrentY}px)`;
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  } else if (spotlight) {
    spotlight.style.display = 'none';
  }

  /* =====================================================
     14. BOTONES MAGNÉTICOS — se acercan sutilmente al cursor
  ===================================================== */
  if (!isTouch) {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-outline');

    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* =====================================================
     15. TILT 3D — las tarjetas reaccionan al mouse
  ===================================================== */
  if (!isTouch) {
    const tiltCards = document.querySelectorAll('.service-card, .job-card, .guarantee-card, .contact-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-py * 8).toFixed(2);
        const rotateY = (px * 8).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* =====================================================
     16. TARJETA DEL BANNER — leve tilt con el mouse
  ===================================================== */
  const bannerFrame = document.getElementById('bannerFrame');
  if (bannerFrame && !isTouch) {
    bannerFrame.addEventListener('mousemove', (e) => {
      const rect = bannerFrame.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      bannerFrame.style.transform = `perspective(1200px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg) translateY(-6px)`;
    });
    bannerFrame.addEventListener('mouseleave', () => {
      bannerFrame.style.transform = '';
    });
  }

  /* =====================================================
     17. CONFETI — se dispara al hacer clic en los CTA principales
  ===================================================== */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);

  const confettiColors = ['#ffffff', '#2c5282', '#1a365d', '#c9d3de'];

  function launchConfetti(originX, originY) {
    const pieceCount = 60;
    for (let i = 0; i < pieceCount; i++) {
      const angle = (Math.PI * 2 * i) / pieceCount + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;
      confettiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        life: 1
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(updateConfetti);
    }
  }

  function updateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach(p => {
      p.vy += 0.12; // gravedad
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= 0.012;

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rotation * Math.PI) / 180);
      cCtx.globalAlpha = Math.max(p.life, 0);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      cCtx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.life > 0 && p.y < confettiCanvas.height + 50);

    if (confettiPieces.length > 0) {
      requestAnimationFrame(updateConfetti);
    } else {
      confettiRunning = false;
    }
  }

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  /* =====================================================
     18. SMOOTH SCROLL para enlaces internos (#ancla)
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
