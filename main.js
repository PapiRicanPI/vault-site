/**
 * THE VAULT INVESTIGATES / TRUTHDROP.IO
 * main.js — Minimal interaction layer
 * Phase 1 Build
 *
 * Responsibilities:
 * - Mobile navigation toggle
 * - Sticky nav shadow on scroll
 * - Smooth anchor scroll behavior fallback
 * - Active nav link detection
 * - No gratuitous effects, no animations on content
 */

(function () {
  'use strict';

  // ── MOBILE NAVIGATION ────────────────────────────────────────
  const toggle = document.querySelector('.nav__mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('is-open');

      // Trap focus within menu when open
      if (!isExpanded) {
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Close when clicking outside the nav
    document.addEventListener('click', function (e) {
      const nav = document.querySelector('.nav');
      if (nav && !nav.contains(e.target) && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── STICKY NAV SCROLL SHADOW ─────────────────────────────────
  const nav = document.querySelector('.nav');

  if (nav) {
    const onScroll = function () {
      if (window.scrollY > 8) {
        nav.style.boxShadow = '0 1px 20px rgba(0,0,0,0.5)';
      } else {
        nav.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on load in case page is already scrolled
  }

  // ── ACTIVE NAV LINK DETECTION ─────────────────────────────────
  // Marks the current page's nav link as active based on the URL.
  // Supplements any server-side active state.
  (function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = href.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('nav__link--active');
        link.setAttribute('aria-current', 'page');
      }
    });
  })();

  // ── SMOOTH ANCHOR SCROLL (CSS fallback for older browsers) ────
  // Only needed where CSS scroll-behavior: smooth is not supported.
  // Modern browsers handle this via CSS. This is a belt-and-suspenders
  // for the anchor navigation on the About page.
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update URL without triggering scroll again
        if (history.pushState) {
          history.pushState(null, '', '#' + targetId);
        }

        // Move focus to target for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // ── STAT BAR: LIVE STATUS PULSE ──────────────────────────────
  // The "ACTIVE" status indicator on the homepage stat bar gets
  // a subtle visual treatment to signal it is a live system status,
  // not static copy. No animation on content — only on the status
  // indicator where motion carries functional meaning.
  //
  // SWAP: Once DOJ scanner runs, replace "SEEDING" and "PENDING"
  // values with live data fetched from the API if available.
  const statStatus = document.getElementById('stat-status');
  if (statStatus && statStatus.textContent.trim() === 'ACTIVE') {
    statStatus.style.color = 'var(--vault-gold)';
  }

  // ── EXTERNAL LINK SAFETY ─────────────────────────────────────
  // Ensure all external links (those going to different domains)
  // have rel="noopener noreferrer" as a security baseline.
  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener')) {
      link.setAttribute('rel', (rel + ' noopener noreferrer').trim());
    }
  });

  // ── REDUCED MOTION RESPECT ───────────────────────────────────
  // Check for user preference and disable the badge pulse animation
  // if they prefer reduced motion. CSS handles most of this, but
  // any JS-driven animations should also check here.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.badge--active').forEach(function (badge) {
      const dot = badge.querySelector('::before');
      // CSS animation is already paused via the media query in style.css
      // This is a safety net for any future JS-driven motion additions
    });
  }

})();
