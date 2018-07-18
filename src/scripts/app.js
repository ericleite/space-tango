'use strict';

// Libs
const ScrollMagic = require('scrollmagic');

// Utils
const { findAncestor } = require('utils');

class App {
  constructor() {
    this.controller = new ScrollMagic.Controller();
    this.scenes = {};
    this.figureVideos = [];
    this.handleMouseenterVideo = this.handleMouseenterVideo.bind(this);
    this.handleMouseleaveVideo = this.handleMouseleaveVideo.bind(this);
  }

  init() {
    this.buildScenes();
    this.addFigures();
  }

  buildScenes() {
    // Hero section
    const heroTrigger = '#hero';
    this.scenes.hero = [
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false
      }).setClassToggle('#heroHeadline', 'active'),
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false
      }).setClassToggle('#heroImage', 'active')
    ];
    this.controller.addScene(this.scenes.hero);

    // Featured Work header section
    const featuredWorkHeaderTrigger = '#featuredWorkHeader';
    this.scenes.featuredWorkHeader = [
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false
      }).setClassToggle('#featuredWorkHeaderCaption', 'active'),
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false
      }).setClassToggle('#featuredWorkHeaderFigure', 'active')
    ];
    this.controller.addScene(this.scenes.featuredWorkHeader);
  }

  addFigures() {
    this.figureVideos = document.querySelectorAll('.featuredWorkFigure video');
    Array.prototype.forEach.call(this.figureVideos, video => {
      video.addEventListener('mouseenter', this.handleMouseenterVideo);
      video.addEventListener('mouseleave', this.handleMouseleaveVideo);
    });
  }

  handleMouseenterVideo(e) {
    findAncestor(e.target, '.featuredWorkFigure').querySelector('figcaption').classList.add('secondary');
  }

  handleMouseleaveVideo(e) {
    findAncestor(e.target, '.featuredWorkFigure').querySelector('figcaption').classList.remove('secondary');    
  }
}

module.exports = new App();
