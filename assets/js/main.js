document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE LUCIDE ICONS
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. THEME MANAGEMENT (Dark / Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'inline-block';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            if (sunIcon) sunIcon.style.display = 'inline-block';
            if (moonIcon) moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // 3. HERO CANVAS BACKGROUND ANIMATION
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
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
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-ibm').trim();
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // 4. TAB NAVIGATION SYSTEM
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const activeTab = document.getElementById(tabId);
            if (activeTab) activeTab.classList.add('active');
        });
    });

    // 5. ARTICLE FILTER SYSTEM
    const filterChips = document.querySelectorAll('.filter-chip');
    const articleCards = document.querySelectorAll('.article-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');

            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            articleCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. ARTICLE MODAL SYSTEM
    const modalOverlay = document.getElementById('article-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMeta = document.getElementById('modal-meta');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    articleCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const readtime = card.getAttribute('data-readtime');
            const lead = card.getAttribute('data-lead');
            const body = card.getAttribute('data-body');

            if (modalTitle) modalTitle.innerText = title;
            if (modalMeta) modalMeta.innerText = `ANALYSIS • ${readtime}`;
            if (modalBody) {
                modalBody.innerHTML = `
                    <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-primary);">${lead}</p>
                    <p>${body}</p>
                `;
            }

            if (modalOverlay) modalOverlay.classList.add('active');
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    // 7. DYNAMIC QUOTE ROTATION
    const quotes = [
        { text: '"Technology shapes the future. Character shapes the people who build it."', label: '— PRINCIPLE I' },
        { text: '"Discipline creates freedom."', label: '— PRINCIPLE II' },
        { text: '"The strongest people are quietly consistent."', label: '— PRINCIPLE III' },
        { text: '"Build systems, not excuses."', label: '— PRINCIPLE IV' },
        { text: '"Success without purpose is merely motion."', label: '— PRINCIPLE V' }
    ];

    let quoteIdx = 0;
    const quoteTextEl = document.getElementById('dynamic-quote');
    const quoteAuthorEl = document.getElementById('dynamic-quote-author');

    setInterval(() => {
        quoteIdx = (quoteIdx + 1) % quotes.length;
        if (quoteTextEl) {
            quoteTextEl.style.opacity = '0';
            setTimeout(() => {
                quoteTextEl.innerText = quotes[quoteIdx].text;
                if (quoteAuthorEl) quoteAuthorEl.innerText = quotes[quoteIdx].label;
                quoteTextEl.style.opacity = '1';
            }, 300);
        }
    }, 6000);

    // 8. FORM SUBMISSION HANDLER
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Welcome to the journey. Dispatch confirmation active.');
            newsletterForm.reset();
        });
    }
});
