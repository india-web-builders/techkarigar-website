// Tailwind Configuration moved to inline script in HTML files
// Initialize Lucide
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// GSAP ScrollTrigger Setup
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic (Moved to top for reliability)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            // Re-run icon creation to ensure icons in the menu are rendered
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

    // Initialize Locomotive Scroll v5 (buttery smooth scrolling)
    let scroll;
    if (typeof LocomotiveScroll !== 'undefined') {
        try {
            scroll = new LocomotiveScroll({
                lenisOptions: {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    smoothTouch: false,
                },
            });

            // Sync Locomotive Scroll with GSAP ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                // Locomotive v5 (Lenis) uses native scroll, so we don't need scrollerProxy
                // Just update ScrollTrigger on scroll
                scroll.on('scroll', ScrollTrigger.update);
            }
        } catch (e) {
            console.log('Locomotive Scroll initialization failed', e);
        }
    }

    // Enhanced Custom Cursor with Velocity-Based Warp
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");
    let mouseX = 0, mouseY = 0;
    let prevX = 0, prevY = 0;
    let velocity = 0;

    if (dot && outline && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Calculate velocity for warp effect
            const dx = mouseX - prevX;
            const dy = mouseY - prevY;
            velocity = Math.sqrt(dx * dx + dy * dy);

            if (typeof gsap !== 'undefined') {
                gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, opacity: 1 });
                gsap.to(outline, {
                    x: mouseX,
                    y: mouseY,
                    duration: 0.3,
                    opacity: 1,
                    scale: 1 + (velocity * 0.01), // Scale based on speed
                    rotation: velocity * 2 // Rotate based on speed
                });
            }

            prevX = mouseX;
            prevY = mouseY;
        });
    }

    // Character Hover Zoom Effect - Split ALL headings
    if (typeof SplitType !== 'undefined') {
        try {
            const heroTitle = new SplitType('.hero-title', { types: 'chars' });
            const allHeadings = new SplitType('h2, h3', { types: 'chars' });

            // Add hover class to all characters
            document.querySelectorAll('.char').forEach(char => {
                char.classList.add('char-hover');
            });

            // Cinematic Hero Sequence with 3D Transforms
            if (typeof gsap !== 'undefined') {
                const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

                tl.to(".hero-badge", { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.3 });

                if (heroTitle && heroTitle.chars) {
                    tl.fromTo(heroTitle.chars,
                        {
                            opacity: 0,
                            y: 120,
                            rotateX: -90,
                            rotateY: 45,
                            z: -200,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            rotateY: 0,
                            z: 0,
                            stagger: {
                                each: 0.03,
                                from: "random"
                            },
                            duration: 1.8,
                            ease: "expo.out"
                        },
                        "-=0.6"
                    );
                }

                tl.to(".hero-desc", { opacity: 1, y: 0, duration: 1.2 }, "-=1.2")
                    .to(".hero-btns", { opacity: 1, y: 0, duration: 1 }, "-=0.9")
                    .from(".hero-visual", {
                        opacity: 0,
                        scale: 0.7,
                        rotate: -30,
                        filter: "blur(20px)",
                        duration: 2.5,
                        ease: "expo.out"
                    }, "-=1.8");
            }
        } catch (e) {
            console.log('SplitType or GSAP error', e);
        }
    }

    // Magnetic effect removed as per user request


    if (typeof gsap !== 'undefined') {
        // FAQ Accordion Animation is kept as it is interaction based
    }

    // FAQ Accordion Animation
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // Cinematic Pause States
    const pauseMarkers = [25, 50, 75].map(percent => {
        const marker = document.createElement('div');
        marker.className = 'pause-marker';
        marker.style.top = `${percent}vh`;
        document.body.appendChild(marker);
        return { element: marker, percent };
    });

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        pauseMarkers.forEach(({ element, percent }) => {
            if (Math.abs(scrollPercent - percent) < 2) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });

        // Navbar Evolution
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('glass', 'py-4', 'border-b', 'border-white/5');
                nav.classList.remove('py-6');
            } else {
                nav.classList.remove('glass', 'py-4', 'border-b', 'border-white/5');
                nav.classList.add('py-6');
            }
        }
    });

    // Parallax Background Movement
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX - window.innerWidth / 2) * 0.015;
        const y = (e.clientY - window.innerHeight / 2) * 0.015;

        if (typeof gsap !== 'undefined') {
            gsap.to(".hero-visual", { x: -x * 3, y: -y * 3, duration: 1.5 });
            gsap.to(".grid-pattern", { x: x * 0.5, y: y * 0.5, duration: 2 });
        }
    });

    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.addEventListener('refresh', () => scroll && scroll.update());
        ScrollTrigger.refresh();
    }

    // Neuron Network Animation
    const canvas = document.getElementById('neuron-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const neurons = [];
        const neuronCount = 80;
        const connectionDistance = 150;

        class Neuron {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) {
                    this.vx *= -1;
                    this.x = Math.max(0, Math.min(canvas.width, this.x));
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.vy *= -1;
                    this.y = Math.max(0, Math.min(canvas.height, this.y));
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(26, 47, 251, 0.6)';
                ctx.fill();
            }
        }

        for (let i = 0; i < neuronCount; i++) {
            neurons.push(new Neuron());
        }

        function animateNeurons() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const rect = canvas.getBoundingClientRect();
            const localMouseX = mouseX - rect.left;
            const localMouseY = mouseY - rect.top;

            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                neurons.forEach(neuron => {
                    neuron.update();
                    neuron.draw();
                });

                for (let i = 0; i < neurons.length; i++) {
                    for (let j = i + 1; j < neurons.length; j++) {
                        const dx = neurons[i].x - neurons[j].x;
                        const dy = neurons[i].y - neurons[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < connectionDistance) {
                            const opacity = (1 - distance / connectionDistance) * 0.3;
                            ctx.beginPath();
                            ctx.moveTo(neurons[i].x, neurons[i].y);
                            ctx.lineTo(neurons[j].x, neurons[j].y);
                            ctx.strokeStyle = `rgba(116, 55, 255, ${opacity})`;
                            ctx.stroke();
                        }
                    }

                    const dx = neurons[i].x - localMouseX;
                    const dy = neurons[i].y - localMouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(neurons[i].x, neurons[i].y);
                        ctx.lineTo(localMouseX, localMouseY);
                        ctx.strokeStyle = `rgba(193, 255, 0, ${opacity})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateNeurons);
        }
        animateNeurons();
    }
});
