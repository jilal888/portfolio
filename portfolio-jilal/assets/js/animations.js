// ===== ADVANCED ANIMATIONS =====

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.scrollAnimations = [];
        this.intersectionObserver = null;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupPageTransitions();
        this.setupLoadingAnimations();
        this.setupParallaxEffects();
    }
    
    // ===== INTERSECTION OBSERVER ANIMATIONS =====
    setupIntersectionObserver() {
        if (this.isReducedMotion) return;
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }
    
    animateOnScroll(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            switch (animationType) {
                case 'fade-in':
                    this.fadeIn(element);
                    break;
                case 'slide-up':
                    this.slideUp(element);
                    break;
                case 'slide-down':
                    this.slideDown(element);
                    break;
                case 'slide-left':
                    this.slideLeft(element);
                    break;
                case 'slide-right':
                    this.slideRight(element);
                    break;
                case 'zoom-in':
                    this.zoomIn(element);
                    break;
                case 'bounce':
                    this.bounce(element);
                    break;
                case 'flip':
                    this.flip(element);
                    break;
                case 'rotate':
                    this.rotate(element);
                    break;
                case 'stagger':
                    this.staggerChildren(element);
                    break;
            }
            
            // Stop observing after animation
            this.intersectionObserver.unobserve(element);
        }, delay);
    }
    
    // ===== SCROLL-BASED ANIMATIONS =====
    setupScrollAnimations() {
        if (this.isReducedMotion) return;
        
        // Parallax elements
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(el => this.scrollAnimations.push({
            element: el,
            type: 'parallax',
            speed: parseFloat(el.getAttribute('data-speed')) || 0.5
        }));
        
        // Progress bars
        const progressBars = document.querySelectorAll('.progress-animate');
        progressBars.forEach(bar => this.scrollAnimations.push({
            element: bar,
            type: 'progress',
            width: bar.getAttribute('data-width') || '100%'
        }));
        
        // Counter animations
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => this.scrollAnimations.push({
            element: counter,
            type: 'counter',
            target: parseInt(counter.getAttribute('data-target')) || 100,
            duration: parseInt(counter.getAttribute('data-duration')) || 2000
        }));
        
        // Scroll handler
        window.addEventListener('scroll', () => this.handleScrollAnimations());
        this.handleScrollAnimations(); // Initial check
    }
    
    handleScrollAnimations() {
        if (this.isReducedMotion) return;
        
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.scrollAnimations.forEach(animation => {
            const rect = animation.element.getBoundingClientRect();
            const elementTop = rect.top + scrollPosition;
            const elementHeight = rect.height;
            
            // Check if element is in viewport
            if (elementTop < scrollPosition + windowHeight && 
                elementTop + elementHeight > scrollPosition) {
                
                const scrollPercent = (scrollPosition - elementTop + windowHeight) / 
                                    (windowHeight + elementHeight);
                
                switch (animation.type) {
                    case 'parallax':
                        this.applyParallax(animation.element, scrollPercent, animation.speed);
                        break;
                    case 'progress':
                        this.animateProgressBar(animation.element, scrollPercent, animation.width);
                        break;
                    case 'counter':
                        if (!animation.element.classList.contains('animated')) {
                            this.animateCounter(animation.element, animation.target, animation.duration);
                            animation.element.classList.add('animated');
                        }
                        break;
                }
            }
        });
    }
    
    // ===== HOVER ANIMATIONS =====
    setupHoverAnimations() {
        if (this.isReducedMotion) return;
        
        // Hover scale
        document.querySelectorAll('.hover-scale').forEach(element => {
            element.addEventListener('mouseenter', () => this.scaleUp(element));
            element.addEventListener('mouseleave', () => this.scaleDown(element));
        });
        
        // Hover rotate
        document.querySelectorAll('.hover-rotate').forEach(element => {
            element.addEventListener('mouseenter', () => this.rotateElement(element, 5));
            element.addEventListener('mouseleave', () => this.rotateElement(element, 0));
        });
        
        // Hover glow
        document.querySelectorAll('.hover-glow').forEach(element => {
            element.addEventListener('mouseenter', () => this.addGlow(element));
            element.addEventListener('mouseleave', () => this.removeGlow(element));
        });
        
        // Ripple effect
        document.querySelectorAll('.ripple').forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    }
    
    // ===== PAGE TRANSITIONS =====
    setupPageTransitions() {
        if (this.isReducedMotion) return;
        
        // Add page transition class to body
        document.body.classList.add('page-transition');
        
        // Handle link clicks
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.animatePageTransition(() => {
                    window.location.href = targetId;
                });
            });
        });
    }
    
    // ===== LOADING ANIMATIONS =====
    setupLoadingAnimations() {
        // Loading spinner
        const loaders = document.querySelectorAll('.loading-spinner');
        loaders.forEach(loader => {
            this.animations.set(loader, this.createSpinnerAnimation(loader));
        });
        
        // Skeleton loading
        const skeletons = document.querySelectorAll('.skeleton');
        skeletons.forEach(skeleton => {
            this.animateSkeleton(skeleton);
        });
    }
    
    // ===== PARALLAX EFFECTS =====
    setupParallaxEffects() {
        if (this.isReducedMotion) return;
        
        const parallaxContainers = document.querySelectorAll('.parallax-container');
        parallaxContainers.forEach(container => {
            const layers = container.querySelectorAll('.parallax-layer');
            layers.forEach((layer, index) => {
                const speed = layer.getAttribute('data-speed') || (0.5 + index * 0.1);
                this.scrollAnimations.push({
                    element: layer,
                    type: 'parallax-layer',
                    speed: parseFloat(speed)
                });
            });
        });
    }
    
    // ===== ANIMATION METHODS =====
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    slideUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    slideDown(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-50px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    slideLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    slideRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    zoomIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    bounce(element) {
        element.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
    
    flip(element) {
        element.style.transform = 'perspective(1000px) rotateY(0)';
        element.style.transition = 'transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.transform = 'perspective(1000px) rotateY(180deg)';
            
            setTimeout(() => {
                element.style.transform = 'perspective(1000px) rotateY(360deg)';
            }, 600);
        });
    }
    
    rotate(element) {
        element.style.transition = 'transform 0.6s ease';
        element.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            element.style.transform = 'rotate(0)';
        }, 600);
    }
    
    staggerChildren(parent) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    applyParallax(element, scrollPercent, speed) {
        const yPos = -(scrollPercent * speed * 100);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }
    
    animateProgressBar(bar, scrollPercent, targetWidth) {
        if (scrollPercent > 0.3 && scrollPercent < 0.7) {
            const width = scrollPercent * 100;
            bar.style.width = `${Math.min(width, parseFloat(targetWidth))}%`;
        }
    }
    
    animateCounter(counter, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                counter.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    scaleUp(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.3s ease';
    }
    
    scaleDown(element) {
        element.style.transform = 'scale(1)';
    }
    
    rotateElement(element, degrees) {
        element.style.transform = `rotate(${degrees}deg)`;
        element.style.transition = 'transform 0.3s ease';
    }
    
    addGlow(element) {
        element.style.boxShadow = '0 0 20px rgba(106, 17, 203, 0.5)';
        element.style.transition = 'box-shadow 0.3s ease';
    }
    
    removeGlow(element) {
        element.style.boxShadow = '';
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple-effect');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    animatePageTransition(callback) {
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        document.body.appendChild(transitionOverlay);
        
        setTimeout(() => {
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                if (callback) callback();
            }, 500);
        }, 10);
    }
    
    createSpinnerAnimation(loader) {
        let rotation = 0;
        
        const animate = () => {
            rotation = (rotation + 2) % 360;
            loader.style.transform = `rotate(${rotation}deg)`;
            this.animations.set(loader, requestAnimationFrame(animate));
        };
        
        return requestAnimationFrame(animate);
    }
    
    animateSkeleton(skeleton) {
        // Simulate loading
        setTimeout(() => {
            skeleton.classList.remove('skeleton');
            skeleton.classList.add('loaded');
        }, 1000);
    }
    
    // ===== PUBLIC METHODS =====
    startAnimation(element, animationName, options = {}) {
        if (this.isReducedMotion) return;
        
        switch (animationName) {
            case 'typing':
                this.startTypingAnimation(element, options);
                break;
            case 'wave':
                this.startWaveAnimation(element, options);
                break;
            case 'confetti':
                this.createConfetti(options);
                break;
            case 'fireworks':
                this.createFireworks(options);
                break;
        }
    }
    
    startTypingAnimation(element, options) {
        const text = element.textContent;
        element.textContent = '';
        
        let index = 0;
        const typingSpeed = options.speed || 100;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            } else if (options.loop) {
                setTimeout(() => {
                    element.textContent = '';
                    index = 0;
                    type();
                }, 2000);
            }
        };
        
        type();
    }
    
    startWaveAnimation(element) {
        const text = element.textContent;
        element.textContent = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animation = `wave 2s ease-in-out ${index * 0.1}s infinite`;
            element.appendChild(span);
        });
    }
    
    createConfetti(options = {}) {
        const confettiCount = options.count || 100;
        const colors = options.colors || ['#6a11cb', '#2575fc', '#ff6b6b', '#20c997', '#ffc107'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    createFireworks(options = {}) {
        const fireworkCount = options.count || 5;
        
        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                this.createSingleFirework(options);
            }, i * 300);
        }
    }
    
    createSingleFirework(options = {}) {
        const colors = options.colors || ['#6a11cb', '#2575fc', '#ff6b6b', '#20c997', '#ffc107'];
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (i / 30) * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            
            document.body.appendChild(particle);
            
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            
            const animate = () => {
                posX += Math.cos(angle) * speed;
                posY += Math.sin(angle) * speed;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    destroy() {
        // Clean up animations
        this.animations.forEach((animationId, element) => {
            cancelAnimationFrame(animationId);
        });
        
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        window.removeEventListener('scroll', () => this.handleScrollAnimations());
    }
}

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .confetti {
            position: fixed;
            top: -20px;
            z-index: 9999;
            border-radius: 2px;
            pointer-events: none;
        }
        
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .firework-particle {
            position: fixed;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gradient-primary);
            z-index: 9999;
            transform: translateX(-100%);
            transition: transform 0.5s ease;
        }
        
        .page-transition-overlay.active {
            transform: translateX(0);
        }
        
        .skeleton {
            background: linear-gradient(90deg, 
                var(--gray-light) 25%, 
                var(--lighter-color) 50%, 
                var(--gray-light) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        
        .loaded {
            animation: none;
        }
    `;
    
    document.head.appendChild(style);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}