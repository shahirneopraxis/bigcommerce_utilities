// Mock any global browser APIs that might be needed
// This file runs before each test file

// Mock the requestAnimationFrame and cancelAnimationFrame
// which are used by some DOM libraries
window.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

window.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock the Date.now() function to return a fixed timestamp
// This is useful for testing time-dependent functionality
const mockDate = new Date('2025-10-21T08:30:00Z');
const originalDateNow = Date.now;

global.Date.now = jest.fn(() => mockDate.getTime());

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  
  // Reset any intervals that might have been set
  if (window.utilityBarInterval) {
    clearInterval(window.utilityBarInterval);
    delete window.utilityBarInterval;
  }
  
  if (window.utilityBarSlideInterval) {
    clearInterval(window.utilityBarSlideInterval);
    delete window.utilityBarSlideInterval;
  }
  
  // Reset the document body
  document.body.innerHTML = '';
});
