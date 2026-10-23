/* ===================================================================
   HARDA ESPORTS ORGANIZATION - OFFICIAL SCRIPT
   Interactive Features: Roster Filter, Countdown, Modals, Stats Counter
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initThemeToggle();
  initRosterFilter();
  initStatsCounter();
  initTournamentCountdown();
  initModalBackdropListeners();
});

/* -------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
   ------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    // Add scrolled class for frosted backdrop
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('desktop-nav-menu');
  const navLinks = document.querySelectorAll('.desktop-nav a');

  if (!mobileBtn || !navMenu) return;

  mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-active');
    const isExpanded = navMenu.classList.contains('mobile-active');
    mobileBtn.setAttribute('aria-expanded', isExpanded);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-active');
    });
  });
}

/* -------------------------------------------------------------------
   3. THEME TOGGLE (Cyber Dark / Neon Mode)
   ------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('harda-esports-theme');

  if (savedTheme === 'neon-light') {
    document.body.classList.add('neon-light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('neon-light-mode');
      const isNeonLight = document.body.classList.contains('neon-light-mode');

      if (isNeonLight) {
        localStorage.setItem('harda-esports-theme', 'neon-light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        showToast('High-Contrast Mode', 'Switched to Neon High-Contrast theme');
      } else {
        localStorage.setItem('harda-esports-theme', 'cyber-dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun-plant-wilt';
        showToast('Cyber Dark Mode', 'Switched to Obsidian Dark theme');
      }
    });
  }
}

/* -------------------------------------------------------------------
   4. ROSTER FILTER BY GAME
   ------------------------------------------------------------------- */
function initRosterFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const playerCards = document.querySelectorAll('.player-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active tab style
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      playerCards.forEach(card => {
        const cardGame = card.getAttribute('data-game');

        if (filterValue === 'all' || cardGame === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';

          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------
   5. ANIMATED STATS COUNTER
   ------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          let current = 0;
          const increment = Math.ceil(target / 40);
          const duration = 1500;
          const stepTime = Math.abs(Math.floor(duration / (target / increment)));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = current;
            }
          }, stepTime || 30);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* -------------------------------------------------------------------
   6. TOURNAMENT LIVE COUNTDOWN
   ------------------------------------------------------------------- */
function initTournamentCountdown() {
  // Set target date: 4 days from current date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4);
  targetDate.setHours(targetDate.getHours() + 16);
  targetDate.setMinutes(targetDate.getMinutes() + 42);

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const badgeEl = document.getElementById('tournament-countdown-badge');

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      if (badgeEl) badgeEl.textContent = 'REGISTRATION CLOSED';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    if (badgeEl) badgeEl.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* -------------------------------------------------------------------
   7. MODAL SYSTEM
   ------------------------------------------------------------------- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // If closing video modal, stop video playback
    if (modalId === 'videoModal') {
      const iframe = document.getElementById('video-frame');
      if (iframe) iframe.src = '';
    }
  }
}

function initModalBackdropListeners() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
}

/* Player Profile Details Modal Trigger */
function openPlayerModal(ign, realName, role, device, sens, kd, weapons, imgSrc) {
  document.getElementById('m-player-title').innerHTML = `<i class="fa-solid fa-sliders" style="color: var(--accent-cyan);"></i> ${ign} Profile`;
  document.getElementById('m-player-ign').textContent = `${ign} (${realName})`;
  document.getElementById('m-player-role').textContent = role;
  document.getElementById('m-player-device').textContent = device;
  document.getElementById('m-player-sens').textContent = sens;
  document.getElementById('m-player-weapons').textContent = `${weapons} · Rating / KD: ${kd}`;
  
  const imgEl = document.getElementById('m-player-img');
  if (imgEl && imgSrc) {
    imgEl.src = imgSrc;
  }

  openModal('playerModal');
}

/* Video Highlight Modal Trigger */
function openVideoModal(videoUrl) {
  const iframe = document.getElementById('video-frame');
  if (iframe) {
    // Autoplay parameter
    iframe.src = videoUrl.includes('?') ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`;
  }
  openModal('videoModal');
}

/* -------------------------------------------------------------------
   8. FORM SUBMISSIONS & TOAST FEEDBACK
   ------------------------------------------------------------------- */
function handleRecruitmentSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('btn-submit-app');
  const ign = document.getElementById('applicant-ign').value;
  const game = document.getElementById('applicant-game').value;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Application...';
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Submit Tryout Application</span>';
    }

    event.target.reset();
    showToast(
      'Application Submitted! 🎯',
      `Welcome ${ign}! Your application for Harda ${game} Division has been recorded. Clan managers will contact your WhatsApp within 24 hours.`
    );
  }, 1000);
}

function handleTournamentRegister(event) {
  event.preventDefault();
  closeModal('tournamentModal');
  event.target.reset();
  showToast(
    'Registration Confirmed! 🏆',
    'Your squad has been registered for the tournament. Room ID & Password will be dispatched on WhatsApp 15 minutes prior to match time.'
  );
}

function handleNewsletter(event) {
  event.preventDefault();
  event.target.reset();
  showToast(
    'Subscribed to Harda Fan Club! ⚡',
    'You are now on the VIP list for upcoming LAN tickets, tournament slots, and official jersey drops.'
  );
}

/* Toast System */
let toastTimeout;
function showToast(title, message) {
  const toast = document.getElementById('toast-notification');
  const titleEl = document.getElementById('toast-title');
  const messageEl = document.getElementById('toast-message');

  if (!toast) return;

  titleEl.textContent = title;
  messageEl.textContent = message;

  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

// Expose modal functions to global window for inline onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;
window.openPlayerModal = openPlayerModal;
window.openVideoModal = openVideoModal;
window.handleRecruitmentSubmit = handleRecruitmentSubmit;
window.handleTournamentRegister = handleTournamentRegister;
window.handleNewsletter = handleNewsletter;
