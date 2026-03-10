/* =====================================================
   MediVault — Homepage Script
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCarousel();
    initFlowTabs();
    initScrollAnimations();
    initSmoothScroll();
});

/* =====================================================
   NAVBAR — sticky + mobile hamburger
   ===================================================== */
function initNavbar() {
    const hamburger = document.getElementById('navHamburger');
    const navRight = document.getElementById('navRight');

    if (hamburger && navRight) {
        hamburger.addEventListener('click', () => {
            const isOpen = navRight.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on nav link click
        navRight.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navRight.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}

/* =====================================================
   HERO IMAGE CAROUSEL
   autoplay: 4s, fade transition, dot indicators
   ===================================================== */
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;

    let current = 0;
    let timer = null;
    const INTERVAL = 2500;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function startAutoplay() {
        timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    function stopAutoplay() {
        clearInterval(timer);
    }

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            goTo(parseInt(dot.dataset.index, 10));
            startAutoplay();
        });
    });

    // Pause on hover
    const carouselEl = document.getElementById('heroCarousel');
    if (carouselEl) {
        carouselEl.addEventListener('mouseenter', stopAutoplay);
        carouselEl.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
}

/* =====================================================
   USER FLOW TABS + STEP BUBBLE CYCLER
   Auto-cycles Patient → Doctor → Hospital
   Within each panel, steps light up one by one as the
   countdown progresses — the active bubble glows while
   others remain dim. Manual tab click resets the cycle.
   ===================================================== */
function initFlowTabs() {
    const tabs = document.querySelectorAll('.flow-tab');
    const panels = document.querySelectorAll('.flow-panel');
    if (!tabs.length) return;

    const ROLE_CYCLE_MS = 5000; // how long before switching to the next role tab
    const roles = ['patient', 'doctor', 'hospital'];
    let roleIdx = 0;
    let roleTimer = null;
    let stepTimer = null;

    /* ---- Highlight a specific step bubble ---- */
    function setActiveStep(panel, stepIndex) {
        const steps = panel.querySelectorAll('.flow-step');
        steps.forEach((step, i) => {
            const bubble = step.querySelector('.step-bubble');
            const isActive = i === stepIndex;
            bubble.classList.toggle('step-active', isActive);
            step.classList.toggle('step-current', isActive);
        });
    }

    /* ---- Walk steps through in a panel, then switch role tab ---- */
    function runStepCycler(panel) {
        const steps = panel.querySelectorAll('.flow-step');
        const numSteps = steps.length;
        const stepMs = Math.floor(ROLE_CYCLE_MS / numSteps); // e.g. 5 steps → 1000ms each
        let stepIdx = 0;

        // Immediately show step 0
        setActiveStep(panel, stepIdx);

        stepTimer = setInterval(() => {
            stepIdx++;
            if (stepIdx < numSteps) {
                setActiveStep(panel, stepIdx);
            } else {
                // Finished all steps — advance role tab
                clearInterval(stepTimer);
                advanceRole();
            }
        }, stepMs);
    }

    /* ---- Reset all step bubbles in a panel to dim ---- */
    function clearStepHighlights(panel) {
        if (!panel) return;
        panel.querySelectorAll('.flow-step').forEach(step => {
            step.querySelector('.step-bubble').classList.remove('step-active');
            step.classList.remove('step-current');
        });
    }

    /* ---- Activate a role tab and start step cycling ---- */
    function activateRole(role, isManual = false) {
        // Clear any running timers
        clearInterval(stepTimer);
        clearInterval(roleTimer);

        // Update tab buttons
        tabs.forEach(t => {
            const isActive = t.dataset.role === role;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', String(isActive));
        });

        // Clear old panel highlights, activate new panel
        panels.forEach(p => {
            clearStepHighlights(p);
            const isActive = p.id === `panel-${role}`;
            p.classList.toggle('active', isActive);
        });

        roleIdx = roles.indexOf(role);

        // Start step cycler on the now-active panel
        const activePanel = document.getElementById(`panel-${role}`);
        if (activePanel) {
            runStepCycler(activePanel);
        }
    }

    /* ---- Move to next role ---- */
    function advanceRole() {
        const nextRole = roles[(roleIdx + 1) % roles.length];
        activateRole(nextRole, false);
    }

    /* ---- Manual tab click ---- */
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateRole(tab.dataset.role, true);
        });
    });

    // Kick off
    activateRole('patient', false);
}

/* =====================================================
   SCROLL ANIMATIONS  (Intersection Observer)
   Target: [data-aos] and .feature-card
   ===================================================== */
function initScrollAnimations() {
    const targets = document.querySelectorAll('.feature-card[data-aos], [data-aos]');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(el => observer.observe(el));

    // Also observe plain feature cards (they have their own transition)
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

/* =====================================================
   SMOOTH SCROLL for anchor links
   ===================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a.js-smooth, a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
