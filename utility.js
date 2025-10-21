(function () {
  "use strict";

  /** Helper to get script data attributes */
  function getDataAttr(name, fallback = null) {
    const scriptEl = document.getElementById("utility-bar-script");
    if (!scriptEl) return fallback;
    // Convert camelCase to dataset format (utilityMessage1 → utilityMessage1)
    return scriptEl.dataset[name] || fallback;
  }

  /** Retrieve full configuration */
  function getConfiguration() {
    const scriptEl = document.getElementById("utility-bar-script");
    if (!scriptEl) {
      console.error("Utility Bar: Script element not found");
      return null;
    }

    const config = {
      // Basic settings
      barText: getDataAttr("utilityText", ""),
      barLink: getDataAttr("utilityLink", ""),
      timerEnd: getDataAttr("utilityTimerEnd", ""),
      timerFormat: getDataAttr("utilityTimerFormat", "hh:mm:ss"),

      // Styling
      bgColor: getDataAttr("utilityBgColor", "#ff4757"),
      textColor: getDataAttr("utilityTextColor", "#ffffff"),
      barHeight: getDataAttr("utilityHeight", "40px"),
      placement: getDataAttr("utilityPlacement", "top-fixed"),
      fontSize: getDataAttr("utilityFontSize", "14px"),
      fontWeight: getDataAttr("utilityFontWeight", "500"),
      fontFamily: getDataAttr("utilityFontFamily", "Arial, sans-serif"),
      padding: getDataAttr("utilityPadding", "0 20px"),
      borderRadius: getDataAttr("utilityBorderRadius", "0"),
      border: getDataAttr("utilityBorder", "none"),
      boxShadow: getDataAttr("utilityBoxShadow", "none"),
      textAlign: getDataAttr("utilityTextAlign", "center"),
      lineHeight: getDataAttr("utilityLineHeight", "1.4"),
      letterSpacing: getDataAttr("utilityLetterSpacing", "normal"),
      textTransform: getDataAttr("utilityTextTransform", "none"),
      opacity: getDataAttr("utilityOpacity", "1"),
      transition: getDataAttr("utilityTransition", "all 0.3s ease"),
      zIndex: getDataAttr("utilityZIndex", "9999"),

      // Slider settings
      multipleText: getDataAttr("utilityMultipleText", ""),
      slideInterval: parseInt(getDataAttr("utilitySlideInterval", 0)) || 0,
      slideDirection: getDataAttr("utilitySlideDirection", "horizontal"),
      slideSpeed: parseInt(getDataAttr("utilitySlideSpeed", 3000)) || 3000,
      slideEasing: getDataAttr("utilitySlideEasing", "ease-in-out"),

      // Multiple messages
      message1: getDataAttr("utilityMessage1", ""),
      message2: getDataAttr("utilityMessage2", ""),
      message3: getDataAttr("utilityMessage3", ""),
      message4: getDataAttr("utilityMessage4", ""),
      message5: getDataAttr("utilityMessage5", ""),
      link1: getDataAttr("utilityLink1", ""),
      link2: getDataAttr("utilityLink2", ""),
      link3: getDataAttr("utilityLink3", ""),
      link4: getDataAttr("utilityLink4", ""),
      link5: getDataAttr("utilityLink5", ""),

      linkUnderline: getDataAttr("utilityLinkUnderline", "true") !== "false",
      autoStart: getDataAttr("utilityAutoStart", "true") !== "false",
      pauseOnHover: getDataAttr("utilityPauseOnHover", "true") !== "false",
    };

    return config;
  }

  /** Countdown timer calculation */
  function calculateTimeRemaining(endDate) {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  /** Format timer */
  function formatTimer(timeObj, format) {
    if (!timeObj) return "";
    const pad = (num) => num.toString().padStart(2, "0");
    return format
      .replace(/d+/g, timeObj.days.toString())
      .replace(/hh/g, pad(timeObj.hours))
      .replace(/h/g, timeObj.hours.toString())
      .replace(/mm/g, pad(timeObj.minutes))
      .replace(/m/g, timeObj.minutes.toString())
      .replace(/ss/g, pad(timeObj.seconds))
      .replace(/s/g, timeObj.seconds.toString());
  }

  /** Parse simple messages */
  function createSimpleMessages(config) {
    const messages = [];
    const underlineStyle = config.linkUnderline ? "underline" : "none";

    for (let i = 1; i <= 5; i++) {
      const message = config[`message${i}`];
      const link = config[`link${i}`];

      if (message) {
        const fullMessageMatch = message.match(/^(.+?)\s+@(https?:\/\/[^\s]+)$/);
        const isFullMessageLink = fullMessageMatch && !message.includes("[");

        if (isFullMessageLink) {
          const text = fullMessageMatch[1].trim();
          const url = fullMessageMatch[2].trim();
          messages.push(
            `<a href="${url}" style="color: inherit; text-decoration: ${underlineStyle}; font-weight: bold;">${text}</a>`
          );
        } else if (link) {
          messages.push(
            `<a href="${link}" style="color: inherit; text-decoration: ${underlineStyle}; font-weight: bold;">${message}</a>`
          );
        } else {
          // Inline links [text @url]
          const processed = message.replace(
            /\[([^\]]+?)\s*@(https?:\/\/[^\s\]]+)\]/g,
            '<a href="$2" style="color: inherit; text-decoration: ' +
            underlineStyle +
            '; font-weight: bold;">$1</a>'
          );
          messages.push(processed);
        }
      }
    }

    return messages;
  }

  /** Create sliding container */
  function createSlidingContent(texts, config) {
    const container = document.createElement("div");
    container.style.cssText =
      "display:flex;width:100%;height:100%;overflow:hidden;position:relative;";

    const slides = [];

    texts.forEach((text, idx) => {
      const slide = document.createElement("div");
      slide.style.position = "absolute";
      slide.style.top = 0;
      slide.style.left = 0;
      slide.style.width = "100%";
      slide.style.height = "100%";
      slide.style.display = "flex";
      slide.style.alignItems = "center";
      slide.style.justifyContent = "center";
      slide.style.transition = `all ${config.slideSpeed}ms ${config.slideEasing}`;
      slide.style.opacity = idx === 0 ? "1" : "0";
      slide.style.pointerEvents = idx === 0 ? "auto" : "none";

      slide.innerHTML = text;
      container.appendChild(slide);
      slides.push(slide);
    });

    if (slides.length > 1 && config.slideInterval > 0) {
      let currentIndex = 0;
      let interval = config.slideInterval * 1000;

      const showNextSlide = () => {
        const prev = slides[currentIndex];
        currentIndex = (currentIndex + 1) % slides.length;
        const next = slides[currentIndex];

        prev.style.opacity = "0";
        prev.style.pointerEvents = "none";
        next.style.opacity = "1";
        next.style.pointerEvents = "auto";
      };

      let intervalId = setInterval(showNextSlide, interval);

      if (config.pauseOnHover) {
        container.addEventListener("mouseenter", () => clearInterval(intervalId));
        container.addEventListener("mouseleave", () => {
          intervalId = setInterval(showNextSlide, interval);
        });
      }
    }

    return container;
  }

  /** Update timer inside bar */
  function updateTimerText(config, barEl) {
    if (!config.timerEnd) return;
    const remaining = calculateTimeRemaining(config.timerEnd);
    if (!remaining) {
      barEl.innerHTML = "Sale Ended";
      return;
    }
    const formatted = formatTimer(remaining, config.timerFormat);
    const messages = createSimpleMessages(config);
    if (messages.length) {
      barEl.innerHTML = messages.map((m) => m.replace(/\[TIMER\]/g, formatted))[0];
    } else {
      barEl.innerHTML = (config.multipleText || config.barText).replace(
        /\[TIMER\]/g,
        formatted
      );
    }
  }

  /** Create the announcement bar */
  function createAnnouncementBar(config) {
    const bar = document.createElement("div");

    let texts = createSimpleMessages(config);
    if (!texts.length) texts = (config.multipleText || config.barText).split("|");

    if (texts.length > 1 && config.slideInterval > 0) {
      const sliding = createSlidingContent(texts, config);
      bar.appendChild(sliding);
    } else {
      bar.innerHTML = texts[0] || config.barText;
    }

    // Apply styles
    Object.assign(bar.style, {
      position: "relative",
      zIndex: config.zIndex,
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
      top: config.placement.includes("top") ? "0" : "",
      bottom: config.placement.includes("bottom") ? "0" : "",
    });

    // Wrap in link if barLink is provided
    if (config.barLink) {
      const a = document.createElement("a");
      a.href = config.barLink;
      a.style.cssText = "display:block;width:100%;height:100%;color:inherit;text-decoration:none;";
      a.appendChild(bar);
      document.body.insertBefore(a, document.body.firstChild);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    // Timer updates
    if (config.timerEnd) {
      updateTimerText(config, bar);
      setInterval(() => updateTimerText(config, bar), 1000);
    }

    return bar;
  }

  /** Initialize utility bar */
  function init() {
    const config = getConfiguration();
    if (!config) return;

    const hasMessages =
      config.message1 ||
      config.message2 ||
      config.message3 ||
      config.message4 ||
      config.message5;

    if (!config.barText && !config.multipleText && !hasMessages) {
      console.error(
        "Utility Bar: barText, multipleText, or at least one message is required"
      );
      return;
    }

    createAnnouncementBar(config);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
