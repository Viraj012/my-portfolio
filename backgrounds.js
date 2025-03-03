// Background animation for all sections (except hero)
document.addEventListener('DOMContentLoaded', function() {
    // Wait for page to be fully loaded
    setTimeout(() => {
        addBackgroundToSections();
    }, 100);
});

function addBackgroundToSections() {
    // Select all sections except hero
    const sections = document.querySelectorAll('.section:not(.hero)');
    
    // Add background to each section
    sections.forEach((section, index) => {
        // Make sure each section has position relative for proper canvas positioning
        if (window.getComputedStyle(section).position === 'static') {
            section.style.position = 'relative';
        }
        
        // Create canvas element for this section
        const canvas = document.createElement('canvas');
        canvas.className = 'background-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0'; // Behind section content
        canvas.style.opacity = '0.3';
        canvas.style.pointerEvents = 'none';
        
        // Insert canvas as first child of section
        section.insertBefore(canvas, section.firstChild);
        
        // Get section dimensions
        const sectionRect = section.getBoundingClientRect();
        canvas.width = sectionRect.width;
        canvas.height = sectionRect.height;
        
        // Initialize particles for this section
        initSectionParticles(canvas, index);
    });
    
    // Make sure section content is above background
    const sectionContainers = document.querySelectorAll('.section:not(.hero) .container');
    sectionContainers.forEach(container => {
        container.style.position = 'relative';
        container.style.zIndex = '1';
    });
}

function initSectionParticles(canvas, sectionIndex) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    
    // Particle properties
    const particles = [];
    const particleCount = Math.max(20, Math.floor(width * height / 30000)); // Scale with section size
    const connectionDistance = 150;
    const particleSizeRange = { min: 1, max: 3 };
    const speedRange = { min: 0.05, max: 0.2 };
    
    // Get colors from CSS variables
    let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    let secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim();
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: particleSizeRange.min + Math.random() * (particleSizeRange.max - particleSizeRange.min),
            speedX: (Math.random() - 0.5) * speedRange.max,
            speedY: (Math.random() - 0.5) * speedRange.max,
            color: Math.random() > 0.7 ? primaryColor : secondaryColor,
            wobble: Math.random() > 0.8,
            wobbleAmount: Math.random() * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03,
            wobbleOffset: Math.random() * Math.PI * 2
        });
    }
    
    // Function to convert hex color to rgba
    function hexToRgba(hex, alpha = 1) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Animation function
    function animate() {
        // Check if canvas is still in DOM
        if (!canvas.isConnected) {
            return; // Stop animation if canvas was removed
        }
        
        // Check if section is in viewport for performance
        const rect = canvas.getBoundingClientRect();
        const isVisible = (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
        
        // Only animate if visible
        if (isVisible) {
            ctx.clearRect(0, 0, width, height);
            
            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Add wobble movement
                if (particle.wobble) {
                    particle.x += Math.sin(Date.now() * particle.wobbleSpeed + particle.wobbleOffset) * particle.wobbleAmount * 0.1;
                    particle.y += Math.cos(Date.now() * particle.wobbleSpeed + particle.wobbleOffset) * particle.wobbleAmount * 0.1;
                }
                
                // Boundary check with wrap-around
                if (particle.x < -50) particle.x = width + 50;
                if (particle.x > width + 50) particle.x = -50;
                if (particle.y < -50) particle.y = height + 50;
                if (particle.y > height + 50) particle.y = -50;
                
                // Draw particle
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Draw connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        // Calculate opacity based on distance
                        const opacity = 0.15 * (1 - distance / connectionDistance);
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y, 
                            particles[j].x, particles[j].y
                        );
                        
                        gradient.addColorStop(0, hexToRgba(particles[i].color, opacity));
                        gradient.addColorStop(1, hexToRgba(particles[j].color, opacity));
                        
                        ctx.strokeStyle = gradient;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle theme toggle
    function updateColors() {
        primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim();
        
        particles.forEach(particle => {
            if (Math.random() > 0.7) {
                particle.color = Math.random() > 0.5 ? primaryColor : secondaryColor;
            }
        });
    }
    
    // Handle window resize
    function handleCanvasResize() {
        // Get new section dimensions
        const parentSection = canvas.parentElement;
        if (parentSection) {
            const newRect = parentSection.getBoundingClientRect();
            
            // Adjust canvas size
            width = newRect.width;
            height = newRect.height;
            canvas.width = width;
            canvas.height = height;
            
            // Reposition particles
            particles.forEach(particle => {
                particle.x = Math.random() * width;
                particle.y = Math.random() * height;
            });
        }
    }
    
    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener('resize', handleCanvasResize);
    document.getElementById('theme-toggle').addEventListener('click', () => {
        setTimeout(updateColors, 50);
    });
    
    // Update canvas dimensions on page load
    setTimeout(handleCanvasResize, 500);
}

// Function to handle window resize for all section canvases
window.addEventListener('resize', function() {
    const canvases = document.querySelectorAll('.background-canvas');
    canvases.forEach(canvas => {
        const parentSection = canvas.parentElement;
        if (parentSection) {
            // Update canvas dimensions
            const rect = parentSection.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
    });
});