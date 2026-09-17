/* ================================================
   NAVBAR: sticky background + mobile menu
================================================= */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function handleNavScroll(){
  if(window.scrollY > 20){
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
handleNavScroll();
window.addEventListener('scroll', handleNavScroll, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link, .mobile-cv-btn').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

/* Active link highlight on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function handleActiveLink(){
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if(window.scrollY >= sectionTop){
      current = section.getAttribute('id');
    }
  });
  navLinkEls.forEach(link => {
    link.classList.remove('active-link');
    link.removeAttribute('aria-current');
    if(link.getAttribute('href') === `#${current}`){
      link.classList.add('active-link');
      link.setAttribute('aria-current', 'page');
    }
  });
}
window.addEventListener('scroll', handleActiveLink, { passive: true });

/* ================================================
   TYPING ANIMATION — job titles
================================================= */
const roles = ['Software Engineer', 'Full Stack Developer'];
const typedEl = document.getElementById('typedRole');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let roleIndex = 0, charIndex = 0, deleting = false;

if(reducedMotion){
  typedEl.textContent = roles[0];
} else {
  typeLoop();
}

function typeLoop(){
  const currentRole = roles[roleIndex];

  if(!deleting){
    charIndex++;
    typedEl.textContent = currentRole.slice(0, charIndex);
    if(charIndex === currentRole.length){
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = currentRole.slice(0, charIndex);
    if(charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 85);
}

/* ================================================
   PARTICLE NETWORK BACKGROUND (canvas)
================================================= */
(function particleNetwork(){
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;
  const isMobile = () => window.innerWidth < 768;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles(){
    const count = isMobile() ? 26 : 55;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function step(){
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0 || p.x > width) p.vx *= -1;
      if(p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.45)';
      ctx.fill();
    });

    const linkDist = isMobile() ? 110 : 150;
    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < linkDist){
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if(!prefersReducedMotion){
      requestAnimationFrame(step);
    }
  }

  resize();
  createParticles();
  step();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
      if(prefersReducedMotion) step();
    }, 200);
  });
})();

/* ================================================
   SCROLL REVEAL ANIMATIONS
================================================= */
const revealEls = document.querySelectorAll('.reveal');

if(revealEls.length){
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    if(reducedMotion){
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });
}

/* ================================================
   ANIMATED STATISTICS COUNTERS
================================================= */
const statEls = document.querySelectorAll('.stat-number[data-target]');

function animateCounter(el){
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
    if(progress < 1){
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(tick);
}

if(statEls.length){
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;

      if(reducedMotion){
        el.textContent = parseInt(el.dataset.target, 10).toLocaleString() + (el.dataset.suffix || '');
      } else {
        animateCounter(el);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  statEls.forEach(el => statsObserver.observe(el));
}

/* ================================================
   SKILL PROGRESS BAR ANIMATIONS
================================================= */
const skillCards = document.querySelectorAll('.skill-card[data-progress]');

function animateSkillCard(card){
  const progress = parseInt(card.dataset.progress, 10);
  card.style.setProperty('--progress', `${progress}%`);
  card.classList.add('is-animated');
}

if(skillCards.length){
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const card = entry.target;

      if(reducedMotion){
        animateSkillCard(card);
      } else {
        animateSkillCard(card);
      }

      observer.unobserve(card);
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -20px 0px' });

  skillCards.forEach(card => skillObserver.observe(card));
}

/* ================================================
   PROJECT FILTER BY TECHNOLOGY
================================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectsEmpty = document.getElementById('projectsEmpty');

if(filterBtns.length && projectCards.length){
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      let visibleCount = 0;

      projectCards.forEach(card => {
        const techs = (card.dataset.tech || '').toLowerCase().split(/\s+/);
        let show = false;
        if (filter === 'all') {
          show = true;
        } else if (filter.includes(',')) {
          const filterList = filter.split(',').map(f => f.trim().toLowerCase());
          show = filterList.some(f => techs.includes(f));
        } else {
          show = techs.includes(filter.toLowerCase());
        }
        card.classList.toggle('is-hidden', !show);
        if(show) visibleCount++;
      });

      if(projectsEmpty){
        projectsEmpty.hidden = visibleCount > 0;
        if(filter === 'figma'){
          projectsEmpty.textContent = 'Figma projects coming soon! Check back later.';
        } else {
          projectsEmpty.textContent = 'No projects found for this technology.';
        }
      }
    });
  });
}

/* ================================================
   EXPERIENCE TIMELINE LINE ANIMATION
================================================= */
const experienceTimeline = document.getElementById('experienceTimeline');

if(experienceTimeline){
  if(reducedMotion){
    experienceTimeline.classList.add('is-visible');
  } else {
    const timelineObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    timelineObserver.observe(experienceTimeline);
  }
}

/* ================================================
   CONTACT FORM VALIDATION & TOAST
================================================= */
const contactForm = document.getElementById('contactForm');
const contactToast = document.getElementById('contactToast');
const toastClose = document.getElementById('toastClose');

const formFields = [
  {
    input: document.getElementById('contactName'),
    error: document.getElementById('contactNameError'),
    validate(value){
      if(!value.trim()) return 'Please enter your name.';
      if(value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }
  },
  {
    input: document.getElementById('contactEmail'),
    error: document.getElementById('contactEmailError'),
    validate(value){
      if(!value.trim()) return 'Please enter your email.';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    }
  },
  {
    input: document.getElementById('contactSubject'),
    error: document.getElementById('contactSubjectError'),
    validate(value){
      if(!value.trim()) return 'Please enter a subject.';
      if(value.trim().length < 3) return 'Subject must be at least 3 characters.';
      return '';
    }
  },
  {
    input: document.getElementById('contactMessage'),
    error: document.getElementById('contactMessageError'),
    validate(value){
      if(!value.trim()) return 'Please enter your message.';
      if(value.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  }
];

function setFieldError(field, message){
  field.input.classList.toggle('is-invalid', Boolean(message));
  field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
  field.error.textContent = message;
}

function validateField(field){
  const message = field.validate(field.input.value);
  setFieldError(field, message);
  return !message;
}

function showToast(){
  if(!contactToast) return;

  contactToast.hidden = false;
  requestAnimationFrame(() => {
    contactToast.classList.add('is-visible');
  });

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(hideToast, 5000);
}

function hideToast(){
  if(!contactToast) return;

  contactToast.classList.remove('is-visible');
  setTimeout(() => {
    contactToast.hidden = true;
  }, 500);
}

if(toastClose){
  toastClose.addEventListener('click', hideToast);
}

if(contactForm){
  formFields.forEach(field => {
    field.input.addEventListener('input', () => {
      if(field.input.classList.contains('is-invalid')){
        validateField(field);
      }
    });

    field.input.addEventListener('blur', () => {
      if(field.input.value.trim()){
        validateField(field);
      }
    });
  });

  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const isValid = formFields.every(field => validateField(field));
    if(!isValid){
      const firstInvalid = formFields.find(field => field.input.classList.contains('is-invalid'));
      firstInvalid?.input.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast();
      contactForm.reset();
      formFields.forEach(field => setFieldError(field, ''));
      submitBtn.disabled = false;
    }, 600);
  });
}

/* ================================================
   SCROLL TO TOP BUTTON
================================================= */
const scrollTopBtn = document.getElementById('scrollTopBtn');

if(scrollTopBtn){
  function toggleScrollTop(){
    const show = window.scrollY > 400;
    scrollTopBtn.classList.toggle('is-visible', show);
    scrollTopBtn.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  toggleScrollTop();
  window.addEventListener('scroll', toggleScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  });
}

/* ================================================
   VIDEO DEMO MODAL (YOUTUBE EMBED)
================================================= */
const videoModal = document.getElementById('videoModal');
const videoModalBackdrop = document.getElementById('videoModalBackdrop');
const videoModalClose = document.getElementById('videoModalClose');
const uniwikiDemoBtn = document.getElementById('uniwikiDemoBtn');
const demoVideoIframe = document.getElementById('demoVideoIframe');
const demoVideoPlayer = document.getElementById('demoVideoPlayer');

if(videoModal && uniwikiDemoBtn){
  function openVideoModal(){
    // Load YouTube video when modal opens (starts autoplay cleanly)
    if(demoVideoIframe){
      const targetSrc = demoVideoIframe.getAttribute('data-src') || 'https://www.youtube-nocookie.com/embed/v-snm2Ziv3o?autoplay=1&rel=0';
      if(demoVideoIframe.src !== targetSrc){
        demoVideoIframe.src = targetSrc;
      }
    }
    videoModal.hidden = false;
    requestAnimationFrame(() => {
      videoModal.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    if(videoModalClose) videoModalClose.focus();
    if(demoVideoPlayer){
      demoVideoPlayer.currentTime = 0;
      demoVideoPlayer.play().catch(() => {});
    }
  }

  function closeVideoModal(){
    videoModal.classList.remove('is-open');
    // Stop YouTube video playback and audio immediately on close
    if(demoVideoIframe){
      demoVideoIframe.src = '';
    }
    if(demoVideoPlayer){
      demoVideoPlayer.pause();
    }
    setTimeout(() => {
      videoModal.hidden = true;
      document.body.style.overflow = '';
      uniwikiDemoBtn.focus();
    }, 300);
  }

  uniwikiDemoBtn.addEventListener('click', e => {
    e.preventDefault();
    openVideoModal();
  });

  if(videoModalClose){
    videoModalClose.addEventListener('click', closeVideoModal);
  }

  if(videoModalBackdrop){
    videoModalBackdrop.addEventListener('click', closeVideoModal);
  }

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && !videoModal.hidden){
      closeVideoModal();
    }
  });
}

