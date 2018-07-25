'use strict';

// Libs
require('polyfills');
require('modernizr-custom');
require('modernizr-clip-path');

// Components
const Homepage = require('homepage');

// Remove static class from body.
document.body.classList.remove('static');

// Add onLoad event listener.
document.addEventListener("DOMContentLoaded", () => {
  Homepage.initialize();
});
