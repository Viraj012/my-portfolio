// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
gsap.from('.hero-content', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.1
});

// Network animation
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 100;
    const maxDistance = 100;
    const mouseRadius = 100;

    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: mouseRadius
    };

    // Track mouse position
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // When mouse leaves window
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize canvas to match window size
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Re-initialize particles after resize
        initParticles();
    }

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Check if mouse is close enough to push particle
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;

                // Calculate force based on distance
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;

                if (distance < maxDistance) {
                    // Push particle away from mouse
                    this.x -= forceDirectionX * force * this.density;
                    this.y -= forceDirectionY * force * this.density;
                } else {
                    // Return to original position if not affected by mouse
                    if (this.x !== this.baseX) {
                        const dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        const dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            } else {
                // Return to original position if mouse is out of window
                if (this.x !== this.baseX) {
                    const dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    const dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Connect particles with lines if close enough
    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    // Calculate line opacity based on distance
                    const opacity = 1 - (distance / maxDistance);

                    // Set line color based on theme
                    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
                    ctx.strokeStyle = `rgba(${hexToRgb(color)}, ${opacity * 0.4})`;
                    ctx.lineWidth = 1;

                    // Draw line
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Convert hex color to rgb
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Parse hex to rgb
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        // Update color based on current theme
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        ctx.fillStyle = primaryColor;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Connect particles
        connect();
    }

    // Initialize canvas and start animation
    resizeCanvas();
    animate();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Update particle colors when theme changes
    document.getElementById('theme-toggle').addEventListener('click', () => {
        // Wait for CSS variables to update
        setTimeout(() => {
            const newColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            particles.forEach(particle => {
                particle.color = newColor;
            });
        }, 50);
    });
});

// Section Animations
gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Go to top button 
document.addEventListener('DOMContentLoaded', function () {
    const goToTopButton = document.getElementById('go-to-top');

    // Show button when page is scrolled down
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            goToTopButton.classList.add('visible');
        } else {
            goToTopButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top when button is clicked
    goToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Skill style 
document.addEventListener("DOMContentLoaded", function () {
    // Select all elements that should have the tilt effect
    // This includes skill categories, timeline content, and project cards
    const tiltElements = document.querySelectorAll('.skill-category, .timeline-content, .project-card');

    // Add event listeners to each element
    tiltElements.forEach(element => {
        // Mouse enter event
        element.addEventListener('mouseenter', handleMouseEnter);

        // Mouse move event
        element.addEventListener('mousemove', handleMouseMove);

        // Mouse leave event
        element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Function to handle mouse enter
    function handleMouseEnter(e) {
        this.style.transition = 'transform 0.2s ease-out';

        // Different initial tilt angles based on element type
        if (this.classList.contains('project-card')) {
            // Stronger effect for project cards
            this.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(2deg) scale(1.05)';
            this.style.boxShadow = '0 15px 25px rgba(0,0,0,0.3)';
        } else if (this.classList.contains('timeline-content')) {
            // More subtle for timeline content
            this.style.transform = 'perspective(1000px) rotateX(1.5deg) rotateY(1.5deg) scale(1.02)';
            this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.25)';
        } else {
            // Default for skill categories
            this.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(2deg) scale(1.03)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        }

        this.style.zIndex = '5';
    }

    // Function to handle mouse move
    function handleMouseMove(e) {
        const element = this;
        // Get the dimensions of the element
        const rect = element.getBoundingClientRect();

        // Calculate the mouse position relative to the element center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate the rotation degrees with different sensitivity for different elements
        let rotationIntensity = 10; // Default

        if (element.classList.contains('project-card')) {
            rotationIntensity = 12; // Stronger effect for projects
        } else if (element.classList.contains('timeline-content')) {
            rotationIntensity = 8; // More subtle for timeline items
        }

        const rotateY = mouseX * rotationIntensity / (rect.width / 2);
        const rotateX = -mouseY * rotationIntensity / (rect.height / 2);

        // Apply the transform based on element type
        if (element.classList.contains('project-card')) {
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        } else if (element.classList.contains('timeline-content')) {
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        } else {
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        }

        // Add a dynamic highlight effect based on mouse position
        const shine = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 80%)`;
        element.style.backgroundImage = shine;
    }

    // Function to handle mouse leave
    function handleMouseLeave() {
        this.style.transition = 'all 0.5s ease';
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        this.style.zIndex = '1';
        this.style.boxShadow = 'var(--card-shadow)';
        this.style.backgroundImage = 'none';
    }
});

// ---------- Easter eggs ------------
document.addEventListener('DOMContentLoaded', function() {
    // 1. Konami Code Easter Egg (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        // Check if the key pressed matches the next key in the Konami Code
        if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;
            
            // If the full code has been entered
            if (konamiIndex === konamiCode.length) {
                // Reset the index
                konamiIndex = 0;
                
                // Activate the Easter Egg - Matrix rain effect
                activateMatrixRain();
            }
        } else {
            // Reset the index if wrong key is pressed
            konamiIndex = 0;
        }
    });
    
    // 2. Secret Logo Click Easter Egg
    const logo = document.querySelector('.logo');
    let logoClickCount = 0;
    
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            logoClickCount++;
            
            if (logoClickCount === 5) {
                // Reset counter
                logoClickCount = 0;
                
                // Activate the Easter Egg - Logo spin
                this.style.transition = 'transform 1s ease-in-out';
                this.style.transform = 'rotate(360deg)';

                const isLightMode = document.body.classList.contains('light-mode');
                
                // Change colors temporarily
                document.documentElement.style.setProperty('--primary', '#ff00ff');
                document.documentElement.style.setProperty('--secondary', '#00ffff');
    
                // Return to normal after 3 seconds
                setTimeout(() => {
                    this.style.transform = 'rotate(0deg)';
                    if (isLightMode) {
                    // Restore light mode colors
                    document.documentElement.style.setProperty('--primary', '#F96167');
                    document.documentElement.style.setProperty('--secondary', '#fae482');
                } else {
                    // Restore dark mode colors
                    document.documentElement.style.setProperty('--primary', '#F96167');
                    document.documentElement.style.setProperty('--secondary', '#fae482');
                }
            }, 3000);
            }
        });
    }
    
    // 3. Secret Message in Console
    console.log("%cHello there, curious developer! 👋", "font-size: 24px; font-weight: bold; color: #f1c40f;");
    console.log("%cLooks like you found my secret message. Try the Konami Code on my site 😉", "font-size: 16px; color: #e67e22;");
    console.log("%c⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️", "font-size: 20px; color: #9b59b6;");
    
    // Matrix Rain Effect function
    function activateMatrixRain() {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Matrix characters
        const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        
        // Converting the string into an array of single characters
        const characters = matrix.split("");
        
        const fontSize = 12;
        const columns = canvas.width / fontSize; // Number of columns for the rain
        
        // An array of drops - one per column
        const drops = [];
        
        // x below is the x coordinate
        // 1 = y coordinate of the drop (same for every drop initially)
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        // Drawing the characters
        function draw() {
            // Black BG for the canvas, translucent to show trail
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set text color - cyberpunk colors!
            ctx.fillStyle = "#f1c40f";
            ctx.font = fontSize + "px arial";
            
            // Looping over drops
            for (let i = 0; i < drops.length; i++) {
                // A random character to print
                const text = characters[Math.floor(Math.random() * characters.length)];
                
                // x = i * fontSize, y = value of drops[i] * fontSize
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Randomly change colors between our cyberpunk theme
                if (Math.random() > 0.95) {
                    const colors = ["#f1c40f", "#e67e22", "#9b59b6"];
                    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                }
                
                // Sending the drop back to the top randomly after it has crossed the screen
                // Adding randomness to the reset to make the drops scattered on the Y axis
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                // Incrementing Y coordinate
                drops[i]++;
            }
        }
        
        // Animation loop
        let matrixInterval = setInterval(draw, 35);
        
        // Stop after 10 seconds
        setTimeout(() => {
            clearInterval(matrixInterval);
            document.body.removeChild(canvas);
        }, 10000);
    }
    
    
    // 5. Hidden Theme Switcher with Key Combo - "T+H+E+M+E"
    let themeKeys = [];
    const themeCode = ['t', 'h', 'e', 'm', 'e'];
    
    document.addEventListener('keydown', function(e) {
        themeKeys.push(e.key.toLowerCase());
        
        // Only keep the last 5 keys pressed
        if (themeKeys.length > 5) {
            themeKeys.shift();
        }
        
        // Check if the last 5 keys match our theme code
        const isThemeCodeActivated = themeKeys.join('') === themeCode.join('');
        
        if (isThemeCodeActivated) {
            // Clear the array
            themeKeys = [];
            
            // Create a color picker popup
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = 'var(--card-bg)';
            popup.style.padding = '20px';
            popup.style.borderRadius = '10px';
            popup.style.zIndex = '10000';
            popup.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
            
            popup.innerHTML = `
                <h3 style="color: var(--primary); margin-top: 0;">Secret Theme Picker</h3>
                <p style="color: var(--text-primary);">Choose your primary and secondary colors:</p>
                <div style="margin-bottom: 15px;">
                    <label style="color: var(--text-primary);">Primary: </label>
                    <input type="color" id="primary-color" value="#f1c40f">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="color: var(--text-primary);">Secondary: </label>
                    <input type="color" id="secondary-color" value="#e67e22">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="color: var(--text-primary);">Accent: </label>
                    <input type="color" id="accent-color" value="#9b59b6">
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button id="apply-theme" style="background-color: var(--primary); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Apply</button>
                    <button id="close-popup" style="background-color: var(--card-bg); color: var(--text-primary); border: 1px solid var(--text-secondary); padding: 8px 15px; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            // Event listeners for the popup
            document.getElementById('apply-theme').addEventListener('click', function() {
                const primaryColor = document.getElementById('primary-color').value;
                const secondaryColor = document.getElementById('secondary-color').value;
                const accentColor = document.getElementById('accent-color').value;
                
                // Apply the colors
                document.documentElement.style.setProperty('--primary', primaryColor);
                document.documentElement.style.setProperty('--secondary', secondaryColor);
                document.documentElement.style.setProperty('--accent', accentColor);
                
                // Save to localStorage for persistence
                localStorage.setItem('custom-primary', primaryColor);
                localStorage.setItem('custom-secondary', secondaryColor);
                localStorage.setItem('custom-accent', accentColor);
                
                // Close the popup
                document.body.removeChild(popup);
            });
            
            document.getElementById('close-popup').addEventListener('click', function() {
                document.body.removeChild(popup);
            });
        }
    });

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing contact form");
    
    // Get the form element
    const contactForm = document.getElementById('contact-form');
    
    // Debug check - make sure we found the form
    if (!contactForm) {
        console.error("Contact form not found!");
        return;
    }
    
    console.log("Contact form found, setting up listener");
    
    // Add submit event listener directly
    contactForm.onsubmit = function(e) {
        // Prevent the default form submission
        e.preventDefault();
        console.log("Form submission prevented");
        
        // Get the status element
        const formStatus = document.getElementById('form-status');
        
        // Show sending status
        formStatus.textContent = "Sending your message...";
        formStatus.className = "form-status sending";
        
        // Get form data
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Debug check - make sure we have all form fields
        if (!nameInput || !emailInput || !subjectInput || !messageInput) {
            console.error("Form fields not found!");
            formStatus.textContent = "Form configuration error. Please contact me directly via email.";
            formStatus.className = "form-status error";
            return;
        }
        
        // Without EmailJS for now, just show success after delay
        setTimeout(function() {
            console.log("Form would be submitted if EmailJS was configured");
            formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
            formStatus.className = "form-status success";
            
            // Reset form
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.className = "form-status";
            }, 5000);
        }, 1000);
        
        // UNCOMMENT AND CONFIGURE THIS SECTION WHEN READY TO USE EMAILJS
        
        // Initialize EmailJS with your user ID
        emailjs.init("lQh14aIY4yuKN32hg"); // Replace with your actual EmailJS user ID
        
        // Send email using EmailJS
        emailjs.send(
            'service_7s5j7yd', // Replace with your EmailJS service ID
            'template_8wlprff', // Replace with your EmailJS template ID
            {
                from_name: nameInput.value,
                from_email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value,
                reply_to: emailInput.value
            }
        )
        .then(function() {
            // Success message
            formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
            formStatus.className = "form-status success";
            
            // Reset form
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.className = "form-status";
            }, 5000);
        })
        .catch(function(error) {
            // Error message
            console.error('EmailJS error:', error);
            formStatus.textContent = "Oops! Something went wrong. Please try again or contact me directly via email.";
            formStatus.className = "form-status error";
        });
        
        
        // Return false to ensure the form doesn't submit
        return false;
    };
    
    console.log("Contact form listener setup complete");
});

// Add this to your existing script.js file to ensure the interests section
// animations work with your current fade-in effects

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for interest items to make them appear with delay
                if (entry.target.classList.contains('interests-container')) {
                    const interestItems = entry.target.querySelectorAll('.interest-item');
                    interestItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = 1;
                            item.style.transform = 'translateY(0)';
                        }, 100 * (index + 1));
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add tooltip positioning adjustment for screen edges
    const interestItems = document.querySelectorAll('.interest-item');
    
    interestItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const tooltip = item.querySelector('.interest-tooltip');
            const rect = tooltip.getBoundingClientRect();
            
            // Adjust if tooltip goes off the left edge
            if (rect.left < 10) {
                tooltip.style.left = '0';
                tooltip.style.transform = 'translateX(0) scale(1)';
            }
            
            // Adjust if tooltip goes off the right edge
            if (rect.right > window.innerWidth - 10) {
                tooltip.style.left = '100%';
                tooltip.style.transform = 'translateX(-100%) scale(1)';
            }
        });
        
        // Reset position on mouseleave
        item.addEventListener('mouseleave', () => {
            const tooltip = item.querySelector('.interest-tooltip');
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%) scale(0.8)';
        });
    });
});





});