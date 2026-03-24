/**
 * CCR Fijian Community — script.js (OPTIMIZED)
 * Handles: sticky navbar, mobile nav, scroll reveal,
 *          event/gallery filtering, lightbox, back-to-top,
 *          active nav highlighting, contact form, ticker
 */

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  initNavbar();
  initMobileNav();
  initScrollReveal();
  initVideoLoop(); // OPTIMIZED VERSION
  initBackToTop();
  initActiveNavLinks();
  initEventFilter();
  initGalleryFilter();
  initGalleryLightbox();
  initAnnouncementTicker();

});


/* ============================================================
   2. STICKY NAVBAR — adds .scrolled class after 60px scroll
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', toggleScrolled, { passive: true });
  toggleScrolled(); // run once on load
}


/* ============================================================
   3. MOBILE NAV TOGGLE
   ============================================================ */
function initMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  // Open / close menu
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    animateHamburger(toggle, isOpen);
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      animateHamburger(toggle, false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      animateHamburger(toggle, false);
      document.body.style.overflow = '';
    }
  });
}

/**
 * Animates the hamburger icon lines into an X (and back)
 */
function animateHamburger(btn, isOpen) {
  const spans = btn.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  }
}


/* ============================================================
   4. SCROLL REVEAL — animate elements as they enter viewport
   ============================================================ */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, {
    threshold: 0.12,   // trigger when 12% visible
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(item => observer.observe(item));
}


/* ============================================================
   5. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // Show after scrolling down 400px
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   6. ACTIVE NAV LINK HIGHLIGHTING (based on scroll position)
   ============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY + 120; // offset for navbar height

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}


/* ============================================================
   7. EVENT FILTER (filter by category)
   ============================================================ */
function initEventFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const eventCards = document.querySelectorAll('#eventsGrid .event-card');
  if (!filterBtns.length || !eventCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards with smooth transition
      eventCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display = '';
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


/* ============================================================
   8. GALLERY FILTER
   ============================================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('[data-gallery]');
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.gallery;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.galleryCat === filter;
        item.style.display = match ? '' : 'none';
        if (match) {
          item.classList.remove('visible');
          setTimeout(() => item.classList.add('visible'), 50);
        }
      });
    });
  });
}


/* ============================================================
   9. GALLERY LIGHTBOX
   ============================================================ */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const closeBtn     = document.getElementById('lightboxClose');
  if (!lightbox) return;

  // Open lightbox on gallery item click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.querySelector('.gallery-overlay span')?.textContent || '';

      // Build a styled placeholder (in real use, set as background-image from <img> src)
      lightboxImg.innerHTML = `
        <div style="
          width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          flex-direction:column; gap:.75rem;
          color:rgba(255,255,255,.5); font-size:1rem;
        ">
          <i class="ph ph-image" style="font-size:3.5rem;opacity:.4"></i>
          <span>${caption}</span>
        </div>
      `;
      lightboxCap.textContent = caption;

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close handlers
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.innerHTML = '';
    lightboxCap.textContent = '';
  };

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}


/* ============================================================
   10. ANNOUNCEMENT TICKER — duplicates content for seamless loop
   ============================================================ */
function initAnnouncementTicker() {
  const ticker = document.querySelector('.ann-ticker');
  if (!ticker) return;

  // Duplicate the content so the scroll loops seamlessly
  const originalContent = ticker.innerHTML;
  ticker.innerHTML = originalContent + originalContent;
}


/* ============================================================
   11. CONTACT FORM HANDLER
   ============================================================ */
function handleFormSubmit() {
  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  const btn     = document.getElementById('submitBtn');

  // Basic validation
  if (!name?.value.trim()) {
    showFieldError(name, 'Please enter your name');
    return;
  }
  if (!email?.value.trim() || !isValidEmail(email.value)) {
    showFieldError(email, 'Please enter a valid email address');
    return;
  }
  if (!message?.value.trim()) {
    showFieldError(message, 'Please enter a message');
    return;
  }

  // Simulate sending (loading state)
  if (btn) {
    btn.textContent = 'Sending…';
    btn.disabled    = true;
  }

  setTimeout(() => {
    // Show success state
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (form)    form.style.display    = 'none';
    if (success) success.style.display = 'block';
  }, 1200);
}

/**
 * Validates an email address format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Briefly highlights a form field with an error state
 */
function showFieldError(field, message) {
  if (!field) return;
  field.style.borderColor = '#EF4444';
  field.focus();

  // Remove error style after 2 seconds
  setTimeout(() => {
    field.style.borderColor = '';
  }, 2000);

  // Optional: show tooltip (simple alert for now)
  const existing = field.parentNode.querySelector('.field-error');
  if (!existing) {
    const err = document.createElement('span');
    err.className   = 'field-error';
    err.textContent = message;
    err.style.cssText = 'color:#EF4444;font-size:.78rem;margin-top:.2rem;display:block;';
    field.parentNode.appendChild(err);
    setTimeout(() => err.remove(), 2500);
  }
}


/* ============================================================
   12. SMOOTH SCROLL for anchor links (polyfill fallback)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ============================================================
   13. OPTIMIZED BACKGROUND VIDEO LOOP — NO LAG
   ============================================================ */
/* ============================================================
   13. SIMPLE BACKGROUND VIDEO - NO LAG
   ============================================================ */
function initVideoLoop() {
  const video = document.getElementById('bg-video-a');
  const videoB = document.getElementById('bg-video-b');
  
  if (!video) return;
  
  // Hide second video completely (we'll only use one)
  if (videoB) {
    videoB.style.display = 'none';
    videoB.removeAttribute('src');
  }
  
  // List of videos to cycle through
  const videos = [
    'Video Project 1.mp4',
    'Video Project 2.mp4',
    'Video Project 3.mp4',
    'Video Project 4.mp4',
  ];
  
  let currentIndex = 0;
  
  // Set up the single video
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.loop = false; // We'll handle looping manually
  video.style.transform = 'translateZ(0)'; // GPU acceleration
  
  // Function to load and play a video
  function playVideoAtIndex(index) {
    const videoSrc = videos[index % videos.length];
    
    // Only change if it's a different video
    if (video.src.indexOf(videoSrc) === -1) {
      video.src = videoSrc;
      video.load();
      
      video.play().catch(err => {
        console.log('Video play failed, retrying...');
        setTimeout(() => video.play(), 1000);
      });
    }
  }
  
  // When video ends, play next
  video.addEventListener('ended', () => {
    currentIndex++;
    playVideoAtIndex(currentIndex);
  });
  
  // Handle errors
  video.addEventListener('error', () => {
    console.log('Video error, skipping to next');
    currentIndex++;
    playVideoAtIndex(currentIndex);
  });
  
  // Start the first video
  playVideoAtIndex(0);
  
  // Pause video when not visible (saves resources)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    });
    
    observer.observe(document.querySelector('.hero'));
  }
}