/* ============================================
   DevotionRun — Landing Page Scripts
   Vanilla JS — No dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize i18n ---
    if (window.DevotionI18n) {
        window.DevotionI18n.initI18n();
    }

    // --- Page Loader ---
    const loader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 400);
    });
    // Fallback: hide loader after 2s even if load event didn't fire
    setTimeout(() => loader.classList.add('hidden'), 2000);

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // --- Mobile menu ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    const toggleMenu = () => {
        const isOpen = navLinks.classList.contains('open');
        navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('visible');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll reveal animations (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Waitlist form ---
    const waitlistForm = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');
    const waitlistBtn = document.getElementById('waitlistBtn');

    if (waitlistForm) {
        waitlistBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();

            if (!email || !isValidEmail(email)) {
                emailInput.style.borderColor = '#ef4444';
                emailInput.focus();
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
                return;
            }

            // Success animation
            waitlistBtn.textContent = '✓ Inscrito!';
            waitlistBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            emailInput.value = '';
            emailInput.disabled = true;
            waitlistBtn.disabled = true;

            setTimeout(() => {
                waitlistBtn.textContent = 'Quero entrar';
                waitlistBtn.style.background = '';
                emailInput.disabled = false;
                waitlistBtn.disabled = false;
            }, 3000);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // --- Counter animation for stat values ---
    const statValues = document.querySelectorAll('.stat-value');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const finalValue = el.textContent;

                // Only animate numeric values
                if (!isNaN(finalValue) && finalValue !== '∞') {
                    const target = parseInt(finalValue);
                    animateCounter(el, 0, target, 1500);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end;
            }
        };

        requestAnimationFrame(update);
    }

    // --- Parallax for floating crosses ---
    const floatingCrosses = document.querySelectorAll('.floating-cross');

    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            floatingCrosses.forEach((cross, i) => {
                const speed = 0.02 + (i * 0.01);
                cross.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // --- Phone frame tilt on mouse move ---
    const phoneFrame = document.querySelector('.phone-frame');

    if (phoneFrame && window.innerWidth > 768) {
        const hero = document.querySelector('.hero-mockup');

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            phoneFrame.style.transform = `
        perspective(1000px)
        rotateY(${x * 8}deg)
        rotateX(${-y * 5}deg)
        translateY(-4px)
      `;
        });

        hero.addEventListener('mouseleave', () => {
            phoneFrame.style.transform = '';
        });
    }

});
