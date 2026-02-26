/**
 * Newton JEE — Shared JavaScript
 * shared.js  ·  Linked by all HTML pages in the V2 directory
 *
 * Features:
 *  1. FAQ accordion (works with .faq-q / .chevron / .ch / .faq-a)
 *  2. Scroll-reveal animation (IntersectionObserver on .reveal)
 *  3. Course-card mouse-glow follower
 *  4. Curriculum week accordion (course pages)
 *  5. Tab navigation (pricing page)
 *  6. Active nav link highlighting based on current page
 *  7. Sticky header shadow on scroll
 *  8. Mobile hamburger menu toggle
 */

(function () {
    'use strict';

    /* ── 1. FAQ ACCORDION ─────────────────────────────────────────── */
    function initFAQ() {
        document.querySelectorAll('.faq-q').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.parentElement;
                var isOpen = item.classList.contains('open');
                // Close all first
                document.querySelectorAll('.faq-item').forEach(function (i) {
                    i.classList.remove('open');
                });
                // Open clicked (toggle)
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    /* ── 2. SCROLL REVEAL ─────────────────────────────────────────── */
    function initScrollReveal() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    // Stagger child cards
                    e.target.querySelectorAll(
                        '.course-card, .why-tile, .path-card, .testi-card, .cert-step, .bundle-card'
                    ).forEach(function (el, i) {
                        el.style.transitionDelay = (i * 60) + 'ms';
                        el.classList.add('reveal', 'visible');
                    });
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ── 3. COURSE CARD MOUSE GLOW ────────────────────────────────── */
    function initCardGlow() {
        document.querySelectorAll('.course-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width) * 100;
                var y = ((e.clientY - rect.top) / rect.height) * 100;
                var glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.background =
                        'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(245,158,11,0.1), transparent 60%)';
                }
            });
        });
    }

    /* ── 4. CURRICULUM WEEK ACCORDION (course pages) ──────────────── */
    function initWeekAccordion() {
        document.querySelectorAll('.week-header').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.parentElement;
                item.classList.toggle('open');
            });
        });
    }

    /* ── 5. TAB NAVIGATION (pricing page) ────────────────────────── */
    function initTabs() {
        var tabBtns = document.querySelectorAll('.tab-nav button[data-tab]');
        if (!tabBtns.length) return;

        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var target = btn.dataset.tab;

                // Update button states
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                // Update panel visibility
                document.querySelectorAll('.tab-panel').forEach(function (panel) {
                    panel.classList.remove('active');
                });
                var panel = document.getElementById('tab-' + target);
                if (panel) panel.classList.add('active');

                // Re-observe any newly revealed elements
                document.querySelectorAll('#tab-' + target + ' .reveal').forEach(function (el) {
                    el.classList.add('visible');
                });
            });
        });
    }

    /* ── 6. ACTIVE NAV LINK HIGHLIGHTING ──────────────────────────── */
    function initActiveNav() {
        var path = window.location.pathname.toLowerCase();
        var filename = path.split('/').pop() || 'index';

        document.querySelectorAll('nav a').forEach(function (link) {
            var href = (link.getAttribute('href') || '').toLowerCase();
            if (!href || href === '#') return;

            var linkFile = href.split('/').pop();

            // Mark active when filenames match or link fragment matches section
            if (
                (linkFile && filename.indexOf(linkFile.replace('.html', '')) !== -1) ||
                (linkFile && linkFile.indexOf(filename.replace('.html', '')) !== -1)
            ) {
                link.classList.add('active');
            }
        });
    }

    /* ── 7. STICKY HEADER SHADOW ──────────────────────────────────── */
    function initHeaderShadow() {
        var header = document.querySelector('header');
        if (!header) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 24px rgba(0,0,0,0.4)';
            } else {
                header.style.boxShadow = 'none';
            }
        }, { passive: true });
    }

    /* ── 8. MOBILE HAMBURGER MENU ─────────────────────────────────── */
    function initMobileMenu() {
        var toggle = document.querySelector('.menu-toggle');
        var nav = document.querySelector('nav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
            toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });

        // Close menu when a nav link is clicked
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.textContent = '☰';
            });
        });
    }

    /* ── 9. COURSE "KNOW MORE" BUTTONS → course pages ─────────────── */
    /**
     * Maps each course card's h3 text to its dedicated HTML page.
     * Clicking "Know More" navigates to the correct course page.
     */
    var COURSE_PAGE_MAP = {
        'python for ai': 'course-python-for-ai.html',
        'python for ai & data science': 'course-python-for-ai.html',
        'statistics & math for ml': 'course-statistics-math-ml.html',
        'machine learning mastery': 'course-machine-learning.html',
        'deep learning & computer vision': 'course-deep-learning-cv.html',
        'nlp & text mining': 'course-nlp-text-mining.html',
        'generative ai & llms': 'course-generative-ai-llms.html',
        'mlops & deployment': 'course-mlops-ai-engineering.html',
        'mlops & ai engineering': 'course-mlops-ai-engineering.html',
        'computer vision': 'course-computer-vision.html',
        'ai capstone project': 'course-computer-vision.html', // placeholder
    };

    function initCourseCardLinks() {
        document.querySelectorAll('.course-card').forEach(function (card) {
            var h3 = card.querySelector('h3');
            var btn = card.querySelector('.btn-know');
            if (!h3 || !btn) return;

            var key = h3.textContent.trim().toLowerCase();
            var page = COURSE_PAGE_MAP[key];

            if (page) {
                btn.addEventListener('click', function () {
                    window.location.href = page;
                });
                // Also make the whole card clickable
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    if (e.target !== btn) window.location.href = page;
                });
            }
        });
    }

    /* ── INIT ALL ─────────────────────────────────────────────────── */
    function init() {
        initFAQ();
        initScrollReveal();
        initCardGlow();
        initWeekAccordion();
        initTabs();
        initActiveNav();
        initHeaderShadow();
        initMobileMenu();
        initCourseCardLinks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
