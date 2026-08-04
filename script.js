
(function () {
  "use strict";
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

  const slides = document.querySelectorAll('.hero-slide');
  const prevButton = document.querySelector('.hero-prev');
  const nextButton = document.querySelector('.hero-next');
  const dotsContainer = document.querySelector('.hero-dots');
  const heroMedia = document.querySelector('.home-hero-media');
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  const counters = document.querySelectorAll('.counter-card strong');
  let currentSlide = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentSlide));
    document.querySelectorAll('.hero-dots button').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
    if (heroMedia) {
      heroMedia.style.backgroundImage = slides[currentSlide].style.backgroundImage || '';
    }
  }

  function startAutoplay() {
    if (!slides.length) return;
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  if (slides.length) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          showSlide(index);
          startAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    prevButton?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoplay();
    });

    nextButton?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoplay();
    });

    showSlide(0);
    startAutoplay();
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach(item => revealObserver.observe(item));

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
