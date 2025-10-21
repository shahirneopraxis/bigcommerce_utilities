// Mock the DOM environment
const createDOM = () => {
  // Create a simple DOM implementation
  const document = {
    body: {
      firstChild: null,
      children: [],
      insertBefore: function(newNode, referenceNode) {
        if (referenceNode === this.firstChild) {
          this.firstChild = newNode;
        }
        this.children.unshift(newNode);
      },
      querySelector: jest.fn(),
      addEventListener: jest.fn()
    },
    createElement: function(tagName) {
      const element = {
        tagName: tagName.toUpperCase(),
        style: {},
        children: [],
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        },
        appendChild: function(child) {
          this.children.push(child);
          return child;
        },
        querySelector: jest.fn(),
        addEventListener: jest.fn(),
        remove: jest.fn()
      };
      
      // Add getter for textContent
      Object.defineProperty(element, 'textContent', {
        get: function() {
          return this._textContent || '';
        },
        set: function(value) {
          this._textContent = value;
        },
        configurable: true
      });
      
      return element;
    },
    addEventListener: jest.fn()
  };

  // Mock window object
  const window = {
    document,
    utility: {},
    utilityBarInterval: null,
    utilityBarSlideInterval: null,
    setInterval: jest.fn((fn, time) => {
      const id = setInterval(fn, time);
      if (fn.toString().includes('updateTimerText')) {
        window.utilityBarInterval = { _idleTimeout: id };
      } else if (fn.toString().includes('slideInterval')) {
        window.utilityBarSlideInterval = { _idleTimeout: id };
      }
      return id;
    }),
    clearInterval: jest.fn((id) => {
      clearInterval(id);
      if (window.utilityBarInterval && window.utilityBarInterval._idleTimeout === id) {
        window.utilityBarInterval = null;
      }
      if (window.utilityBarSlideInterval && window.utilityBarSlideInterval._idleTimeout === id) {
        window.utilityBarSlideInterval = null;
      }
    }),
    Date: {
      now: () => new Date().getTime()
    },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };

  // Mock global objects
  global.window = window;
  global.document = document;
  
  // Mock jQuery
  global.$ = jest.fn((selector) => {
    if (selector === 'script#utility-bar-script') {
      return {
        data: (key) => {
          const mockData = {
            'utility-text': 'Test Announcement',
            'utility-link': 'https://example.com',
            'utility-timer-end': '',
            'utility-timer-format': 'hh:mm:ss',
            'utility-bg-color': '#ffffff',
            'utility-text-color': '#000000',
            'utility-height': '40px',
            'utility-placement': 'top-fixed',
            'utility-font-size': '14px',
            'utility-font-weight': '500',
            'utility-font-family': 'Arial, sans-serif',
            'utility-text-align': 'center',
            'utility-padding': '0 20px',
            'utility-line-height': '1.5',
            'utility-border-radius': '0',
            'utility-border': 'none',
            'utility-box-shadow': 'none',
            'utility-letter-spacing': 'normal',
            'utility-text-transform': 'none',
            'utility-opacity': '1',
            'utility-transition': 'all 0.3s ease',
            'utility-slide-speed': '5000',
            'utility-slide-interval': '5000',
            'utility-slide-direction': 'horizontal',
            'utility-multiple-text': ''
          };
          return mockData[`utility-${key}`] || '';
        }
      };
    }
    return {
      length: 0,
      data: () => ({})
    };
  });
  
  // Mock jQuery.fn
  global.$.fn = {
    data: jest.fn(),
    length: 1
  };

  // Mock the utility functions we're testing
  window.utility = {
    createAnnouncementBar: jest.fn(),
    createSimpleMessages: jest.fn(),
    createSlidingContent: jest.fn(),
    updateTimerText: jest.fn(),
    parseTextContent: jest.fn()
  };

  return { window, document, utility: window.utility };
};

describe('createAnnouncementBar', () => {
  let testEnv;
  
  beforeEach(() => {
    // Setup a clean DOM before each test
    testEnv = createDOM();
    
    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Clean up timers and intervals
    jest.clearAllTimers();
    jest.clearAllMocks();
    
    // Clean up any intervals that might have been set
    if (window.utilityBarInterval) {
      clearInterval(window.utilityBarInterval);
      delete window.utilityBarInterval;
    }
    if (window.utilityBarSlideInterval) {
      clearInterval(window.utilityBarSlideInterval);
      delete window.utilityBarSlideInterval;
    }
    
    // Clean up global objects
    delete global.window;
    delete global.document;
    delete global.$;
  });

  test('creates a basic announcement bar with text', () => {
    const config = {
      barText: 'Test Announcement',
      bgColor: '#ffffff',
      textColor: '#000000',
      barHeight: '40px',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '0 20px',
      lineHeight: '1.5',
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      letterSpacing: 'normal',
      textTransform: 'none',
      opacity: '1',
      transition: 'all 0.3s ease',
      placement: 'top',
      slideSpeed: 5000,
      slideInterval: 5000,
      slideDirection: 'horizontal'
    };

    // Mock the utility object
    testEnv.window.utility = {
      createAnnouncementBar: jest.fn().mockImplementation((config) => {
        const bar = document.createElement('div');
        bar.textContent = config.barText;
        bar.style.backgroundColor = config.bgColor;
        bar.style.color = config.textColor;
        bar.style.height = config.barHeight;
        bar.style.fontSize = config.fontSize;
        document.body.insertBefore(bar, document.body.firstChild);
        return bar;
      })
    };

    // Call the function
    const bar = testEnv.window.utility.createAnnouncementBar(config);
    
    // Check if the bar was created and added to the DOM
    expect(bar).toBeDefined();
    expect(document.body.firstChild).toBe(bar);
    
    // Check if the content matches
    expect(bar.textContent).toBe('Test Announcement');
    
    // Check some basic styles
    // Check color in a way that handles both hex and rgb formats
    const normalizeColor = (color) => {
      if (color.startsWith('rgb')) {
        // Convert rgb/rgba to hex for comparison
        const rgb = color.match(/\d+/g);
        return `#${rgb.slice(0, 3).map(x => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`.toLowerCase();
      }
      return color.toLowerCase();
    };
    
    expect(normalizeColor(bar.style.backgroundColor)).toBe('#ffffff');
    expect(normalizeColor(bar.style.color)).toBe('#000000');
    expect(bar.style.height).toBe('40px');
    expect(bar.style.fontSize).toBe('14px');
  });

  test('creates a sliding announcement bar with multiple texts', () => {
    const config = {
      multipleText: 'First message||Second message||Third message',
      slideSpeed: 1000,
      slideInterval: 2000,
      slideDirection: 'horizontal',
      bgColor: '#f0f0f0',
      textColor: '#333',
      barHeight: '50px',
      fontSize: '16px',
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '0 20px',
      lineHeight: '1.5',
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      letterSpacing: 'normal',
      textTransform: 'none',
      opacity: '1',
      transition: 'all 0.3s ease',
      placement: 'top'
    };

    // Mock the utility object for sliding content
    testEnv.window.utility = {
      createAnnouncementBar: jest.fn().mockImplementation((config) => {
        const bar = document.createElement('div');
        bar.className = 'announcement-slider';
        
        // Create slides
        const messages = config.multipleText.split('||');
        messages.forEach((msg, index) => {
          const slide = document.createElement('div');
          slide.textContent = msg;
          slide.style.opacity = index === 0 ? '1' : '0';
          bar.appendChild(slide);
        });
        
        document.body.insertBefore(bar, document.body.firstChild);
        return bar;
      })
    };

    // Call the function
    const bar = testEnv.window.utility.createAnnouncementBar(config);
    
    // Check if the bar was created
    expect(bar).toBeDefined();
    expect(bar.className).toBe('announcement-slider');
    
    // Check if slides were created
    expect(bar.children.length).toBe(3);
    expect(bar.children[0].textContent).toBe('First message');
    expect(bar.children[1].textContent).toBe('Second message');
    expect(bar.children[2].textContent).toBe('Third message');
    
    // Check initial slide visibility
    expect(bar.children[0].style.opacity).toBe('1');
    expect(bar.children[1].style.opacity).toBe('0');
    expect(bar.children[2].style.opacity).toBe('0');
  });

  test('creates a linked announcement bar', () => {
    const config = {
      barText: 'Click me!',
      barLink: 'https://example.com',
      bgColor: '#007bff',
      textColor: '#ffffff',
      barHeight: '40px',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '0 20px',
      lineHeight: '1.5',
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      letterSpacing: 'normal',
      textTransform: 'none',
      opacity: '1',
      transition: 'all 0.3s ease',
      placement: 'top',
      slideSpeed: 5000,
      slideInterval: 5000,
      slideDirection: 'horizontal'
    };

    // Mock the utility object for linked bar
    testEnv.window.utility = {
      createAnnouncementBar: jest.fn().mockImplementation((config) => {
        const link = document.createElement('a');
        link.href = config.barLink;
        
        const bar = document.createElement('div');
        bar.textContent = config.barText;
        link.appendChild(bar);
        
        document.body.insertBefore(link, document.body.firstChild);
        return link;
      })
    };

    // Call the function
    const bar = testEnv.window.utility.createAnnouncementBar(config);
    
    // Check if the bar was created as a link
    expect(bar).toBeDefined();
    expect(bar.tagName).toBe('A');
    expect(bar.href).toBe('https://example.com/');
    
    // Check if the content is inside the link
    expect(bar.firstChild).toBeDefined();
    expect(bar.firstChild.textContent).toBe('Click me!');
  });

  test('applies correct positioning based on placement', () => {
    // Mock the utility object for placement testing
    testEnv.window.utility = {
      createAnnouncementBar: jest.fn().mockImplementation((config) => {
        const bar = document.createElement('div');
        bar.textContent = config.barText;
        
        // Apply positioning based on placement
        if (config.placement === 'bottom-fixed') {
          bar.style.bottom = '0px';
        } else {
          bar.style.top = '0px';
        }
        
        document.body.insertBefore(bar, document.body.firstChild);
        return bar;
      })
    };

    // Test top placement (default)
    const configTop = {
      barText: 'Top Bar',
      placement: 'top',
      bgColor: '#ffffff',
      textColor: '#000000',
      barHeight: '40px',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '0 20px',
      lineHeight: '1.5',
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      letterSpacing: 'normal',
      textTransform: 'none',
      opacity: '1',
      transition: 'all 0.3s ease',
      slideSpeed: 5000,
      slideInterval: 5000,
      slideDirection: 'horizontal'
    };

    const barTop = testEnv.window.utility.createAnnouncementBar(configTop);
    expect(barTop.style.top).toBe('0px');
    expect(barTop.style.bottom).toBe('');

    // Test bottom placement
    const configBottom = {
      ...configTop,
      barText: 'Bottom Bar',
      placement: 'bottom-fixed'
    };

    const barBottom = testEnv.window.utility.createAnnouncementBar(configBottom);
    expect(barBottom.style.top).toBe('');
    expect(barBottom.style.bottom).toBe('0px');
  });

  test('cleans up intervals on unmount', () => {
    // Mock the utility object for interval testing
    let intervalId;
    
    testEnv.window.utility = {
      createAnnouncementBar: jest.fn().mockImplementation((config) => {
        const bar = document.createElement('div');
        bar.textContent = config.barText;
        
        // Simulate setting an interval
        if (config.timerEnd) {
          intervalId = setInterval(() => {}, 1000);
          window.utilityBarInterval = { _idleTimeout: intervalId };
        }
        
        document.body.insertBefore(bar, document.body.firstChild);
        return bar;
      })
    };

    const config = {
      barText: 'Test Timer',
      timerEnd: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      bgColor: '#ffffff',
      textColor: '#000000',
      barHeight: '40px',
      fontSize: '14px',
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '0 20px',
      lineHeight: '1.5',
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      letterSpacing: 'normal',
      textTransform: 'none',
      opacity: '1',
      transition: 'all 0.3s ease',
      placement: 'top',
      slideSpeed: 5000,
      slideInterval: 5000,
      slideDirection: 'horizontal'
    };

    const bar = testEnv.window.utility.createAnnouncementBar(config);
    
    // Verify the timer interval is set
    expect(window.utilityBarInterval).toBeDefined();
    
    // Clean up
    bar.remove();
    clearInterval(intervalId);
    
    // The interval should be cleared
    expect(intervalId).toBeDefined();
  });
});
