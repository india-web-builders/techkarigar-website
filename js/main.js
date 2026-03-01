/* =========================================
   TechKarigar — main.js
   ========================================= */

// ===== TYPEWRITER =====
const TYPEWRITER_PHRASES = [
    'Lightning-fast websites that convert.',
    'Mobile apps for Android & iOS.',
    'SEO that brings customers to you.',
    'Automation that saves hours daily.',
    'AI workflows for smarter business.',
];

function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const current = TYPEWRITER_PHRASES[phraseIndex];

        if (isDeleting) {
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 35 : 65;

        if (!isDeleting && charIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
            delay = 350;
        }

        setTimeout(tick, delay);
    }

    // Start after hero entrance animation
    setTimeout(tick, 1800);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function initCounters() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('.counter').forEach((el) => observer.observe(el));
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach((item) => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
            // Re-render icons after DOM change
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');

    if (!btn || !menu) return;

    const open = () => {
        menu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    const close = () => {
        menu.classList.add('hidden');
        document.body.style.overflow = '';
    };

    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    links.forEach((link) => link.addEventListener('click', close));
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 60) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        },
        { passive: true }
    );
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;
    if (typeof gsap === 'undefined') return;

    gsap.set(cursor, { opacity: 0, xPercent: -50, yPercent: -50 });

    let visible = false;
    window.addEventListener('mousemove', (e) => {
        if (!visible) {
            gsap.set(cursor, { opacity: 1 });
            visible = true;
        }
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
    });

    const interactive = document.querySelectorAll(
        'a, button, .service-card, .faq-item, .testimonial-card, .stat-card'
    );

    interactive.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 1.8,
                borderColor: 'rgba(193, 255, 0, 0.7)',
                duration: 0.2,
                overwrite: 'auto',
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                borderColor: 'rgba(116, 55, 255, 0.6)',
                duration: 0.2,
                overwrite: 'auto',
            });
        });
    });
}

// ===== HERO ENTRANCE ANIMATION =====
function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.5, delay: 0.2 });

    // Split hero title into chars if SplitType is available
    if (typeof SplitType !== 'undefined') {
        const split = new SplitType('.hero-title', { types: 'chars,words' });

        tl.fromTo(
            split.chars,
            { opacity: 0, y: 40, rotateX: -70, filter: 'blur(8px)' },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                stagger: { each: 0.012, from: 'random' },
                duration: 0.9,
                ease: 'expo.out',
                clearProps: 'transform,filter',
            },
            0.1
        );

        // Add hover class after animation completes
        tl.call(() => {
            split.chars.forEach((c) => c.classList.add('char-hover'));
        });
    } else {
        // Fallback: just fade in the title
        tl.from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, 0.2);
    }

    tl.to('.hero-desc', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .to('.hero-btns', { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
        .to('.hero-stats', { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
}

// ===== CANVAS BACKGROUND =====
function initCanvas() {
    const canvas = document.getElementById('neuron-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 28 : 65;
    const maxDist = isMobile ? 100 : 130;

    const COLORS = [
        '116, 55, 255',   // purple
        '0, 229, 255',    // cyan
        '193, 255, 0',    // lime (sparse)
    ];

    const COLOR_WEIGHTS = [0, 0, 0, 0, 1, 1, 2]; // weighted: mostly purple/cyan

    let mouse = { x: -9999, y: -9999 };
    let animId;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : (Math.random() < 0.5 ? -10 : canvas.height + 10);
            this.vx = (Math.random() - 0.5) * 1.0;
            this.vy = (Math.random() - 0.5) * 1.0;
            this.radius = Math.random() * 1.5 + 0.5;
            const w = COLOR_WEIGHTS[Math.floor(Math.random() * COLOR_WEIGHTS.length)];
            this.color = COLORS[w];
            this.alpha = Math.random() * 0.35 + 0.15;
        }

        update() {
            // Gentle mouse repulsion
            if (!isMobile) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const force = (150 - dist) / 150;
                    this.vx += (dx / dist) * force * 0.04;
                    this.vy += (dy / dist) * force * 0.04;
                }
            }

            // Speed cap
            const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (spd > 1.8) {
                this.vx = (this.vx / spd) * 1.8;
                this.vy = (this.vy / spd) * 1.8;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                // Avoid sqrt when possible
                const distSq = dx * dx + dy * dy;
                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const alpha = 0.1 * (1 - dist / maxDist);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${particles[i].color}, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(animate);
    }

    if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
        }, 200);
    }, { passive: true });

    resize();
    for (let i = 0; i < count; i++) particles.push(new Particle());
    animate();
}

// ===== SUBTLE PARALLAX ON MOUSE MOVE =====
function initParallax() {
    if (window.innerWidth < 768 || typeof gsap === 'undefined') return;

    document.addEventListener(
        'mousemove',
        (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to('.grid-pattern', {
                x: x * 10,
                y: y * 10,
                duration: 1.2,
                ease: 'power1.out',
            });
            gsap.to('.orb-purple', {
                x: x * -20,
                y: y * -20,
                duration: 2,
                ease: 'power1.out',
            });
        },
        { passive: true }
    );
}

// ===== WAIT FOR GSAP THEN INIT =====
function waitForGSAP(cb, attempts = 0) {
    if (typeof gsap !== 'undefined') {
        cb();
    } else if (attempts < 40) {
        setTimeout(() => waitForGSAP(cb, attempts + 1), 75);
    }
}

// ===== MAIN INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Non-GSAP inits (instant)
    initMobileMenu();
    initFAQ();
    initScrollReveal();
    initCounters();
    initNavbar();
    initCanvas();

    // Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Re-run lucide after a short delay (covers deferred load)
    setTimeout(() => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 500);

    // GSAP-dependent inits
    waitForGSAP(() => {
        initHeroAnimation();
        initCustomCursor();
        initParallax();
        initTypewriter();
    });
});
