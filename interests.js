// Simple Carousel Animation for Interest Icons
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupInterestsCarousel, 500); // Give page time to fully render with shorter delay
  });
  
  function setupInterestsCarousel() {
    // Get the interests container
    const container = document.querySelector('.interests-icons');
    if (!container) return;
    
    // Get all interest items
    const originalItems = document.querySelectorAll('.interest-item');
    if (!originalItems.length) return;
    
    // Clear the container to rebuild it
    const originalHTML = container.innerHTML;
    container.innerHTML = '';
    
    // Add some clearance space to container
    container.style.marginTop = '50px';
    container.style.marginBottom = '50px';
    container.style.height = '50px';
    
    // Create a carousel track
    const track = document.createElement('div');
    track.className = 'carousel-track';
    container.appendChild(track);
    
    // Add all original items to the track
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    
    // Calculate necessary clones to fill view
    const containerWidth = container.offsetWidth;
    const trackWidth = track.scrollWidth;
    
    // If track is smaller than container, add more clones
    if (trackWidth < containerWidth * 2) {
      // Clone the entire set again
      originalItems.forEach(item => {
        track.appendChild(item.cloneNode(true));
      });
    }
    
    // Set up animation
    const style = document.createElement('style');
    style.textContent = `
      .interests-icons {
        width: 100%;
        overflow: visible !important; /* Allow tooltips to extend beyond container */
        position: relative;
        height: 150px;
        margin: 2rem auto;
      }
      
      .carousel-track {
        display: flex;
        position: absolute;
        animation: moveTrack 15s linear infinite;
        padding: 10px 0;
      }
      
      .carousel-track:hover {
        animation-play-state: paused;
      }
      
      @keyframes moveTrack {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${trackWidth / 2}px); }
      }
      
      /* Speed control variables - adjust this for different speeds */
      :root {
        --carousel-speed: 15s;
      }
      
      .carousel-track {
        animation-duration: var(--carousel-speed) !important;
      }
      
      /* Optional: Add speed classes */
      .carousel-track.fast {
        animation-duration: calc(var(--carousel-speed) / 2) !important;
      }
      
      .carousel-track.slow {
        animation-duration: calc(var(--carousel-speed) * 2) !important;
      }
      
      .interest-item {
        flex: 0 0 auto;
        margin: 0 25px;
        position: relative;
      }
      
      .interest-tooltip {
        position: absolute;
        top: -150px;  /* Position higher above the icon */
        left: 50%;
        transform: translateX(-50%) scale(0.8);
        width: 280px; /* Increased width for more text space */
        background-color: var(--card-bg);
        padding: 1.5rem; /* Increased padding */
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 9999 !important;
        pointer-events: none;
        border: 1px solid rgba(255, 255, 255, 0.3);
        min-height: 100px; /* Ensure minimum height */
      }
      
      /* Create proper stacking context */
      .carousel-track {
        display: flex;
        position: absolute;
        animation: moveTrack 15s linear infinite;
        padding: 10px 0;
        z-index: 100;
      }
      
      /* Ensure interest items can have proper z-index */
      .interest-item {
        flex: 0 0 auto;
        margin: 0 25px;
        position: relative;
        z-index: 100;
      }
      
      /* When hovering, raise z-index significantly */
      .interest-item.hovered {
        z-index: 9000 !important;
      }
      
      .interest-tooltip::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 16px;
        height: 16px;
        background-color: var(--card-bg);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .interest-item:hover .interest-tooltip {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) scale(1);
      }
      
      .interest-item:hover .interest-icon {
        transform: translateY(-5px);
        border: 2px solid var(--primary);
        box-shadow: 0 0 15px rgba(72, 250, 250, 0.5);
      }
    `;
    
    document.head.appendChild(style);
    
    // Set up event handlers for all items in the track
    const newItems = track.querySelectorAll('.interest-item');
    
    newItems.forEach(item => {
      // Add hover effect handlers
      item.addEventListener('mouseenter', function() {
        this.classList.add('hovered');
        
        // Explicitly show tooltip
        const tooltip = this.querySelector('.interest-tooltip');
        if (tooltip) {
          // Force tooltip to be displayed properly
          tooltip.style.opacity = '1';
          tooltip.style.visibility = 'visible';
          tooltip.style.transform = 'translateX(-50%) scale(1)';
          tooltip.style.zIndex = '9999';
          tooltip.style.position = 'absolute';
          tooltip.style.top = '-150px';
          tooltip.style.width = '280px';
          tooltip.style.padding = '1.5rem';
          tooltip.style.minHeight = '100px';
          
          // Enhance tooltip appearance
          tooltip.style.backgroundColor = 'var(--card-bg)';
          tooltip.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
          tooltip.style.border = '1px solid rgba(255, 255, 255, 0.3)';
          
          // Make sure we're above all other elements
          this.style.zIndex = '9000';
        }
      });
      
      item.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
        
        // Explicitly hide tooltip
        const tooltip = this.querySelector('.interest-tooltip');
        if (tooltip) {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
          tooltip.style.transform = 'translateX(-50%) scale(0.8)';
        }
      });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      // Simple reset - remove and reinitialize
      container.innerHTML = originalHTML;
      setupInterestsCarousel();
    });
  }