/* =============================================
   ChemiCLSES — Scripts
   ============================================= */

// ---- CFD Particle Canvas ----
(function() {
  const canvas = document.getElementById('cfdCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, streamLines;
  const PARTICLE_COUNT = 120;
  const STREAM_COUNT = 8;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Simulate a simple velocity field (CFD-like streamlines)
  function velocityField(x, y) {
    const nx = x / W - 0.5;
    const ny = y / H - 0.5;
    // Swirl + horizontal bias
    const vx = 0.6 + 0.4 * Math.sin(ny * Math.PI * 2 + Date.now() * 0.0003);
    const vy = 0.3 * Math.sin(nx * Math.PI * 3 + Date.now() * 0.0002) * Math.cos(ny * Math.PI);
    return { vx, vy };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      speed: rand(0.4, 1.2),
      size: rand(1.5, 3.5),
      alpha: rand(0.15, 0.5),
      hue: rand(180, 210),
      life: rand(0, 200),
      maxLife: rand(150, 300)
    }));
  }

  function initStreamLines() {
    streamLines = Array.from({ length: STREAM_COUNT }, (_, i) => ({
      y: H * (i + 1) / (STREAM_COUNT + 1),
      phase: rand(0, Math.PI * 2),
      amp: rand(20, 60),
      freq: rand(0.003, 0.007),
      speed: rand(0.0003, 0.0008),
      alpha: rand(0.04, 0.10)
    }));
  }

  function drawStreamLines(t) {
    streamLines.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(0, s.y);
      for (let x = 0; x <= W; x += 4) {
        const y = s.y + Math.sin(x * s.freq + t * s.speed * 1000 + s.phase) * s.amp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(0, 201, 255, ${s.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  function drawParticles(t) {
    particles.forEach(p => {
      const { vx, vy } = velocityField(p.x, p.y);
      p.x += vx * p.speed;
      p.y += vy * p.speed * 0.6;
      p.life++;

      if (p.x > W + 10 || p.x < -10 || p.y > H + 10 || p.y < -10 || p.life > p.maxLife) {
        p.x = rand(-10, 10);
        p.y = rand(0, H);
        p.life = 0;
        p.maxLife = rand(150, 300);
      }

      const lifeRatio = p.life / p.maxLife;
      const fadeAlpha = p.alpha * Math.sin(lifeRatio * Math.PI);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${fadeAlpha})`;
      ctx.fill();

      // Trail
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - vx * p.speed * 8, p.y - vy * p.speed * 6);
      ctx.strokeStyle = `hsla(${p.hue}, 90%, 65%, ${fadeAlpha * 0.4})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
  }

  function drawGrid() {
    const spacing = 60;
    ctx.strokeStyle = 'rgba(0, 201, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  let rafId;
  function animate(t) {
    ctx.clearRect(0, 0, W, H);
    // Dark gradient base
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(10,22,40,0.95)');
    grad.addColorStop(1, 'rgba(15,31,61,0.90)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    drawGrid();
    drawStreamLines(t);
    drawParticles(t);

    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
    initStreamLines();
  });

  resize();
  initParticles();
  initStreamLines();
  animate(0);
})();


// ---- Nav scroll behavior ----
(function() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ---- Mobile menu toggle ----
(function() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();


// ---- Scroll reveal ----
(function() {
  const targets = document.querySelectorAll(
    '.service-card, .cap-row, .industry-item, .process-step, .section-header, .contact-left, .contact-form, .about-box, .about-text, .hero-stats'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


// ---- Stagger service cards ----
(function() {
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll('.industry-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.06}s`;
  });
})();


// ---- Contact form ----
function handleSubmit(e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const note = document.getElementById('formNote');
  const form = document.getElementById('contactForm');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate form submission (replace with real endpoint / formspree / emailjs)
  setTimeout(() => {
    btn.textContent = '✓ Message Sent';
    note.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
    note.style.color = '#00C9FF';
    form.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      note.textContent = '';
    }, 5000);
  }, 1200);
}


// ---- Smooth active nav links ----
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
    });
  }, { passive: true });
})();
