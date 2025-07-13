// Advanced Scroll Trigger Animation System
class ScrollTriggerAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupProgressBar();
    this.setupHeroAnimations();
    this.setupScrollTriggers();
    this.setupCountUpAnimations();
    this.setupStaggeredAnimations();
    this.setupParticleEffects();
    this.setupCarousel();
    this.setupWaveText();
    this.setupMobileMenu();
  }

  setupProgressBar() {
    const progressBar = document.getElementById("progressBar");

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.height = scrollPercent + "%";
    });
  }

  setupHeroAnimations() {
    // Particle system
    this.createParticles();
  }

  createParticles() {
    const particlesContainer = document.getElementById("particles");
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particle.style.animationDuration = Math.random() * 3 + 3 + "s";
      particlesContainer.appendChild(particle);
    }
  }

  setupScrollTriggers() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;

          setTimeout(() => {
            entry.target.classList.add("visible");

            // Trigger particle burst for special elements
            if (entry.target.classList.contains("stat-card")) {
              this.createParticleBurst(entry.target);
            }
          }, delay);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      ".fade-in, .slide-left, .slide-right, .stagger-item, .scale-in, .rotate-in, .morph, .clip-reveal"
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  setupCountUpAnimations() {
    const countUpElements = document.querySelectorAll(".count-up");

    const countUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("counted")
          ) {
            entry.target.classList.add("counted");
            this.animateCountUp(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countUpElements.forEach((el) => countUpObserver.observe(el));
  }

  animateCountUp(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);

    // Add visual effect
    element.style.transform = "scale(1.1)";
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 300);
  }

  setupStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll(
      ".stats-grid, .impact-grid, .products-grid"
    );

    staggerContainers.forEach((container) => {
      const items = container.querySelectorAll(
        ".stagger-item, .morph, .rotate-in"
      );

      const staggerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              items.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add("visible");
                }, index * 100);
              });
            }
          });
        },
        { threshold: 0.2 }
      );

      staggerObserver.observe(container);
    });
  }

  createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "particle-burst";

      const angle = (i / 12) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      particle.style.left = centerX + "px";
      particle.style.top = centerY + "px";
      particle.style.setProperty("--dx", dx + "px");
      particle.style.setProperty("--dy", dy + "px");

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.classList.add("animate");
      }, i * 50);

      setTimeout(() => {
        particle.remove();
      }, 1500);
    }
  }

  setupParticleEffects() {
    // Mouse-following particles
    let mouseX = 0,
      mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Create trailing particle occasionally
      if (Math.random() < 0.1) {
        this.createTrailParticle(mouseX, mouseY);
      }
    });
  }

  createTrailParticle(x, y) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--accent-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            opacity: 0.7;
            transition: all 1s ease-out;
        `;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.style.opacity = "0";
      particle.style.transform = "scale(0) translateY(-50px)";
    }, 50);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  setupCarousel() {
    const track = document.getElementById("creatorsTrack");
    const prevBtn = document.querySelector(".carousel-btn:first-child");
    const nextBtn = document.querySelector(".carousel-btn:last-child");

    if (!track || !prevBtn || !nextBtn) return;

    let currentPosition = 0;
    const cardWidth = 330; // card width + gap
    const visibleCards = Math.floor(
      track.parentElement.offsetWidth / cardWidth
    );
    const maxPosition = Math.max(0, track.children.length - visibleCards);

    nextBtn.addEventListener("click", () => {
      if (currentPosition < maxPosition) {
        currentPosition++;
        track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentPosition > 0) {
        currentPosition--;
        track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
      }
    });
  }

  setupWaveText() {
    const waveElements = document.querySelectorAll(".wave-text");

    waveElements.forEach((element) => {
      const text = element.textContent;
      element.innerHTML = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.animationDelay = `${index * 0.1}s`;
        element.appendChild(span);
      });
    });
  }

  // Smooth scrolling for navigation links
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Header scroll effect
  setupHeaderEffect() {
    const header = document.querySelector("header");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        header.style.background = "rgba(248, 246, 240, 0.95)";
        header.style.backdropFilter = "blur(20px)";
        header.style.boxShadow = "0 2px 20px rgba(78, 76, 68, 0.1)";
      } else {
        header.style.background = "rgba(248, 246, 240, 0.95)";
        header.style.backdropFilter = "blur(10px)";
        header.style.boxShadow = "none";
      }

      // Hide/show header on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollY = currentScrollY;
    });
  }

  // Filter functionality for products
  setupProductFilters() {
    const filterTabs = document.querySelectorAll(".filter-tab");
    const productCards = document.querySelectorAll(".product-card");

    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        filterTabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        tab.classList.add("active");

        const filter = tab.dataset.filter;

        productCards.forEach((card, index) => {
          setTimeout(() => {
            if (filter === "all" || card.dataset.category === filter) {
              card.style.display = "block";
              card.style.animation = "none";
              card.offsetHeight; // Trigger reflow
              card.style.animation = "fadeInUp 0.6s ease forwards";
            } else {
              card.style.display = "none";
            }
          }, index * 50);
        });
      });
    });
  }

  // Enhanced hover effects
  setupHoverEffects() {
    // 3D tilt effect for cards
    const cards = document.querySelectorAll(
      ".stat-card, .creator-card, .product-card, .impact-item, .cta-card"
    );

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
      });
    });
  }

  // Parallax effect for sections
  setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll(" .hero-background");

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }

  // Loading animation
  setupLoadingAnimation() {
    window.addEventListener("load", () => {
      document.body.classList.add("loaded");

      // Animate hero title
      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) {
        setTimeout(() => {
          heroTitle.style.opacity = "1";
          heroTitle.style.transform = "translateY(0)";
        }, 500);
      }
    });
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const animations = new ScrollTriggerAnimations();
  animations.setupSmoothScrolling();
  animations.setupHeaderEffect();
  animations.setupProductFilters();
  animations.setupHoverEffects();
  animations.setupParallaxEffect();
  animations.setupLoadingAnimation();
});

// Performance optimization
let ticking = false;

function updateAnimations() {
  // Throttle scroll events for better performance
  if (!ticking) {
    requestAnimationFrame(() => {
      // Update scroll-based animations here
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", updateAnimations);

// Add some extra interactive elements
document.addEventListener("DOMContentLoaded", () => {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(
    ".hero-cta, .carousel-btn, .filter-tab"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});
