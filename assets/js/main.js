/* ==========================================================================
   JUGGERNAUT — SACRED TECH / ISKCON BHAKTI ENGINE (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. HERO PARTICLE CANVAS (SACRED SAFFRON & GOLD PARTICLES)
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.6 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                
                // Fetch Kesar Saffron accent color from CSS variables
                const kesarColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--accent-kesar').trim() || '#FF7D00';
                
                ctx.fillStyle = kesarColor;
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            particlesArray = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
            for (let i = 0; i < particleCount; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 120;
            const kesarColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-kesar').trim() || '#FF7D00';

            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a + 1; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.save();
                        ctx.globalAlpha = (1 - distance / maxDistance) * 0.15;
                        ctx.strokeStyle = kesarColor;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();
    }

    /* ----------------------------------------------------------------------
       2. DARK / LIGHT MODE TOGGLE (CHANDAN LIGHT & OBSIDIAN DARK)
       ---------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('juggernaut-theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('juggernaut-theme', isDark ? 'dark' : 'light');
        });
    }

    /* ----------------------------------------------------------------------
       3. ABOUT / TIMELINE TABBED NAVIGATION
       ---------------------------------------------------------------------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    /* ----------------------------------------------------------------------
       4. BLOG FILTER SYSTEM
       ---------------------------------------------------------------------- */
    const filterChips = document.querySelectorAll('.filter-chip');
    const articleCards = document.querySelectorAll('.article-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-filter');

            articleCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       5. INTERACTIVE ARTICLE MODAL
       ---------------------------------------------------------------------- */
    const modalOverlay = document.getElementById('article-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const articlesData = {
        1: {
            title: "Architecting Unstoppable Systems: The Engineering Behind Juggernaut",
            body: `<p>Just as the massive Rath Yatra chariots move forward with relentless momentum, modern software architectures must be engineered to sustain scale without collapsing under pressure.</p>
                   <p>In this deep dive, we explore event-driven pipelines, distributed consensus algorithms, and fault-tolerant state persistence.</p>
                   <blockquote class="origin-highlight">"Dynamic inertia is not an accident; it is the result of deliberate alignment."</blockquote>`
        },
        2: {
            title: "Vedic Wisdom Meets High-Performance Software Architecture",
            body: `<p>The timeless principles of Vedic philosophy offer profound lessons for modern systems engineers. Concepts like <em>Sankalpa</em> (focused intent) map directly to deterministic state management.</p>`
        },
        3: {
            title: "Building Micro-Frontends with Clean Component Boundaries",
            body: `<p>Monolithic frontends often turn into fragile webs of tight coupling. Micro-frontends decompose application surfaces into independent, isolated domains.</p>`
        },
        4: {
            title: "The Physics of Digital Momentum: From Rath Yatra to Real-Time Data",
            body: `<p>The word <strong>Juggernaut</strong> stems from Jagannath—the Lord of the Universe whose chariot cannot be halted. Real-time streaming platforms embody this same principle.</p>`
        }
    };

    articleCards.forEach(card => {
        card.addEventListener('click', () => {
            const articleId = card.getAttribute('data-article-id');
            const data = articlesData[articleId];

            if (data && modalOverlay) {
                if (modalTitle) modalTitle.innerText = data.title;
                if (modalBody) modalBody.innerHTML = data.body;
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    /* ----------------------------------------------------------------------
       6. WISDOM PULL-QUOTE ROTATING CAROUSEL
       ---------------------------------------------------------------------- */
    const quotes = [
        {
            text: "“In relentless momentum, intention transforms into an unstoppable reality.”",
            author: "The Juggernaut Principle"
        },
        {
            text: "“Order is not created by force, but by aligning every component with universal law.”",
            author: "Vedic Systems Insight"
        },
        {
            text: "“Simplicity is the ultimate devotion to elegance and performance.”",
            author: "Bhakti Tech Canon"
        }
    ];

    let currentQuoteIndex = 0;
    const quoteTextEl = document.getElementById('quote-text');
    const quoteAuthorEl = document.getElementById('quote-author');

    if (quoteTextEl && quoteAuthorEl) {
        setInterval(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteTextEl.style.opacity = '0';
            setTimeout(() => {
                quoteTextEl.innerText = quotes[currentQuoteIndex].text;
                quoteAuthorEl.innerText = quotes[currentQuoteIndex].author;
                quoteTextEl.style.opacity = '1';
            }, 300);
        }, 6000);
    }

    /* ----------------------------------------------------------------------
       7. NEWSLETTER SUBSCRIPTION HANDLER
       ---------------------------------------------------------------------- */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            const btn = newsletterForm.querySelector('button');

            if (input && input.value) {
                const originalText = btn.innerText;
                btn.innerText = "Subscribed! 🙏";
                input.value = "";
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 3500);
            }
        });
    }
});
