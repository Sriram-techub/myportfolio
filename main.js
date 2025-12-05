document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = siteNav.querySelectorAll('a[href^="#"]');
  const themeToggle = document.getElementById('themeToggle');

  // Theme handling: initialize and toggle
  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    // fallback to system preference
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    return m.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      const pressed = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      themeToggle.textContent = pressed ? '☀️' : '🌙';
      themeToggle.title = pressed ? 'Switch to light theme' : 'Switch to dark theme';
    }
    // Update meta theme-color if present
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#071026' : '#0b74ff');
    }
  }

  // initialize theme on load
  try {
    const initial = getPreferredTheme();
    applyTheme(initial);
  } catch (e) {
    console.warn('Theme init error', e);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      // Add a short class to enable CSS transitions for the theme change
      try {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
          document.documentElement.classList.add('theme-anim');
          // remove the class after the transition duration
          window.setTimeout(() => document.documentElement.classList.remove('theme-anim'), 520);
        }
      } catch (e) {
        // ignore
      }
      applyTheme(next);
    });
  }

  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
    const open = siteNav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  // Smooth scroll for internal links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
      // close nav on mobile
      if (siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active section highlighting
  const sections = Array.from(document.querySelectorAll('main section'));
  function onScroll() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.id;
      const link = siteNav.querySelector(`a[href="#${id}"]`);
      if (!link) return;
      if (scrollPos >= top && scrollPos < bottom) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Carousel controls: works for any .carousel with .carousel-track and prev/next
  function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(car => {
      const track = car.querySelector('.carousel-track');
      const prev = car.querySelector('.carousel-control.prev');
      const next = car.querySelector('.carousel-control.next');
      if (!track) return;

      // Enable keyboard navigation when focused
      car.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { track.scrollBy({left: 320, behavior: 'smooth'}); }
        if (e.key === 'ArrowLeft') { track.scrollBy({left: -320, behavior: 'smooth'}); }
      });

      if (prev) prev.addEventListener('click', () => track.scrollBy({left: -track.clientWidth * 0.8, behavior: 'smooth'}));
      if (next) next.addEventListener('click', () => track.scrollBy({left: track.clientWidth * 0.8, behavior: 'smooth'}));

      // Make controls accessible: disable if no overflow
      function updateControls() {
        if (!prev || !next) return;
        const atStart = track.scrollLeft <= 4;
        const atEnd = Math.abs(track.scrollWidth - track.clientWidth - track.scrollLeft) <= 4;
        prev.disabled = atStart;
        next.disabled = atEnd;
      }

      track.addEventListener('scroll', () => updateControls());
      window.addEventListener('resize', () => updateControls());
      updateControls();
    });
  }
  initCarousels();

  // Lightbox (modal) for certificate and timeline images
  (function initLightbox(){
    const lightbox = document.getElementById('lightbox');
    const overlay = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    let lastFocused = null;

    if (!lightbox || !img || !closeBtn) return;

    function openLightbox(src, alt, captionText, triggerEl){
      lastFocused = triggerEl || document.activeElement;
      img.src = src;
      img.alt = alt || '';
      caption.textContent = captionText || '';
      lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('modal-open');
      // focus close button for accessibility
      closeBtn.focus();
    }

    function closeLightbox(){
      lightbox.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      img.src = '';
      img.alt = '';
      caption.textContent = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Attach click handlers to certificate and timeline thumbnails
    const thumbs = document.querySelectorAll('.cert-thumb, .timeline-thumb, .project-media img');
    thumbs.forEach(t => {
      t.style.cursor = 'zoom-in';
      t.addEventListener('click', (e) => {
        const src = t.getAttribute('src');
        // derive a caption from nearest heading
        let captionText = '';
        const card = t.closest('.cert') || t.closest('.timeline-item') || t.closest('.project-card');
        if (card) {
          const h = card.querySelector('h3');
          if (h) captionText = h.textContent.trim();
        }
        openLightbox(src, t.alt || '', captionText, t);
      });
    });

    // close handlers
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      // trap focus within modal: simple approach
      if (e.key === 'Tab') {
        // keep focus on close button only (simple trap)
        e.preventDefault();
        closeBtn.focus();
      }
    });

    // ensure images can be closed on pressing Enter when focused
    closeBtn.addEventListener('keyup', (e) => { if (e.key === 'Enter') closeLightbox(); });
  })();

  // Populate year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form handler (simple demo)
  const form = document.getElementById('contactForm');
  const clearBtn = document.getElementById('clearForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const message = data.get('message') || '';
      // Open mail client as a simple fallback; replace with API call if you have one
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
    });
  }
  if (clearBtn && form) {
    clearBtn.addEventListener('click', () => form.reset());
  }
});
