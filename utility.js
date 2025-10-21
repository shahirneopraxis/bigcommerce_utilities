(function ($) {
  "use strict";

  /**
   * Configuration retrieval from data attributes
   * 
   * Available options (all are optional):
   * 
   * Basic Settings:
   * - data-utility-text: Main announcement text (single message)
   * - data-utility-link: URL for the announcement (if clickable)
   * - data-utility-placement: Position of the bar (top, bottom, top-fixed, bottom-fixed)
   * 
   * Timer Settings:
   * - data-utility-timer-end: End date for countdown timer (ISO format)
   * - data-utility-timer-format: Format for timer (e.g., "hh:mm:ss", "d days hh:mm")
   * 
   * Styling:
   * - data-utility-bg-color: Background color (any valid CSS color)
   * - data-utility-text-color: Text color (any valid CSS color)
   * - data-utility-height: Height of the bar (e.g., "40px")
   * - data-utility-font-size: Font size (e.g., "14px")
   * - data-utility-font-weight: Font weight (e.g., "500")
   * - data-utility-font-family: Font family stack
   * - data-utility-padding: Padding (e.g., "10px 20px")
   * - data-utility-border-radius: Border radius (e.g., "4px")
   * - data-utility-border: Border style (e.g., "1px solid #ddd")
   * - data-utility-box-shadow: Box shadow (e.g., "0 2px 10px rgba(0,0,0,0.1)")
   * - data-utility-text-align: Text alignment (left, center, right)
   * - data-utility-line-height: Line height (e.g., "1.5")
   * - data-utility-letter-spacing: Letter spacing (e.g., "1px")
   * - data-utility-text-transform: Text transform (none, uppercase, lowercase, capitalize)
   * - data-utility-opacity: Opacity (0-1)
   * - data-utility-transition: CSS transition properties
   * - data-utility-z-index: Z-index of the bar
   * 
   * Slider Settings:
   * - data-utility-slide-interval: Time between slides in seconds (0 to disable)
   * - data-utility-slide-speed: Transition speed in milliseconds
   * - data-utility-slide-direction: Animation direction (horizontal, vertical, fade, fade-letter)
   * - data-utility-slide-easing: Animation easing (ease, ease-in, ease-out, ease-in-out, linear)
   * 
   * Multiple Messages:
   * - data-utility-message1 through message5: Individual announcement messages
   * - data-utility-link1 through link5: Links for each message
   * - data-utility-link-underline: Show underline on links (true/false)
   * 
   * Advanced:
   * - data-utility-auto-start: Auto-start animations (true/false)
   * - data-utility-pause-on-hover: Pause animation on hover (true/false)
   */
  function getConfiguration() {
    const $script = $('script#utility-bar-script');
    if (!$script.length) {
      console.error("Utility Bar: Script element not found");
      return null;
    }

    const config = {
      // Basic settings
      barText: $script.data('utility-text') || "",
      barLink: $script.data('utility-link') || "",
      timerEnd: $script.data('utility-timer-end') || "",
      timerFormat: $script.data('utility-timer-format') || "hh:mm:ss",
      
      // Styling
      bgColor: $script.data('utility-bg-color') || "#ff4757",
      textColor: $script.data('utility-text-color') || "#ffffff",
      barHeight: $script.data('utility-height') || "40px",
      placement: $script.data('utility-placement') || "top-fixed",
      fontSize: $script.data('utility-font-size') || "14px",
      fontWeight: $script.data('utility-font-weight') || "500",
      fontFamily: $script.data('utility-font-family') || "Arial, sans-serif",
      padding: $script.data('utility-padding') || "0 20px",
      borderRadius: $script.data('utility-border-radius') || "0",
      border: $script.data('utility-border') || "none",
      boxShadow: $script.data('utility-box-shadow') || "none",
      textAlign: $script.data('utility-text-align') || "center",
      lineHeight: $script.data('utility-line-height') || "1.4",
      letterSpacing: $script.data('utility-letter-spacing') || "normal",
      textTransform: $script.data('utility-text-transform') || "none",
      opacity: $script.data('utility-opacity') || "1",
      transition: $script.data('utility-transition') || "all 0.3s ease",
      zIndex: $script.data('utility-z-index') || "9999",
      
      // Slider settings
      multipleText: $script.data('utility-multiple-text') || "",
      slideInterval: parseInt($script.data('utility-slide-interval')) || 0,
      slideDirection: $script.data('utility-slide-direction') || "horizontal",
      slideSpeed: parseInt($script.data('utility-slide-speed')) || 3000,
      slideEasing: $script.data('utility-slide-easing') || "ease-in-out",
      
      // Multiple messages
      message1: $script.data('utility-message1') || "",
      message2: $script.data('utility-message2') || "",
      message3: $script.data('utility-message3') || "",
      message4: $script.data('utility-message4') || "",
      message5: $script.data('utility-message5') || "",
      link1: $script.data('utility-link1') || "",
      link2: $script.data('utility-link2') || "",
      link3: $script.data('utility-link3') || "",
      link4: $script.data('utility-link4') || "",
      link5: $script.data('utility-link5') || "",
      
      // Link styling
      linkUnderline: $script.data('utility-link-underline') !== 'false',
      
      // Advanced
      autoStart: $script.data('utility-auto-start') !== 'false',
      pauseOnHover: $script.data('utility-pause-on-hover') !== 'false'
    };

    return config;
  }

  // Countdown timer calculation
  function calculateTimeRemaining(endDate) {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return null; // Timer expired
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  // Format timer based on format string
  function formatTimer(timeObj, format) {
    if (!timeObj) return "";

    const { days, hours, minutes, seconds } = timeObj;

    // Helper function to pad with leading zeros
    const pad = (num) => num.toString().padStart(2, "0");

    // Replace format placeholders
    let formatted = format
      .replace(/d+/g, days.toString())
      .replace(/hh/g, pad(hours))
      .replace(/h/g, hours.toString())
      .replace(/mm/g, pad(minutes))
      .replace(/m/g, minutes.toString())
      .replace(/ss/g, pad(seconds))
      .replace(/s/g, seconds.toString());

    return formatted;
  }

  // Parse multiple text content and create HTML with inline links
  function parseTextContent(text) {
    if (!text) return "";

    // Split by | separator for multiple messages
    const messages = text.split("|").map((msg) => msg.trim());

    return messages.map((message) => {
      // Replace [LINK:url|text] with actual links
      return message.replace(
        /\[LINK:([^|]+)\|([^\]]+)\]/g,
        '<a href="$1" style="color: inherit; text-decoration: underline; font-weight: bold;">$2</a>'
      );
    });
  }

  // Create simple messages from individual data attributes
  function createSimpleMessages(config) {
    const messages = [];
    const underlineStyle =
      config.linkUnderline === "true" ? "underline" : "none";

    // Check each message slot
    for (let i = 1; i <= 5; i++) {
      const message = config[`message${i}`];
      const link = config[`link${i}`];

      if (message) {
        // Check if message contains URL pattern: "text @url" (but not inline links with brackets)
        const fullMessageMatch = message.match(
          /^(.+?)\s+@(https?:\/\/[^\s]+)$/
        );
        const isFullMessageLink = fullMessageMatch && !message.includes("[");

        if (isFullMessageLink) {
          // Extract text and URL from message
          const text = fullMessageMatch[1].trim();
          const url = fullMessageMatch[2].trim();
          messages.push(
            `<a href="${url}" style="color: inherit; text-decoration: ${underlineStyle}; font-weight: bold;">${text}</a>`
          );
        } else if (link) {
          // Use separate link attribute (old method)
          messages.push(
            `<a href="${link}" style="color: inherit; text-decoration: ${underlineStyle}; font-weight: bold;">${message}</a>`
          );
        } else {
          // Check for inline links: "text [link text @url] more text"
          console.log("Processing message:", message);
          const processedMessage = message.replace(
            /(\s?)\[([^\]]+?)\s*@(https?:\/\/[^\s\]]+)\](\s?)/g,
            (match, spaceBefore, linkText, url, spaceAfter) => {
              // Use existing spaces, don't add new ones
              console.log(
                "Space before:",
                JSON.stringify(spaceBefore),
                "Space after:",
                JSON.stringify(spaceAfter)
              );
              return `${spaceBefore}<a href="${url}" style="color: inherit; text-decoration: ${underlineStyle}; font-weight: bold;">${linkText}</a>${spaceAfter}`;
            }
          );
          console.log("Processed message:", processedMessage);
          messages.push(processedMessage);
        }
      }
    }

    return messages;
  }

  // Create sliding content container with enhanced animations
  function createSlidingContent(texts, config) {
    const container = document.createElement("div");
    container.style.cssText = `
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    `;

    // Add animation styles to head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInLetter {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOutLetter {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
      .utility-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform, opacity;
      }
      .letter {
        display: inline-block;
        white-space: pre;
      }
    `;
    document.head.appendChild(style);

    // Create slides
    const slides = [];
    
    texts.forEach((text, index) => {
      const slide = document.createElement("div");
      slide.className = 'utility-slide';
      
      // Set initial state
      const isActive = index === 0;
      const direction = config.slideDirection || 'fade';
      
      // Apply initial styles based on direction
      const styles = {
        opacity: isActive ? 1 : 0,
        transition: `all ${config.slideSpeed || 500}ms ${config.slideEasing || 'ease-in-out'}`,
        pointerEvents: isActive ? 'auto' : 'none'
      };

      // Set initial position based on direction
      if (!isActive) {
        switch(direction) {
          case 'horizontal':
            styles.transform = 'translateX(100%)';
            break;
          case 'vertical':
            styles.transform = 'translateY(100%)';
            break;
          case 'fade':
          case 'fade-letter':
            styles.opacity = 0;
            break;
        }
      }
      
      // Apply styles
      Object.assign(slide.style, styles);
      
      // Process content based on animation type
      if (direction === 'fade-letter') {
        // Split text into characters for letter-by-letter animation
        const chars = text.split('');
        const content = document.createElement('div');
        content.className = 'slide-content';
        
        chars.forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = char === ' ' ? '\u00A0' : char;
          
          // Only animate non-whitespace characters
          if (char.trim() !== '') {
            span.style.animation = isActive 
              ? `fadeInLetter 0.3s ${i * 0.03}s both`
              : 'none';
          }
          
          content.appendChild(span);
        });
        
        slide.appendChild(content);
      } else {
        // Regular slide content
        slide.innerHTML = text;
      }
      
      container.appendChild(slide);
      slides.push({
        element: slide,
        content: text,
        isActive
      });
    });

    // Auto-advance slides if enabled
    if (texts.length > 1 && (config.slideInterval || 0) > 0) {
      let currentIndex = 0;
      let timeoutId;
      const interval = (config.slideInterval || 3) * 1000;
      const direction = config.slideDirection || 'fade';
      
      const showNextSlide = () => {
        const prevIndex = currentIndex;
        currentIndex = (currentIndex + 1) % texts.length;
        
        const currentSlide = slides[prevIndex];
        const nextSlide = slides[currentIndex];
        
        // Animate out current slide
        switch(direction) {
          case 'horizontal':
            currentSlide.element.style.transform = 'translateX(-100%)';
            nextSlide.element.style.transform = 'translateX(0)';
            break;
          case 'vertical':
            currentSlide.element.style.transform = 'translateY(-100%)';
            nextSlide.element.style.transform = 'translateY(0)';
            break;
          case 'fade':
          case 'fade-letter':
            currentSlide.element.style.opacity = '0';
            nextSlide.element.style.opacity = '1';
            
            // For letter animations, animate each character
            if (direction === 'fade-letter') {
              const letters = currentSlide.element.querySelectorAll('.letter');
              letters.forEach((letter, i) => {
                letter.style.animation = `fadeOutLetter 0.3s ${i * 0.02}s both`;
              });
              
              const nextLetters = nextSlide.element.querySelectorAll('.letter');
              nextLetters.forEach((letter, i) => {
                letter.style.animation = `fadeInLetter 0.3s ${i * 0.03}s both`;
              });
            }
            break;
        }
        
        // Update active states
        currentSlide.isActive = false;
        nextSlide.isActive = true;
        
        // Update pointer events
        currentSlide.element.style.pointerEvents = 'none';
        nextSlide.element.style.pointerEvents = 'auto';
        
        // Queue next slide
        timeoutId = setTimeout(showNextSlide, interval);
      };
      
      // Start auto-advance
      if (config.autoStart !== false) {
        timeoutId = setTimeout(showNextSlide, interval);
      }
      
      // Pause on hover if enabled
      if (config.pauseOnHover !== false) {
        container.addEventListener('mouseenter', () => {
          if (timeoutId) clearTimeout(timeoutId);
        });
        
        container.addEventListener('mouseleave', () => {
          if (config.autoStart !== false) {
            timeoutId = setTimeout(showNextSlide, interval);
          }
        });
      }
    }
    
    return container;
  }

  // Update timer in bar text
  function updateTimerText(config, barElement) {
    if (!config.timerEnd) return;

    const timeRemaining = calculateTimeRemaining(config.timerEnd);

    if (timeRemaining) {
      const formattedTime = formatTimer(timeRemaining, config.timerFormat);

      // Handle simple messages first
      const simpleMessages = createSimpleMessages(config);
      if (simpleMessages.length > 0) {
        // Update simple messages with timer
        const updatedMessages = simpleMessages.map((msg) =>
          msg.replace(/\[TIMER\]/g, formattedTime)
        );

        if (barElement.querySelector('div[style*="position: absolute"]')) {
          // Sliding content - update all slides
          const slides = barElement.querySelectorAll(
            'div[style*="position: absolute"]'
          );
          slides.forEach((slide, index) => {
            if (updatedMessages[index]) {
              slide.innerHTML = updatedMessages[index];
            }
          });
        } else {
          // Single content
          barElement.innerHTML = updatedMessages[0] || config.barText;
        }
        return;
      }

      // Fall back to complex multiple text or single text
      const contentText = config.multipleText || config.barText;
      const updatedText = contentText.replace(/\[TIMER\]/g, formattedTime);

      // Update content based on structure
      if (barElement.querySelector('div[style*="position: absolute"]')) {
        // Sliding content - update all slides
        const slides = barElement.querySelectorAll(
          'div[style*="position: absolute"]'
        );
        slides.forEach((slide) => {
          slide.innerHTML = slide.innerHTML.replace(
            /\[TIMER\]/g,
            formattedTime
          );
        });
      } else {
        // Single content
        barElement.innerHTML = updatedText;
      }
    } else {
      // Timer expired
      if (barElement.querySelector('div[style*="position: absolute"]')) {
        // Sliding content - update all slides
        const slides = barElement.querySelectorAll(
          'div[style*="position: absolute"]'
        );
        slides.forEach((slide) => {
          slide.innerHTML = "Sale Ended";
        });
      } else {
        // Single content
        barElement.innerHTML = "Sale Ended";
      }

      if (window.utilityBarInterval) {
        clearInterval(window.utilityBarInterval);
        window.utilityBarInterval = null;
      }
    }
  }

  // Create and inject the announcement bar
  function createAnnouncementBar(config) {
    // Create the bar element
    const barElement = document.createElement("div");

    // Determine content source - prioritize simple messages
    let texts = [];

    // Check if simple messages are used
    const simpleMessages = createSimpleMessages(config);
    if (simpleMessages.length > 0) {
      texts = simpleMessages;
    } else {
      // Fall back to complex multiple text or single text
      const contentText = config.multipleText || config.barText;
      texts = parseTextContent(contentText);
    }

    if (texts.length > 1 && config.slideInterval > 0) {
      // Create sliding content
      const slidingContainer = createSlidingContent(texts, config);
      barElement.appendChild(slidingContainer);

      // Set up auto-sliding
      let currentIndex = 0;
      window.utilityBarSlideInterval = setInterval(() => {
        const slides = slidingContainer.children;

        // Hide current slide
        slides[currentIndex].style.opacity = "0";
        if (config.slideDirection === "horizontal") {
          slides[currentIndex].style.transform = `translateX(-100%)`;
        } else {
          slides[currentIndex].style.transform = `translateY(-100%)`;
        }

        // Move to next slide
        currentIndex = (currentIndex + 1) % slides.length;

        // Show next slide
        slides[currentIndex].style.opacity = "1";
        if (config.slideDirection === "horizontal") {
          slides[currentIndex].style.transform = `translateX(0%)`;
        } else {
          slides[currentIndex].style.transform = `translateY(0%)`;
        }
      }, config.slideSpeed);
    } else {
      // Single content or no sliding
      barElement.innerHTML = texts[0] || config.barText;
    }

    // Apply inline styles for maximum priority
    const styles = {
      position: "fixed",
      zIndex: "9999",
      width: "100%",
      height: config.barHeight,
      backgroundColor: config.bgColor,
      color: config.textColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fontFamily: config.fontFamily,
      textAlign: config.textAlign,
      cursor: config.barLink ? "pointer" : "default",
      boxSizing: "border-box",
      padding: config.padding,
      lineHeight: config.lineHeight,
      borderRadius: config.borderRadius,
      border: config.border,
      boxShadow: config.boxShadow,
      letterSpacing: config.letterSpacing,
      textTransform: config.textTransform,
      opacity: config.opacity,
      transition: config.transition,
    };

    // Set positioning based on placement
    if (config.placement === "bottom-fixed") {
      styles.bottom = "0";
    } else {
      styles.top = "0";
    }

    // Apply all styles
    Object.assign(barElement.style, styles);

    // Wrap in link if barLink is provided
    let finalElement = barElement;
    if (config.barLink) {
      const linkElement = document.createElement("a");
      linkElement.href = config.barLink;
      linkElement.style.textDecoration = "none";
      linkElement.style.color = "inherit";
      linkElement.style.display = "block";
      linkElement.style.width = "100%";
      linkElement.style.height = "100%";
      linkElement.style.display = "flex";
      linkElement.style.alignItems = "center";
      linkElement.style.justifyContent = "center";
      linkElement.appendChild(barElement);
      finalElement = linkElement;
    }

    // Insert as first child of body
    if (document.body) {
      document.body.insertBefore(finalElement, document.body.firstChild);
    } else {
      // If body doesn't exist yet, wait for DOM ready
      document.addEventListener("DOMContentLoaded", function () {
        document.body.insertBefore(finalElement, document.body.firstChild);
      });
    }

    // Set up timer if needed
    if (config.timerEnd) {
      // Initial timer update
      updateTimerText(config, barElement);

      // Set up interval for updates
      window.utilityBarInterval = setInterval(function () {
        updateTimerText(config, barElement);
      }, 1000);
    }

    return finalElement;
  }

  // Main initialization function
  function init() {
    const config = getConfiguration();
    if (!config) return;

    // Validate required configuration
    const hasSimpleMessages =
      config.message1 ||
      config.message2 ||
      config.message3 ||
      config.message4 ||
      config.message5;
    if (!config.barText && !config.multipleText && !hasSimpleMessages) {
      console.error(
        "Utility Bar: barText, multipleText, or at least one message is required"
      );
      return;
    }

    // Create the announcement bar
    createAnnouncementBar(config);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
