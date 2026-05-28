/* ═══════════════════════════════════════════
   RETROSPECTIVA — APP ENGINE
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  let currentSlide = 0;
  let totalSlides = 0;
  let isTransitioning = false;
  let touchStartY = 0;
  let touchStartX = 0;
  let bgMusic = null;
  let musicPlaying = false;
  let musicPausedForAudio = false;
  let particlesCtx = null;
  let particles = [];
  let animFrameId = null;

  // ─── INIT ───

  function init() {
    applyTheme();
    setupSplash();
  }

  // ─── THEME ───

  function applyTheme() {
    const t = CONFIG.theme;
    const root = document.documentElement.style;
    root.setProperty('--primary', t.primaryColor);
    root.setProperty('--secondary', t.secondaryColor);
    root.setProperty('--bg', t.backgroundColor);
    root.setProperty('--surface', t.surfaceColor);
    root.setProperty('--text', t.textColor);
    root.setProperty('--muted', t.mutedColor);
    root.setProperty('--radius', t.borderRadius);
    root.setProperty('--font-heading', t.headingFont);
    root.setProperty('--font-body', t.bodyFont);
    root.setProperty('--font-accent', t.accentFont);
    root.setProperty('--transition-duration', CONFIG.transitions.duration + 'ms');
    root.setProperty('--transition-easing', CONFIG.transitions.easing);
    document.querySelector('meta[name="theme-color"]').content = t.backgroundColor;
  }

  // ─── SPLASH ───

  function setupSplash() {
    const splash = document.getElementById('splash');
    const title = document.getElementById('splashTitle');
    title.textContent = CONFIG.receiver.nickname
      ? `Para ${CONFIG.receiver.nickname}`
      : `Para ${CONFIG.receiver.name}`;

    createSplashParticles();

    splash.addEventListener('click', startExperience, { once: true });
    splash.addEventListener('touchend', function (e) {
      e.preventDefault();
      startExperience();
    }, { once: true });
  }

  function createSplashParticles() {
    const container = document.getElementById('splashParticles');
    const symbols = getParticleSymbol();
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('span');
      p.className = 'splash-particle';
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.fontSize = (12 + Math.random() * 12) + 'px';
      container.appendChild(p);
    }
  }

  function startExperience() {
    const splash = document.getElementById('splash');
    splash.classList.add('leaving');

    setTimeout(function () {
      splash.style.display = 'none';
      document.getElementById('app').classList.remove('hidden');
      buildSlides();
      setupNavigation();
      setupMusic();
      setupParticles();
      goToSlide(0);
    }, 800);
  }

  // ─── BUILD SLIDES ───

  function buildSlides() {
    const container = document.getElementById('slidesContainer');
    const dotsContainer = document.getElementById('dotsContainer');
    totalSlides = CONFIG.slides.length;

    CONFIG.slides.forEach(function (slide, i) {
      const el = document.createElement('div');
      const transType = slide.transition || CONFIG.transitions.type;
      el.className = 'slide t-' + transType + ' animate-on-enter';
      el.dataset.index = i;
      el.innerHTML = renderSlide(slide, i);
      container.appendChild(el);

      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsContainer.appendChild(dot);
    });
  }

  function renderSlide(slide, index) {
    switch (slide.type) {
      case 'intro': return renderIntro(slide);
      case 'counter': return renderCounter(slide);
      case 'photo': return renderPhoto(slide);
      case 'text': return renderText(slide);
      case 'video': return renderVideo(slide, index);
      case 'audio': return renderAudio(slide, index);
      case 'gallery': return renderGallery(slide);
      case 'letter': return renderLetter(slide);
      case 'final': return renderFinal(slide);
      default: return '<p>Slide desconhecido</p>';
    }
  }

  function renderIntro(s) {
    const bgStyle = s.background
      ? '<div class="intro-bg" style="background-image:url(\'' + s.background + '\')"></div>'
      : '';
    return '<div class="slide-intro">' + bgStyle +
      '<div class="intro-content">' +
        '<div class="intro-icon anim-item">&#10084;</div>' +
        '<h1 class="anim-item">' + esc(s.title) + '</h1>' +
        '<p class="intro-subtitle anim-item">' + esc(s.subtitle) + '</p>' +
        '<div class="intro-line anim-item"></div>' +
      '</div></div>';
  }

  function renderCounter(s) {
    return '<div class="slide-counter">' +
      '<h2 class="anim-item">' + esc(s.title) + '</h2>' +
      '<div class="counter-grid anim-item" id="counterGrid">' +
        '<div class="counter-item"><div class="counter-number" data-counter="years">0</div><div class="counter-label">anos</div></div>' +
        '<div class="counter-item"><div class="counter-number" data-counter="months">0</div><div class="counter-label">meses</div></div>' +
        '<div class="counter-item"><div class="counter-number" data-counter="days">0</div><div class="counter-label">dias</div></div>' +
        '<div class="counter-item"><div class="counter-number" data-counter="hours">0</div><div class="counter-label">horas</div></div>' +
      '</div>' +
      '<p class="counter-message anim-item">' + esc(s.message) + '</p>' +
    '</div>';
  }

  function renderPhoto(s) {
    const filterClass = s.filter ? ' filter-' + s.filter : '';
    const imgHtml = s.src
      ? '<img src="' + esc(s.src) + '" alt="' + esc(s.caption || '') + '" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=\\\'photo-placeholder\\\'>Adicione uma foto</div>\'">'
      : '<div class="photo-placeholder">Adicione uma foto</div>';
    return '<div class="slide-photo">' +
      '<div class="photo-frame anim-item' + filterClass + '">' + imgHtml + '</div>' +
      '<div class="photo-caption anim-item">' +
        (s.caption ? '<h3>' + esc(s.caption) + '</h3>' : '') +
        (s.date ? '<span class="photo-date">' + esc(s.date) + '</span>' : '') +
      '</div></div>';
  }

  function renderText(s) {
    const words = s.content.split(' ').map(function (w) {
      return '<span class="word">' + esc(w) + '</span>';
    }).join(' ');
    return '<div class="slide-text">' +
      '<div class="text-quote anim-item">&ldquo;</div>' +
      '<h2 class="anim-item">' + esc(s.title) + '</h2>' +
      '<p class="text-content anim-item">' + words + '</p>' +
    '</div>';
  }

  function renderVideo(s, index) {
    const posterAttr = s.poster ? ' poster="' + esc(s.poster) + '"' : '';
    return '<div class="slide-video">' +
      '<div class="video-frame anim-item">' +
        '<video id="video-' + index + '" playsinline preload="metadata"' + posterAttr + '>' +
          '<source src="' + esc(s.src) + '" type="video/mp4">' +
        '</video>' +
        '<div class="video-play-overlay" data-video-id="video-' + index + '">' +
          '<div class="video-play-btn"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>' +
        '</div>' +
      '</div>' +
      (s.caption ? '<p class="video-caption anim-item">' + esc(s.caption) + '</p>' : '') +
    '</div>';
  }

  function renderAudio(s, index) {
    return '<div class="slide-audio">' +
      '<h2 class="anim-item">' + esc(s.title) + '</h2>' +
      (s.subtitle ? '<p class="audio-subtitle anim-item">' + esc(s.subtitle) + '</p>' : '') +
      '<div class="audio-player anim-item">' +
        '<button class="audio-play-btn" data-audio-index="' + index + '">' +
          '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>' +
        '</button>' +
        '<div class="audio-progress"><div class="audio-progress-fill" id="audioProgress-' + index + '"></div></div>' +
        '<span class="audio-time" id="audioTime-' + index + '">0:00</span>' +
        '<audio id="audio-' + index + '" preload="metadata" src="' + esc(s.src) + '"></audio>' +
      '</div>' +
    '</div>';
  }

  function renderGallery(s) {
    const items = s.photos.map(function (p) {
      const imgHtml = p.src
        ? '<img src="' + esc(p.src) + '" alt="' + esc(p.caption || '') + '" loading="lazy" onerror="this.outerHTML=\'<div class=\\\'gallery-placeholder\\\' style=\\\'width:260px;height:320px\\\'>Foto</div>\'">'
        : '<div class="gallery-placeholder" style="width:260px;height:320px;">Foto</div>';
      return '<div class="gallery-item">' + imgHtml +
        (p.caption ? '<p>' + esc(p.caption) + '</p>' : '') + '</div>';
    }).join('');
    return '<div class="slide-gallery">' +
      '<h2 class="anim-item">' + esc(s.title) + '</h2>' +
      '<div class="gallery-scroll anim-item">' + items + '</div>' +
    '</div>';
  }

  function renderLetter(s) {
    const paras = s.paragraphs.map(function (p, i) {
      return '<p class="anim-item">' + esc(p) + '</p>';
    }).join('');
    return '<div class="slide-letter">' +
      '<div class="letter-card">' +
        '<h2 class="anim-item">' + esc(s.title) + '</h2>' +
        paras +
        (s.signature ? '<span class="letter-signature anim-item">' + esc(s.signature) + '</span>' : '') +
        '<span class="letter-sender anim-item">' + esc(CONFIG.sender.name) + '</span>' +
      '</div></div>';
  }

  function renderFinal(s) {
    const btnHtml = s.buttonText && s.buttonLink
      ? '<a href="' + esc(s.buttonLink) + '" target="_blank" rel="noopener" class="final-btn anim-item">' + esc(s.buttonText) + '</a>'
      : '';
    return '<div class="slide-final">' +
      '<div class="final-emoji anim-item">' + (s.emoji || '❤️') + '</div>' +
      '<h2 class="anim-item">' + esc(s.title) + '</h2>' +
      '<p class="final-subtitle anim-item">' + esc(s.subtitle) + '</p>' +
      btnHtml +
    '</div>';
  }

  // ─── NAVIGATION ───

  function setupNavigation() {
    const container = document.getElementById('slidesContainer');

    container.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', function (e) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(deltaY) < 40 && Math.abs(deltaX) < 40) return;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 40) nextSlide();
        else if (deltaY < -40) prevSlide();
      }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
    });

    container.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (e.deltaY > 30) nextSlide();
      else if (e.deltaY < -30) prevSlide();
    }, { passive: false });

    document.getElementById('navDown').addEventListener('click', nextSlide);
    document.getElementById('navUp').addEventListener('click', prevSlide);

    // Video play overlays
    document.querySelectorAll('.video-play-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function () {
        const vid = document.getElementById(overlay.dataset.videoId);
        if (vid) {
          vid.play();
          overlay.classList.add('hidden-overlay');
          if (musicPlaying) { bgMusic.pause(); }
        }
      });
    });

    // Audio play buttons
    document.querySelectorAll('.audio-play-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = btn.dataset.audioIndex;
        toggleAudioMessage(idx, btn);
      });
    });
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide && document.querySelector('.slide.active')) return;
    isTransitioning = true;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Deactivate current
    slides.forEach(function (s) { s.classList.remove('active'); });

    // Activate new
    const target = slides[index];
    target.classList.add('active');
    currentSlide = index;

    // Dots
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });

    // Progress bar
    var pct = totalSlides <= 1 ? 100 : (index / (totalSlides - 1)) * 100;
    document.getElementById('progressFill').style.width = pct + '%';

    // Nav arrows visibility
    document.getElementById('navUp').classList.toggle('hidden', index === 0);
    document.getElementById('navDown').classList.toggle('hidden', index === totalSlides - 1);

    // Trigger animations
    triggerSlideAnimations(target, index);

    // Pause any playing videos/audios from other slides
    pauseAllMedia(index);

    // Pause bg music on audio slides, resume on others
    if (CONFIG.slides[index] && CONFIG.slides[index].type === 'audio') {
      if (bgMusic && !bgMusic.paused) {
        bgMusic.pause();
        musicPausedForAudio = true;
      }
    } else if (musicPausedForAudio) {
      musicPausedForAudio = false;
      if (bgMusic) bgMusic.play().catch(function () {});
    }

    setTimeout(function () { isTransitioning = false; }, CONFIG.transitions.duration);
  }

  function triggerSlideAnimations(slide, index) {
    // Staggered entrance
    setTimeout(function () {
      slide.classList.add('active');
    }, 50);

    // Counter
    var counterSlideData = CONFIG.slides[index];
    if (counterSlideData && counterSlideData.type === 'counter') {
      animateCounter(counterSlideData.startDate);
    }

    // Text word-by-word
    if (counterSlideData && counterSlideData.type === 'text') {
      var words = slide.querySelectorAll('.word');
      words.forEach(function (w, i) {
        setTimeout(function () { w.classList.add('visible'); }, 300 + i * 80);
      });
    }
  }

  function pauseAllMedia(exceptIndex) {
    document.querySelectorAll('video').forEach(function (v) { v.pause(); });
    document.querySelectorAll('.video-play-overlay').forEach(function (o) { o.classList.remove('hidden-overlay'); });
    CONFIG.slides.forEach(function (s, i) {
      if (i !== exceptIndex && s.type === 'audio') {
        var aud = document.getElementById('audio-' + i);
        if (aud) { aud.pause(); aud.currentTime = 0; }
        var btn = document.querySelector('[data-audio-index="' + i + '"]');
        if (btn) btn.classList.remove('playing');
      }
    });
    if (musicPlaying && bgMusic.paused && !musicPausedForAudio) bgMusic.play().catch(function () {});
  }

  // ─── COUNTER ───

  function animateCounter(startDateStr) {
    var start = new Date(startDateStr);

    function update() {
      var now = new Date();
      var diff = now - start;
      if (diff < 0) diff = 0;

      var years = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
      var rem = diff - years * 365.25 * 24 * 3600 * 1000;
      var months = Math.floor(rem / (30.44 * 24 * 3600 * 1000));
      rem -= months * 30.44 * 24 * 3600 * 1000;
      var days = Math.floor(rem / (24 * 3600 * 1000));
      rem -= days * 24 * 3600 * 1000;
      var hours = Math.floor(rem / (3600 * 1000));

      setCounter('years', years);
      setCounter('months', months);
      setCounter('days', days);
      setCounter('hours', hours);
    }

    function setCounter(name, value) {
      var els = document.querySelectorAll('[data-counter="' + name + '"]');
      els.forEach(function (el) { el.textContent = value; });
    }

    update();
    setInterval(update, 60000);
  }

  // ─── AUDIO MESSAGE ───

  function toggleAudioMessage(index, btn) {
    var audio = document.getElementById('audio-' + index);
    var progressFill = document.getElementById('audioProgress-' + index);
    var timeDisplay = document.getElementById('audioTime-' + index);

    if (!audio) return;

    if (audio.paused) {
      if (musicPlaying) bgMusic.pause();
      audio.play();
      btn.classList.add('playing');
      btn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="var(--primary)"/><rect x="14" y="4" width="4" height="16" fill="var(--primary)"/></svg>';

      audio.ontimeupdate = function () {
        var pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + '%';
        timeDisplay.textContent = formatTime(audio.currentTime);
      };

      audio.onended = function () {
        btn.classList.remove('playing');
        btn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
        progressFill.style.width = '0%';
        timeDisplay.textContent = '0:00';
        if (musicPlaying) bgMusic.play().catch(function () {});
      };
    } else {
      audio.pause();
      btn.classList.remove('playing');
      btn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
      if (musicPlaying) bgMusic.play().catch(function () {});
    }
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ─── MUSIC ───

  function setupMusic() {
    if (!CONFIG.music.enabled) return;

    bgMusic = document.getElementById('bgMusic');
    bgMusic.src = CONFIG.music.src;
    bgMusic.volume = CONFIG.music.fadeIn ? 0 : CONFIG.music.volume;

    var musicBtn = document.getElementById('musicBtn');
    musicBtn.classList.remove('hidden');

    bgMusic.play().then(function () {
      musicPlaying = true;
      if (CONFIG.music.fadeIn) fadeInMusic();
    }).catch(function () {
      musicBtn.classList.add('paused');
    });

    musicBtn.addEventListener('click', function () {
      if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        musicBtn.classList.add('paused');
      } else {
        bgMusic.play().then(function () {
          musicPlaying = true;
          musicBtn.classList.remove('paused');
        }).catch(function () {});
      }
    });
  }

  function fadeInMusic() {
    var target = CONFIG.music.volume;
    var step = target / 30;
    var vol = 0;
    var interval = setInterval(function () {
      vol += step;
      if (vol >= target) { vol = target; clearInterval(interval); }
      bgMusic.volume = vol;
    }, 100);
  }

  // ─── PARTICLES ───

  function setupParticles() {
    if (!CONFIG.particles.enabled || CONFIG.particles.type === 'none') return;

    var canvas = document.getElementById('particlesCanvas');
    particlesCtx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < CONFIG.particles.amount; i++) {
      particles.push(createParticle(canvas));
    }

    animateParticles(canvas);
  }

  function createParticle(canvas) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 6 + Math.random() * 10,
      speedY: -(0.3 + Math.random() * 0.7) * CONFIG.particles.speed,
      speedX: (Math.random() - 0.5) * 0.5 * CONFIG.particles.speed,
      opacity: 0.1 + Math.random() * 0.4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
    };
  }

  function animateParticles(canvas) {
    particlesCtx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y < -20) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }

      particlesCtx.save();
      particlesCtx.translate(p.x, p.y);
      particlesCtx.rotate(p.rotation * Math.PI / 180);
      particlesCtx.globalAlpha = p.opacity;

      drawParticleShape(particlesCtx, p.size);

      particlesCtx.restore();
    });

    animFrameId = requestAnimationFrame(function () { animateParticles(canvas); });
  }

  function drawParticleShape(ctx, size) {
    var type = CONFIG.particles.type;
    ctx.fillStyle = CONFIG.particles.color;

    if (type === 'hearts') {
      drawHeart(ctx, 0, 0, size);
    } else if (type === 'stars') {
      drawStar(ctx, 0, 0, size * 0.5, 5);
    } else if (type === 'sparkles') {
      drawSparkle(ctx, 0, 0, size * 0.4);
    }
  }

  function drawHeart(ctx, x, y, size) {
    var s = size / 2;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1);
    ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s);
    ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
    ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
    ctx.fill();
  }

  function drawStar(ctx, cx, cy, r, points) {
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var radius = i % 2 === 0 ? r : r * 0.4;
      var angle = (i * Math.PI) / points - Math.PI / 2;
      var x = cx + Math.cos(angle) * radius;
      var y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawSparkle(ctx, cx, cy, r) {
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
      var angle = (i * Math.PI) / 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.strokeStyle = CONFIG.particles.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function getParticleSymbol() {
    switch (CONFIG.particles.type) {
      case 'hearts': return ['♥', '♡', '❤'];
      case 'stars': return ['★', '✦', '✧'];
      case 'sparkles': return ['✨', '·', '✦'];
      default: return ['♥'];
    }
  }

  // ─── UTILS ───

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── START ───

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
