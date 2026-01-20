// ===== PARTICLES.JS CONFIGURATION =====

class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.defaultOptions = {
            particleCount: 50,
            particleColor: '#6a11cb',
            lineColor: '#6a11cb',
            lineWidth: 1,
            particleSize: 3,
            lineLength: 150,
            moveSpeed: 2,
            interactivity: true
        };
        
        this.options = { ...this.defaultOptions, ...options };
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * this.options.particleSize + 1,
                speedX: (Math.random() - 0.5) * this.options.moveSpeed,
                speedY: (Math.random() - 0.5) * this.options.moveSpeed,
                color: this.options.particleColor,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        if (this.options.interactivity) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = undefined;
                this.mouse.y = undefined;
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
    }
    
    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.lineLength) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.options.lineColor;
                    this.ctx.lineWidth = this.options.lineWidth;
                    this.ctx.globalAlpha = 0.2 * (1 - distance / this.options.lineLength);
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mouse interaction
            if (this.mouse.x !== undefined && this.mouse.y !== undefined) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    particle.x -= Math.cos(angle) * 2;
                    particle.y -= Math.sin(angle) * 2;
                }
            }
            
            // Bounce off walls
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.speedY = -particle.speedY;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawLines();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const particleContainer = document.getElementById('particles');
    
    if (particleContainer) {
        // Check if particles.js is already loaded
        if (typeof particlesJS === 'undefined') {
            // Fallback to custom particle system
            window.particleSystem = new ParticleSystem('particles', {
                particleCount: 80,
                particleColor: '#6a11cb',
                lineColor: '#2575fc',
                particleSize: 4,
                lineLength: 120,
                moveSpeed: 1.5
            });
        } else {
            // Use particles.js if available
            particlesJS('particles', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: "#6a11cb"
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: 0.4,
                        random: true
                    },
                    size: {
                        value: 4,
                        random: true
                    },
                    line_linked: {
                        enable: true,
                        distance: 120,
                        color: "#2575fc",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "grab"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        }
                    }
                },
                retina_detect: true
            });
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}