/**
 * SATYAWAN JAUNJALE PAINTING SERVICES
 * Complete Website JavaScript
 * ========================================
 */

'use strict';

/* ==================== PRELOADER ==================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  // Allow animation to finish before hiding
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Remove from DOM after transition
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }, 2200);
});


/* ==================== NAVBAR ==================== */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll: toggle scrolled class
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on init

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], div[id]');

  function setActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
})();


/* ==================== SMOOTH SCROLL ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ==================== AOS INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
    });
  }
});


/* ==================== COUNTER ANIMATION ==================== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', initCounters);


/* ==================== GALLERY LIGHTBOX ==================== */
(function initLightbox() {
  const galleryItems  = document.querySelectorAll('.gallery-item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg   = document.getElementById('lightboxImg');
  const closeBtn      = document.getElementById('lightboxClose');
  const prevBtn       = document.getElementById('lightboxPrev');
  const nextBtn       = document.getElementById('lightboxNext');

  if (!lightbox || !galleryItems.length) return;

  let images = [];
  let currentIndex = 0;

  // Build image array
  galleryItems.forEach((item, idx) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({ src: img.src, alt: img.alt });

      item.addEventListener('click', () => {
        currentIndex = idx;
        openLightbox(currentIndex);
      });
    }
  });

  function openLightbox(idx) {
    lightboxImg.src = images[idx].src;
    lightboxImg.alt = images[idx].alt;
    lightbox.classList.add('active');
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    showPrev();
    if (e.key === 'ArrowRight')   showNext();
  });
})();


/* ==================== TESTIMONIAL CAROUSEL ==================== */
(function initCarousel() {
  const track  = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  let currentSlide = 0;
  let slidesPerView = getSlidesPerView();
  let totalSlides   = Math.ceil(cards.length / slidesPerView);
  let autoTimer;

  function getSlidesPerView() {
    if (window.innerWidth < 640)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    totalSlides = Math.ceil(cards.length / slidesPerView);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === currentSlide) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function goTo(idx) {
    slidesPerView = getSlidesPerView();
    totalSlides = Math.ceil(cards.length / slidesPerView);
    currentSlide = Math.max(0, Math.min(idx, totalSlides - 1));

    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    const offset = currentSlide * slidesPerView * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function goNext() {
    const nextSlide = (currentSlide + 1) % totalSlides;
    goTo(nextSlide);
  }

  function goPrev() {
    const prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goTo(prevSlide);
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(goNext, 4000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goPrev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goNext(); startAuto(); });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      diff > 0 ? goNext() : goPrev();
      startAuto();
    }
  });

  // Pause auto on hover
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      slidesPerView = getSlidesPerView();
      currentSlide = 0;
      createDots();
      goTo(0);
    }, 300);
  });

  // Init
  createDots();
  startAuto();
})();


/* ==================== BACK TO TOP ==================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ==================== CONTACT FORM ==================== */
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const success  = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#ff4d4d';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });

    // Phone validation
    const phone = form.querySelector('#phone');
    if (phone && phone.value) {
      const cleaned = phone.value.replace(/\D/g, '');
      if (cleaned.length < 10) {
        valid = false;
        phone.style.borderColor = '#ff4d4d';
      }
    }

    if (!valid) return;

    // Simulate form submission
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 6000);
      }

      // Also open WhatsApp with the inquiry (optional UX enhancement)
      const name    = form.querySelector('#name')?.value || '';
      const service = form.querySelector('#service')?.value || '';
      const location = form.querySelector('#location')?.value || '';
      const msg = encodeURIComponent(
        `Hello, I am ${name}.\nI need ${service} at ${location}.\nPlease share more details.`
      );
      // Uncomment the line below to auto-open WhatsApp after form submit:
      // window.open(`https://wa.me/919082422561?text=${msg}`, '_blank');

    }, 1800);
  });
})();


/* ==================== LAZY LOAD IMAGES ==================== */
(function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return; // Native lazy loading supported

  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
})();


/* ==================== NAVBAR OVERLAY ON MOBILE ==================== */
(function initNavOverlay() {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 999; display: none; backdrop-filter: blur(4px);
  `;
  document.body.appendChild(overlay);

  const observer = new MutationObserver(() => {
    overlay.style.display = navMenu.classList.contains('open') ? 'block' : 'none';
  });
  observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });

  overlay.addEventListener('click', () => {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) hamburger.click();
  });
})();


/* ==================== SCROLL REVEAL UTILITY ==================== */
(function initScrollReveal() {
  // Additional subtle reveal for elements not covered by AOS
  const revealEls = document.querySelectorAll('.service-card, .why-card, .area-card, .stat-card');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${idx * 0.04}s, transform 0.6s ease ${idx * 0.04}s`;
    observer.observe(el);
  });
})();


/* ==================== DYNAMIC YEAR IN FOOTER ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const yearEls = document.querySelectorAll('.footer-year');
  yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });
});


/* ==================== WHATSAPP PULSE PAUSE ON HOVER ==================== */
const waBtn = document.querySelector('.whatsapp-float');
if (waBtn) {
  waBtn.addEventListener('mouseenter', () => {
    waBtn.style.animationPlayState = 'paused';
  });
  waBtn.addEventListener('mouseleave', () => {
    waBtn.style.animationPlayState = 'running';
  });
}


/* ==================== GALLERY HOVER CURSOR ==================== */
(function initGalleryCursor() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.style.cursor = 'zoom-in';
  });
})();


/* ==================== HERO PARALLAX (subtle) ==================== */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scroll = window.scrollY;
        if (scroll < window.innerHeight) {
          heroImg.style.transform = `scale(1) translateY(${scroll * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ==================== SERVICE CARDS TILT EFFECT ==================== */
(function initTiltEffect() {
  const cards = document.querySelectorAll('.service-card');
  if (window.matchMedia('(hover: none)').matches) return; // Skip on touch devices

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ==================== STICKY CTA BANNER (mobile) ==================== */
(function initStickyCTA() {
  // Show a floating call bar on mobile after scrolling past hero
  if (window.innerWidth > 768) return;

  const hero = document.getElementById('home');
  if (!hero) return;

  const ctaBanner = document.createElement('div');
  ctaBanner.innerHTML = `
    <a href="tel:+919833131354" style="
      flex:1; display:flex; align-items:center; justify-content:center; gap:8px;
      background: #C9A84C; color: #000; font-weight:700; font-size:14px;
      padding: 14px; border-radius: 8px;
    ">
      <i class="fas fa-phone"></i> Call Now
    </a>
    <a href="https://wa.me/919082422561" target="_blank" style="
      flex:1; display:flex; align-items:center; justify-content:center; gap:8px;
      background: #25D366; color: #fff; font-weight:700; font-size:14px;
      padding: 14px; border-radius: 8px;
    ">
      <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
  `;
  ctaBanner.style.cssText = `
    position: fixed; bottom: 0; left: 0; right: 0;
    display: flex; gap: 8px; padding: 10px 12px;
    background: rgba(10,10,10,0.97);
    backdrop-filter: blur(10px);
    z-index: 490;
    border-top: 1px solid #2A2A2A;
    transform: translateY(100%);
    transition: transform 0.4s ease;
  `;
  document.body.appendChild(ctaBanner);

  // Adjust back-to-top and whatsapp positions
  const backToTop = document.getElementById('backToTop');
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) waFloat.style.display = 'none'; // Hide since banner has WhatsApp

  window.addEventListener('scroll', () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 100) {
      ctaBanner.style.transform = 'translateY(0)';
      if (backToTop) backToTop.style.bottom = '90px';
    } else {
      ctaBanner.style.transform = 'translateY(100%)';
      if (backToTop) backToTop.style.bottom = '100px';
      if (waFloat) waFloat.style.display = '';
    }
  }, { passive: true });
})();


/* ==================== LOG INIT ==================== */
console.log('%c🎨 Satyawan Jaunjale Painting Services', 'color: #C9A84C; font-size: 16px; font-weight: bold;');
console.log('%c30+ Years of Painting Excellence | Mumbai', 'color: #9A9A9A; font-size: 12px;');
console.log('%c📞 +91 9833131354 | 💬 +91 9082422561', 'color: #25D366; font-size: 12px;');
