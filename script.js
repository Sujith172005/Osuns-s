(function () {
  "use strict";
  
  // ==========================================
  // DEBUGGING: Uncomment to see what's happening
  // ==========================================
  const DEBUG = false; // Keep production consoles quiet
  
  function log(message, data) {
    if (DEBUG) {
      console.log(`[Carousel Debug] ${message}`, data || '');
    }
  }
  
  log('Script loaded successfully');

  const WHATSAPP_NUMBER = "917904336537";
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  const orderModal = document.getElementById('orderModal');
  const modalClose = document.getElementById('modalClose');
  const enquiryForm = document.getElementById('enquiryForm');
  const form = document.getElementById('otpForm');
  const nameInput = document.getElementById('otpName');
  const phoneInput = document.getElementById('otpPhone');
  const productInput = document.getElementById('otpProduct');

  // Product-card backgrounds cannot use native image lazy-loading, so load
  // them shortly before they enter the viewport instead.
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');

  function loadBackground(element) {
    const source = element.dataset.bg;
    if (!source) return;
    element.style.backgroundImage = `url("${source}")`;
    element.removeAttribute('data-bg');
  }

  if ('IntersectionObserver' in window) {
    const backgroundObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        loadBackground(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' });

    lazyBackgrounds.forEach(element => backgroundObserver.observe(element));
  } else {
    lazyBackgrounds.forEach(loadBackground);
  }

  function closeMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openModal(product) {
    if (product && productInput) productInput.value = product;
    if (orderModal) {
      orderModal.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(() => nameInput && nameInput.focus(), 80);
    }
  }

  function closeModal() {
    if (orderModal) {
      orderModal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function buildWhatsAppLink(data) {
    const text = "📩 New Bulk Enquiry\n\n" +
      "Name: " + (data.name || '-') + "\n" +
      "WhatsApp Number: " + (data.phone || '-') + "\n" +
      "Interested Product: " + (data.product || '-') + "\n\n" +
      "Please contact me for bulk enquiry details.";
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  window.addEventListener('scroll', () => header && header.classList.toggle('scrolled', window.scrollY > 12));

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = !mainNav.classList.contains('open');
      mainNav.classList.toggle('open', open);
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (window.innerWidth <= 900) {
        const open = !dropdown.classList.contains('open');
        dropdowns.forEach(item => item !== dropdown && item.classList.remove('open'));
        dropdown.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      }
    });
  });

  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.querySelectorAll('.open-order').forEach(element => {
    element.addEventListener('click', event => {
      if (orderModal) event.preventDefault();
      openModal(element.dataset.interest || 'General Bulk Enquiry');
      closeMenu();
    });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  orderModal && orderModal.addEventListener('click', event => { if (event.target === orderModal) closeModal(); });

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', event => {
      event.preventDefault();
      openModal(document.getElementById('interest')?.value || 'General Bulk Enquiry');
      if (nameInput) nameInput.value = document.getElementById('name')?.value || '';
      if (phoneInput) phoneInput.value = document.getElementById('phone')?.value || '';
    });
  }

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = (nameInput?.value || '').trim();
      const phone = (phoneInput?.value || '').replace(/\D/g, '').slice(-10);
      const product = productInput?.value || 'General Bulk Enquiry';
      if (!name) { alert('Please enter your name.'); return; }
      if (phone.length !== 10) { alert('Please enter a valid 10 digit WhatsApp number.'); return; }
      window.open(buildWhatsAppLink({ name, phone, product }), '_blank');
      closeModal();
    });
  }

  // ==========================================
  // HERO CAROUSEL CODE - WITH DEBUGGING
  // ==========================================
  
  const slides = document.querySelectorAll('.hero-slide');
  const prevButton = document.querySelector('.hero-prev');
  const nextButton = document.querySelector('.hero-next');
  const dotsContainer = document.querySelector('.hero-dots');
  const heroMedia = document.querySelector('.home-hero-media');
  const heroCopy = document.querySelector('.home-hero-copy');
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  const counters = document.querySelectorAll('.counter-card strong');
  
  let currentSlide = 0;
  let autoplayTimer = null;

  // ==========================================
  // DEBUG: Check if carousel elements exist
  // ==========================================
  log('Carousel Elements Found:');
  log('  Slides:', slides.length);
  log('  Prev button:', prevButton ? 'Found ✓' : 'NOT FOUND ✗');
  log('  Next button:', nextButton ? 'Found ✓' : 'NOT FOUND ✗');
  log('  Dots container:', dotsContainer ? 'Found ✓' : 'NOT FOUND ✗');
  log('  Hero media:', heroMedia ? 'Found ✓' : 'NOT FOUND ✗');

  // Debug: Log background images
  if (slides.length > 0) {
    log('Background images:');
    slides.forEach((slide, index) => {
      log(`  Slide ${index}:`, slide.style.backgroundImage);
    });
  }

  function showSlide(index) {
    if (!slides.length) {
      log('ERROR: No slides found!');
      return;
    }
    
    currentSlide = (index + slides.length) % slides.length;
    log(`Showing slide: ${currentSlide}`);
    
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });
    
    document.querySelectorAll('.hero-dots button').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
    
    const activeSlide = slides[currentSlide];

    // Home hero product banners: each .hero-slide carries data-* fields for
    // its category, tagline, image and CTAs. When present, crossfade the
    // visible copy/media panel to match — otherwise this is the plain
    // full-bleed background slider (e.g. products.html) and only the
    // background image below applies.
    if (heroCopy && activeSlide && activeSlide.dataset.title) {
      const applyContent = () => {
        const eyebrowEl = heroCopy.querySelector('.eyebrow');
        const titleEl = heroCopy.querySelector('h1');
        const textEl = heroCopy.querySelector('p:not(.eyebrow)');
        const exploreBtn = heroCopy.querySelector('.hero-actions .btn-primary');
        const contactBtn = heroCopy.querySelector('.hero-actions .btn-whatsapp');
        if (eyebrowEl) eyebrowEl.textContent = activeSlide.dataset.eyebrow || '';
        if (titleEl) titleEl.textContent = activeSlide.dataset.title || '';
        if (textEl) textEl.textContent = activeSlide.dataset.text || '';
        if (exploreBtn) exploreBtn.setAttribute('href', activeSlide.dataset.link || '#products');
        if (contactBtn) contactBtn.setAttribute('data-interest', activeSlide.dataset.interest || 'General Bulk Enquiry');
        if (heroMedia) heroMedia.style.backgroundImage = activeSlide.dataset.image ? `url('${activeSlide.dataset.image}')` : '';
      };

      if (heroCopy.dataset.initialized) {
        heroCopy.classList.add('is-fading');
        if (heroMedia) heroMedia.classList.add('is-fading');
        setTimeout(() => {
          applyContent();
          heroCopy.classList.remove('is-fading');
          if (heroMedia) heroMedia.classList.remove('is-fading');
        }, 220);
      } else {
        applyContent();
        heroCopy.dataset.initialized = 'true';
      }
      log('Updated home hero banner copy:', activeSlide.dataset.title);
    } else if (heroMedia) {
      const bgImage = activeSlide.style.backgroundImage;
      heroMedia.style.backgroundImage = bgImage || '';
      log(`Updated background image:`, bgImage);
    }
  }

  function startAutoplay() {
    if (!slides.length) {
      log('ERROR: No slides available for autoplay');
      return;
    }
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
    log('Autoplay started (5000ms interval)');
  }

  // Initialize carousel only if slides exist
  if (slides.length) {
    log(`Initializing carousel with ${slides.length} slides`);
    
    // Remove active class from all slides initially
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Create dots
    if (dotsContainer) {
      log('Creating dot indicators...');
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          log(`Dot clicked: slide ${index}`);
          showSlide(index);
          startAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
      log(`Created ${slides.length} dots ✓`);
    } else {
      log('WARNING: .hero-dots container not found!');
    }

    // Add prev button listener
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        log('Prev button clicked');
        showSlide(currentSlide - 1);
        startAutoplay();
      });
      log('Prev button listener attached ✓');
    } else {
      log('WARNING: .hero-prev button not found!');
    }

    // Add next button listener
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        log('Next button clicked');
        showSlide(currentSlide + 1);
        startAutoplay();
      });
      log('Next button listener attached ✓');
    } else {
      log('WARNING: .hero-next button not found!');
    }

    // Initialize carousel
    log('Initializing first slide...');
    showSlide(0);
    startAutoplay();
    log('Carousel initialization complete! ✓');
  } else {
    log('ERROR: No .hero-slide elements found! Carousel will not work.');
    log('Make sure your HTML has: <div class="hero-slide">...</div>');
  }

  // ==========================================
  // SCROLL REVEAL ANIMATION
  // ==========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach(item => revealObserver.observe(item));

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  counters.forEach(counter => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });

    observer.observe(counter.closest('.counter-card'));
  });

})();

// ==========================================
// ADDITIONAL DEBUGGING (Run in console)
// ==========================================
console.log('%c=== CAROUSEL DEBUG INFO ===', 'color: blue; font-size: 14px; font-weight: bold;');
console.log('%cTo check carousel status, run in console:', 'color: green;');
console.log('  document.querySelectorAll(".hero-slide").length  → should show number > 0');
console.log('  document.querySelector(".hero-prev")           → should show button element');
console.log('  document.querySelector(".hero-next")           → should show button element');
console.log('  document.querySelector(".home-hero-media")     → should show div element');
console.log('  document.querySelector(".hero-dots")           → should show div element');
console.log('%cIf any show "null", that element is missing from HTML', 'color: red;');
