'use strict';

// Libs
const scrollMonitor = require('scrollmonitor');

class App {
  constructor() {
    this.watchers = {};
    console.log('App initialized.');
  }

  init() {
    const featuredWorkHeaderCaption = document.getElementById('featuredWorkHeaderCaption');
    this.watchers.featuredWorkHeaderCaption = scrollMonitor.create(featuredWorkHeaderCaption);
    this.watchers.featuredWorkHeaderCaption.fullyEnterViewport(function() {
      featuredWorkHeaderCaption.classList.add('active');
    });
    this.watchers.featuredWorkHeaderCaption.exitViewport(function() {
      featuredWorkHeaderCaption.classList.remove('active');
    });

    const featuredWorkHeaderFigure = document.getElementById('featuredWorkHeaderFigure');
    this.watchers.featuredWorkHeaderFigure = scrollMonitor.create(featuredWorkHeaderFigure);
    this.watchers.featuredWorkHeaderFigure.fullyEnterViewport(function() {
      featuredWorkHeaderFigure.classList.add('active');
    });
    this.watchers.featuredWorkHeaderFigure.exitViewport(function() {
      featuredWorkHeaderFigure.classList.remove('active');
    });
  }
}

module.exports = new App();
