// Initialize Lucide
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// GSAP ScrollTrigger Setup
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Global Animation Settings - Tweak these to control speeds site-wide
const ANIM = {
    speedMultiplier: 0.5, // Lower is faster. 0.5 = 2x speed, 1.0 = normal speed.
    cursorThickness: "3px", // Default thickness
    cursorHoverThickness: "1px", // Thickness when hovering interactive elements
    scrollDuration: 0.8,
    cursorHoverDuration: 0.2,
    heroBadgeDuration: 0.5,
    heroTitleDuration: 0.8,
    heroTitleStagger: 0.015,
    heroDescDuration: 0.6,
    heroBtnsDuration: 0.5,
    heroVisualDuration: 1.2,
    parallaxHeroDuration: 0.5,
    parallaxGridDuration: 0.8
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        const closeMenu = () => {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        mobileMenuClose.addEventListener('click', closeMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Initialize Locomotive Scroll v5
    let scroll;
    if (typeof LocomotiveScroll !== 'undefined' && window.innerWidth > 768) {
        try {
            scroll = new LocomotiveScroll({
                lenisOptions: {
                    duration: ANIM.scrollDuration * ANIM.speedMultiplier,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    smoothTouch: false,
                },
            });

            scroll.on('scroll', ScrollTrigger.update);
        } catch (e) {
            console.log('Locomotive Scroll initialization failed', e);
        }
    }

    // Custom Cursor Logic - Unified for Zero Lag
    const cursor = document.querySelector('.custom-cursor');

    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        // Show cursor only and instantly on first mouse move and apply config thickness
        gsap.set(cursor, { opacity: 0, borderWidth: ANIM.cursorThickness });

        window.addEventListener("mousemove", (e) => {
            gsap.set(cursor, {
                opacity: 1,
                x: e.clientX,
                y: e.clientY,
                xPercent: -50,
                yPercent: -50
            });
        });

        // Hover interactions
        const interactive = document.querySelectorAll('a, button, .service-card, .mobile-link');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 1.6,
                    borderWidth: ANIM.cursorHoverThickness,
                    borderColor: 'rgba(116, 55, 255, 0.6)',
                    backgroundColor: 'rgba(116, 55, 255, 0.05)',
                    duration: ANIM.cursorHoverDuration * ANIM.speedMultiplier,
                    overwrite: 'auto'
                });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    borderWidth: ANIM.cursorThickness,
                    borderColor: 'rgba(116, 55, 255, 0.5)',
                    backgroundColor: 'transparent',
                    duration: ANIM.cursorHoverDuration * ANIM.speedMultiplier,
                    overwrite: 'auto'
                });
            });
        });
    }

    // Hero Section Reveal Animation
    function initHeroAnimation() {
        if (typeof SplitType === 'undefined' || typeof gsap === 'undefined') return;

        const heroTitle = new SplitType('.hero-title', { types: 'chars' });
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.to(".hero-badge", { opacity: 1, y: 0, scale: 1, duration: ANIM.heroBadgeDuration * ANIM.speedMultiplier, delay: 0.1 * ANIM.speedMultiplier });

        if (heroTitle.chars) {
            tl.fromTo(heroTitle.chars,
                {
                    opacity: 0,
                    y: 20,
                    rotateX: -90,
                    z: -500,
                    filter: "blur(5px)"
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    z: 0,
                    filter: "blur(0px)",
                    stagger: {
                        each: ANIM.heroTitleStagger * ANIM.speedMultiplier,
                        from: "random"
                    },
                    duration: ANIM.heroTitleDuration * ANIM.speedMultiplier,
                    ease: "expo.out",
                    clearProps: "transform,filter" // Allows CSS hover to work again
                },
                `-=${0.25 * ANIM.speedMultiplier}`
            );
        }
        tl.to(".hero-desc", { opacity: 1, y: 0, duration: ANIM.heroDescDuration * ANIM.speedMultiplier }, `-=${0.6 * ANIM.speedMultiplier}`)
            .to(".hero-btns", { opacity: 1, y: 0, duration: ANIM.heroBtnsDuration * ANIM.speedMultiplier }, `-=${0.4 * ANIM.speedMultiplier}`)
            .from(".hero-visual", {
                opacity: 0,
                scale: 0.95,
                rotate: -5,
                filter: "blur(5px)",
                duration: ANIM.heroVisualDuration * ANIM.speedMultiplier,
                ease: "expo.out"
            }, `-=${0.8 * ANIM.speedMultiplier}`);
    }

    // Initialize Animations
    if (typeof SplitType !== 'undefined') {
        new SplitType('h2, h3', { types: 'chars' });
        initHeroAnimation();
        // Run this after all SplitTypes so .hero-title chars get the hover class
        document.querySelectorAll('.char').forEach(char => {
            char.classList.add('char-hover');
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // Parallax Background
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX - window.innerWidth / 2) * 0.015;
        const y = (e.clientY - window.innerHeight / 2) * 0.015;
        if (typeof gsap !== 'undefined') {
            gsap.to(".hero-visual", { x: -x * 3, y: -y * 3, duration: 0.25 });
            gsap.to(".grid-pattern", { x: x * 0.5, y: y * 0.5, duration: 0.4 });
        }
    });

    // Canvas Background
    initCanvas();
});

function initCanvas() {
    const canvas = document.getElementById('neuron-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(116, 55, 255, 0.2)';
            ctx.fill();
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(116, 55, 255, ${0.15 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    animate();
}
