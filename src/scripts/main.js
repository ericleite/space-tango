'use strict';

const Homepage = require('homepage');

// Remove static class from body.
document.body.classList.remove('static');

// Add onLoad event listener.
document.addEventListener("DOMContentLoaded", () => {
  Homepage.initialize();
});
