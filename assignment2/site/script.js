// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background change on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animated counter for hero stats
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

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animations for stats
                if (entry.target.classList.contains('hero-stats')) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.classList.add('count-up');
                        }, index * 200);
                    });
                }
                
                // Animate cards with stagger effect
                if (entry.target.classList.contains('cards-grid')) {
                    const cards = entry.target.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 150);
                    });
                }
                
                // Animate tech tags
                if (entry.target.classList.contains('tech-tags')) {
                    const tags = entry.target.querySelectorAll('.tech-tag');
                    tags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.hero-content, .section-header, .cards-grid, .mission-content, .tech-details, .hero-stats, .tech-tags, .architecture-diagram');
    animatedElements.forEach(el => observer.observe(el));

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '<') {
                    // Handle HTML tags
                    let tagEnd = text.indexOf('>', i);
                    element.innerHTML += text.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    element.innerHTML += text.charAt(i);
                    i++;
                }
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Start typing effect after a short delay
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }, 1000);

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Interactive architecture diagram
    const diagramNodes = document.querySelectorAll('.diagram-node');
    diagramNodes.forEach((node, index) => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(10deg)';
            this.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3)';
        });
        
        node.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1) rotateY(0deg)';
                this.style.boxShadow = '';
            }
        });
    });

    // Progressive diagram activation
    setTimeout(() => {
        diagramNodes.forEach((node, index) => {
            setTimeout(() => {
                node.classList.add('diagram-animate');
            }, index * 800);
        });
    }, 2000);

    // Dynamic background particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Create particles periodically
    setInterval(createParticle, 2000);

    // Interactive hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg)';
        });
    });

    // Glitch effect for gradient text
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        setInterval(() => {
            gradientText.classList.add('glitch');
            setTimeout(() => {
                gradientText.classList.remove('glitch');
            }, 200);
        }, 5000);
    }

    // Loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});
