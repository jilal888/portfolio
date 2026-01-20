// ===== MAIN JAVASCRIPT FILE =====

// DOM Elements
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectLinks = document.querySelectorAll('.project-link[data-project]');
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const typingText = document.getElementById('typingText');

// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1500);
});

// ===== MOBILE NAVIGATION =====
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== THEME TOGGLE =====
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
}

// ===== TYPING ANIMATION =====
const typingWords = [
    'Web Developer',
    'Data Analyst',
    'PHP Programmer',
    'Python Enthusiast',
    'UI/UX Designer'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isEnd = false;

function type() {
    const currentWord = typingWords[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isEnd = true;
        isDeleting = true;
        setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        isEnd = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        setTimeout(type, 500);
    } else {
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(type, isEnd ? typeSpeed * 2 : typeSpeed);
    }
}

// Start typing animation
setTimeout(type, 1000);

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const increment = target / 100;
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCounter();
}

function checkCounterVisibility() {
    const aboutSection = document.getElementById('about');
    const sectionPosition = aboutSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (sectionPosition < screenPosition) {
        counters.forEach(counter => {
            if (!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    }
}

window.addEventListener('scroll', checkCounterVisibility);

// ===== PROJECT FILTER =====
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== PROJECT MODAL =====
const projectsData = {
    1: {
        title: 'Website Penjualan Vape Store',
        category: 'Web Development',
        date: '2023',
        description: 'Website e-commerce lengkap untuk toko vape dengan sistem manajemen produk, user authentication, dan transaksi penjualan.',
        technologies: ['PHP Native', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
        features: [
            'Login & Register System',
            'Product Management (CRUD)',
            'Shopping Cart',
            'Payment Integration',
            'Admin Dashboard',
            'User Profile'
        ],
        challenges: 'Mengimplementasikan sistem transaksi yang aman dan user-friendly interface.',
        solutions: 'Menggunakan session management untuk authentication dan AJAX untuk cart updates.',
        images: ['project1-1.jpg', 'project1-2.jpg', 'project1-3.jpg'],
        github: 'https://github.com/username/vape-store',
        demo: 'https://demo.example.com/vape-store'
    },
    2: {
        title: 'Frontend E-commerce Website',
        category: 'Frontend Development',
        date: '2023',
        description: 'Antarmuka pengguna e-commerce modern dan responsif dengan fokus pada user experience.',
        technologies: ['Node.js', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Responsive Design'],
        features: [
            'Responsive Layout',
            'Product Filtering',
            'Image Gallery',
            'Shopping Cart Preview',
            'User Reviews',
            'Wishlist'
        ],
        challenges: 'Membuat design yang konsisten di berbagai device sizes.',
        solutions: 'Menggunakan CSS Grid dan Flexbox untuk responsive layout.',
        images: ['project2-1.jpg', 'project2-2.jpg', 'project2-3.jpg'],
        github: 'https://github.com/username/ecommerce-frontend',
        demo: 'https://demo.example.com/ecommerce'
    },
    3: {
        title: 'Sistem Pemesanan FavFood',
        category: 'Full Stack',
        date: '2023',
        description: 'Website pemesanan makanan berbasis Laravel dengan sistem manajemen menu dan order tracking.',
        technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'AJAX'],
        features: [
            'Menu Management',
            'Order Tracking',
            'Payment Gateway',
            'Admin Panel',
            'User Dashboard',
            'Real-time Updates'
        ],
        challenges: 'Mengelola order secara real-time dan notifikasi.',
        solutions: 'Mengimplementasikan WebSocket untuk real-time updates.',
        images: ['project3-1.jpg', 'project3-2.jpg', 'project3-3.jpg'],
        github: 'https://github.com/username/favfood',
        demo: 'https://demo.example.com/favfood'
    },
    4: {
        title: 'Sistem Antrean Puskesmas',
        category: 'Web Application',
        date: '2023',
        description: 'Sistem antrean digital untuk meningkatkan efisiensi pelayanan kesehatan di puskesmas.',
        technologies: ['PHP', 'JavaScript', 'MySQL', 'jQuery', 'AJAX', 'CSS3'],
        features: [
            'Queue Management',
            'Patient Registration',
            'Queue Display',
            'Statistics Dashboard',
            'SMS Notification',
            'Priority Queue'
        ],
        challenges: 'Mengatur antrean secara real-time dan memberikan notifikasi.',
        solutions: 'Menggunakan AJAX untuk update real-time dan API SMS untuk notifications.',
        images: ['project4-1.jpg', 'project4-2.jpg', 'project4-3.jpg'],
        github: 'https://github.com/username/queue-system',
        demo: 'https://demo.example.com/queue'
    },
    5: {
        title: 'Prediksi Tingkat Kemiskinan',
        category: 'Data Mining',
        date: '2023',
        description: 'Analisis data dan prediksi tingkat kemiskinan menggunakan algoritma machine learning.',
        technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Jupyter'],
        features: [
            'Data Cleaning',
            'Exploratory Analysis',
            'Feature Engineering',
            'Model Training',
            'Prediction',
            'Visualization'
        ],
        challenges: 'Menangani missing data dan memilih algoritma yang tepat.',
        solutions: 'Menggunakan imputation untuk missing data dan cross-validation untuk model selection.',
        images: ['project5-1.jpg', 'project5-2.jpg', 'project5-3.jpg'],
        github: 'https://github.com/username/poverty-prediction',
        demo: 'https://demo.example.com/poverty-analysis'
    }
};

projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = link.getAttribute('data-project');
        const project = projectsData[projectId];
        
        if (project) {
            modalTitle.textContent = project.title;
            modalBody.innerHTML = `
                <div class="modal-project-details">
                    <div class="project-meta">
                        <span class="project-category">${project.category}</span>
                        <span class="project-date">${project.date}</span>
                    </div>
                    
                    <div class="project-description">
                        <h4>Deskripsi Proyek</h4>
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="project-technologies">
                        <h4>Teknologi yang Digunakan</h4>
                        <div class="tech-list">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="project-features">
                        <h4>Fitur Utama</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-challenges">
                        <h4>Challenges & Solutions</h4>
                        <div class="challenge">
                            <strong>Challenge:</strong> ${project.challenges}
                        </div>
                        <div class="solution">
                            <strong>Solution:</strong> ${project.solutions}
                        </div>
                    </div>
                    
                    <div class="project-links">
                        <a href="${project.github}" class="project-link github" target="_blank">
                            <i class="fab fa-github"></i>
                            <span>View Code</span>
                        </a>
                        <a href="${project.demo}" class="project-link demo" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Live Demo</span>
                        </a>
                    </div>
                </div>
            `;
            
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal on outside click
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===== FORM SUBMISSION =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formStatus = document.getElementById('formStatus');
        
        // Simple validation
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        if (!name || !email || !subject || !message) {
            formStatus.textContent = 'Please fill in all fields';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }
        
        // Simulate form submission
        formStatus.textContent = 'Sending message...';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
        
        // In a real application, you would send this to a server
        setTimeout(() => {
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.className = 'form-status success';
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// ===== SKILL PROGRESS BARS =====
const skillBars = document.querySelectorAll('.progress-bar[data-width]');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 100);
    });
}

function checkSkillBarVisibility() {
    const skillsSection = document.getElementById('skills');
    const sectionPosition = skillsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (sectionPosition < screenPosition) {
        animateSkillBars();
        window.removeEventListener('scroll', checkSkillBarVisibility);
    }
}

window.addEventListener('scroll', checkSkillBarVisibility);

// ===== CURRENT YEAR IN FOOTER =====
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// ===== AOS INITIALIZATION =====
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// ===== PARTICLES INITIALIZATION =====
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles', {
        particles: {
            number: {
                value: 50,
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
                value: 0.3,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#6a11cb",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
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

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    setActiveNavLink();
    checkCounterVisibility();
    checkSkillBarVisibility();
}));

// ===== LAZY LOADING IMAGES =====
const lazyImages = document.querySelectorAll('img[data-src]');

if ('IntersectionObserver' in window) {
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

    lazyImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
    });
}

// ===== SERVICE WORKER FOR PWA =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
            registration => {
                console.log('ServiceWorker registration successful');
            },
            error => {
                console.log('ServiceWorker registration failed: ', error);
            }
        );
    });
}

// ===== OFFLINE DETECTION =====
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});

// ===== COPYRIGHT YEAR AUTO UPDATE =====
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.copyright-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

updateCopyrightYear();

// ===== SCROLL TO TOP =====
backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});