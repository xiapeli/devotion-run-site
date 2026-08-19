document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile menu ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Waitlist form ---
    const waitlistForm = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');
    const waitlistBtn = document.getElementById('waitlistBtn');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!email || !isValidEmail(email)) {
                emailInput.style.borderColor = '#ef4444';
                emailInput.focus();
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
                return;
            }

            waitlistBtn.textContent = '✓ Na lista';
            waitlistBtn.disabled = true;
            emailInput.disabled = true;

            setTimeout(() => {
                waitlistBtn.textContent = 'Entrar na lista';
                waitlistBtn.disabled = false;
                emailInput.disabled = false;
                emailInput.value = '';
            }, 3000);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
