// ========================================
// CUSTOM CURSOR
// ========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .social-link, .contact-item');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// ========================================
// PARTICLE BACKGROUND
// ========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let particleCount = 120;
let connectionDistance = 180;
let mouseDistance = 250;

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
        this.size = Math.random() * 2 + 1;
        const redIntensity = Math.random() * 155 + 100;
        this.color = `rgba(${redIntensity}, 20, 20, ${Math.random() * 0.6 + 0.3})`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseDistance) {
            const force = (mouseDistance - distance) / mouseDistance;
            this.vx -= (dx / distance) * force * 0.02;
            this.vy -= (dy / distance) * force * 0.02;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.3;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    drawConnections();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
const navbar = document.querySelector('.navbar');

const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
            scrollIndicator.style.pointerEvents = 'none';
        }
    } else {
        navbar.classList.remove('scrolled');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }
});

// ========================================
// MOBILE MENU
// ========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ========================================
// SMOOTH SCROLL & ACTIVE NAV LINK
// ========================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinkItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========================================
// ANIMATE ON SCROLL (AOS)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ========================================
// NUMBER COUNTER ANIMATION
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.stat-number');
            const target = parseInt(number.dataset.count);
            animateCounter(number, target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statObserver.observe(stat);
});

// ========================================
// FORM HANDLING - SIMULATED (No external service needed)
// ========================================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    formStatus.textContent = '';
    
    // Simulate sending delay (1.5 seconds)
    setTimeout(() => {
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        submitBtn.style.background = '#22c55e';
        formStatus.textContent = 'Thanks! Your message has been sent to bshibin347@gmail.com';
        formStatus.style.color = '#22c55e';
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Log to console (for your reference)
        console.log('New message received:', {
            from: data.email,
            name: data.name,
            message: data.message,
            time: new Date().toLocaleString()
        });
        
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            formStatus.textContent = '';
        }, 5000);
    }, 1500);
});

// ========================================
// TYPING EFFECT FOR HERO (optional enhancement)
// ========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========================================
// PARALLAX EFFECT (excludes featured project)
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.about-image, .skill-card, .project-card:not(.featured)');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.03 + (index * 0.005);
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ========================================
// PROJECT CARD 3D TILT EFFECT (excludes featured)
// ========================================
const projectCards = document.querySelectorAll('.project-card:not(.featured)');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ========================================
// SCROLL VELOCITY DETECTION
// ========================================
let lastScrollY = 0;
let scrollVelocity = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            scrollVelocity = Math.abs(window.scrollY - lastScrollY);
            lastScrollY = window.scrollY;
            
            // Apply skew effect based on scroll velocity
            document.querySelectorAll('section').forEach(section => {
                const skew = Math.min(scrollVelocity * 0.02, 5);
                section.style.transform = `skewY(${window.scrollY > lastScrollY ? skew : -skew}deg)`;
                
                setTimeout(() => {
                    section.style.transform = 'skewY(0deg)';
                }, 100);
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// ========================================
// TEXT SCRAMBLE EFFECT
// ========================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply text scramble to hero title on load
window.addEventListener('load', () => {
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        const originalText = line.textContent;
        const fx = new TextScramble(line);
        setTimeout(() => {
            fx.setText(originalText);
        }, index * 500);
    });
});

// ========================================
// PERFORMANCE: PAUSE ANIMATIONS WHEN TAB HIDDEN
// ========================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations
        particles = [];
    } else {
        initParticles();
    }
});

// ========================================
// LOADING ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('%c BLOOD RED PORTFOLIO ACTIVATED ', 'background: linear-gradient(135deg, #dc2626, #ff0000); color: white; font-size: 18px; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');

// ========================================
// GLITCH EFFECT ON HOVER
// ========================================
const glitchElements = document.querySelectorAll('.hero-title .title-line, .section-title');

glitchElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.animation = 'shake 0.5s';
        el.style.textShadow = '2px 0 #ff0000, -2px 0 #00ffff';
        
        setTimeout(() => {
            el.style.animation = '';
            el.style.textShadow = '';
        }, 500);
    });
});

// ========================================
// AGGRESSIVE MOUSE TRAIL
// ========================================
let trail = [];
const trailLength = 20;

window.addEventListener('mousemove', (e) => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > trailLength) trail.shift();
});

function drawTrail() {
    trail.forEach((point, index) => {
        point.life -= 0.05;
        if (point.life > 0) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: ${point.life * 10}px;
                height: ${point.life * 10}px;
                background: radial-gradient(circle, rgba(220,38,38,${point.life}), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 50);
        }
    });
    requestAnimationFrame(drawTrail);
}

drawTrail();
