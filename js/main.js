/* Genesis Education — main.js */

(function () {
  'use strict';

  // ── Hamburger toggle ──────────────────────────────────────
  const toggle   = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('is-open');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks && navLinks.classList.contains('is-open') && !e.target.closest('.nav')) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // ── Active nav link by filename ───────────────────────────
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── Terms page: highlight TOC link on scroll ──────────────
  const tocLinks = document.querySelectorAll('.terms-toc__link');
  if (tocLinks.length) {
    const sections = document.querySelectorAll('.terms-section[id]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('terms-toc__link--active'));
          const active = document.querySelector(`.terms-toc__link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('terms-toc__link--active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  // ── Scroll reveal (fade + rise) ───────────────────────────
  // One shared list covering every page's repeating blocks/cards, so the
  // motion is identical site-wide rather than page-by-page.
  const revealSelectors = [
    // Hero + intro blocks (index, case-studies, education-solutions, why-pbl)
    '.hero__content', '.problem-photo',
    // FAQ / Terms / Contact heroes
    '.faq-hero__left', '.faq-hero__right', '.terms-hero', '.contact-hero__left', '.contact-hero__right',
    // Home page
    '.offerings-card', '.step-box', '.falls-short-card', '.homepbl__text', '.homepbl__card',
    '.quote-section__quote', '.philosophy__text', '.philosophy__graphic',
    '.outcome-tile', '.impact-stat', '.impact-item', '.wg-col', '.wg-dark-card',
    '.project-step', '.popular-card', '.cta-banner', '.skill-pills',
    // Contact page
    '.contact-form-wrap', '.connect-card', '.find-us__left', '.find-us__right',
    // Case studies / Education solutions
    '.cs-tile', '.breakdown-item', '.offer-item', '.who-card',
    // Why PBL
    '.approach-item', '.unlock-item', '.unlocking-card', '.hiw-step',
    // FAQ
    '.faq-row',
    // Terms
    '.terms-section'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (revealEls.length) {
    // Stagger relative to position within its own parent, so each grid/list
    // starts its cascade from 0ms instead of drifting with a page-wide count.
    revealEls.forEach(el => {
      el.classList.add('reveal');
      const siblingIndex = el.parentElement
        ? Array.from(el.parentElement.children).indexOf(el)
        : 0;
      el.style.transitionDelay = `${Math.min(siblingIndex, 5) * 90}ms`;
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => revealObserver.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }
})();
