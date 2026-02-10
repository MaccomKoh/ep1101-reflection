// Force proper scaling on laptops
if (window.innerWidth >= 1024 && window.innerWidth <= 1920) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes');
    }
}

// ================================
// MAIN JAVASCRIPT FOR INTERACTIVITY
// ================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // SCROLL ANIMATIONS
    // ================================
    
    // Observe elements for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add stagger delay to elements
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.animationDelay = `${delay}s`;
            }
        });
    }, observerOptions);
    
    // Observe all slide-up elements
    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });
    
    // ================================
    // SMOOTH SCROLL
    // ================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ================================
    // NAVBAR SCROLL EFFECT
    // ================================
    
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove shadow based on scroll
        if (currentScroll > 10) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ================================
    // CARD HOVER EFFECTS
    // ================================
    
    const cards = document.querySelectorAll('.interactive-card, .nav-card, .role-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ================================
    // EDITABLE INLINE ELEMENTS
    // ================================
    
    const editables = document.querySelectorAll('.editable-inline, .tech-tag.editable');
    
    editables.forEach(editable => {
        // Placeholder handling
        editable.addEventListener('focus', function() {
            if (this.textContent.includes('[') && this.textContent.includes(']')) {
                this.dataset.placeholder = this.textContent;
                this.textContent = '';
            }
        });
        
        editable.addEventListener('blur', function() {
            if (this.textContent.trim() === '' && this.dataset.placeholder) {
                this.textContent = this.dataset.placeholder;
            }
        });
        
        // Prevent line breaks
        editable.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });
    
    // ================================
    // ACTION CHECKBOXES
    // ================================
    
    const checkboxes = document.querySelectorAll('.action-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('checked');
            
            // Add celebration animation
            if (this.classList.contains('checked')) {
                createConfetti(this);
            }
        });
    });
    
    function createConfetti(element) {
        const colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        const confettiCount = 10;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = element.getBoundingClientRect().left + 'px';
            confetti.style.top = element.getBoundingClientRect().top + 'px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            document.body.appendChild(confetti);
            
            const angle = (Math.PI * 2 * i) / confettiCount;
            const velocity = 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            animateConfetti(confetti, vx, vy);
        }
    }
    
    function animateConfetti(element, vx, vy) {
        let x = parseInt(element.style.left);
        let y = parseInt(element.style.top);
        let opacity = 1;
        let velocityY = vy;
        
        function animate() {
            x += vx * 0.02;
            y += velocityY * 0.02;
            velocityY += 0.5; // gravity
            opacity -= 0.01;
            
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                element.remove();
            }
        }
        
        animate();
    }
    
    // ================================
    // LESSON CARDS EXPANSION
    // ================================
    
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    lessonCards.forEach(card => {
        card.addEventListener('click', function() {
            // Close other cards
            lessonCards.forEach(c => {
                if (c !== this) {
                    c.classList.remove('expanded');
                }
            });
            
            // Toggle this card
            this.classList.toggle('expanded');
        });
    });
    
    // ================================
    // PROGRESS INDICATOR
    // ================================
    
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        // Update progress bar if it exists
        const progressBar = document.querySelector('.reading-progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    window.addEventListener('scroll', updateProgressBar);
    
    // ================================
    // COPY CODE SNIPPETS (if any)
    // ================================
    
    const codeBlocks = document.querySelectorAll('pre code, .code-block');
    
    codeBlocks.forEach(block => {
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-code-btn';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '5px';
        copyButton.style.right = '5px';
        copyButton.style.padding = '0.25rem 0.5rem';
        copyButton.style.fontSize = '0.75rem';
        copyButton.style.background = 'var(--primary)';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = 'var(--radius-sm)';
        copyButton.style.cursor = 'pointer';
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyButton);
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
    
    // ================================
    // KEYBOARD NAVIGATION
    // ================================
    
    document.addEventListener('keydown', (e) => {
        // Navigate between pages with arrow keys
        const currentPage = window.location.pathname.split('/').pop();
        const pages = ['index.html', 'intro.html', 'challenge.html', 'insights.html', 'reflection.html'];
        const currentIndex = pages.indexOf(currentPage);
        
        if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
            window.location.href = pages[currentIndex + 1];
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            window.location.href = pages[currentIndex - 1];
        }
    });
    
    // ================================
    // TOOLTIP SYSTEM (for hints)
    // ================================
    
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(15, 23, 42, 0.95)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 1rem';
            tooltip.style.borderRadius = 'var(--radius-sm)';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.whiteSpace = 'nowrap';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        trigger.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
    
    // ================================
    // EASTER EGGS
    // ================================
    
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-konamiSequence.length);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateRainbowMode();
        }
    });
    
    function activateRainbowMode() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);
        
        alert('🌈 Rainbow Mode Activated! 🌈\n\nYou found the Easter egg!');
    }
    
    // ================================
    // PERFORMANCE: Lazy load images
    // ================================
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ================================
    // INITIALIZE
    // ================================
    
    console.log('%c🎉 EP1101 Reflection Website Loaded! 🎉', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #ec4899; font-size: 12px;');
    console.log('%cTip: Use ← → arrow keys to navigate between pages!', 'color: #10b981; font-size: 12px;');
    
});
