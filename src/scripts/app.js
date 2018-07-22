'use strict';

// Libs
import CSSPlugin from 'gsap/CSSPlugin';
import EasePack from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

// Utils
import { findAncestor } from 'utils';
import { colors } from 'constants';
import { log } from 'util';

// Local constants
const darkBodyStyle = {
  backgroundColor: colors.spaceGrey,
  color: colors.white
};
const lightBodyStyle = {
  backgroundColor: colors.grey,
  color: colors.spaceGrey
};
const redBodyStyle = {
  backgroundColor: colors.fireEngineRed,
  color: colors.white
};

// Trigger constants
const heroTrigger = '#hero';
const featuredWorkHeaderTrigger = '#featuredWorkHeader';
const lightSectionTrigger = '#lightSection';

/*
* App class is the base controller for the app.
*/
class App {
  constructor() {
    // Properties
    this.controller = new ScrollMagic.Controller();
    this.scenes = {};
    this.figureVideos = [];
    this.tweens = {};

    // Event handlers
    this.handleMouseenterVideo = this.handleMouseenterFigureVideo.bind(this);
    this.handleMouseleaveVideo = this.handleMouseleaveFigureVideo.bind(this);
  }

  /*
  * Used to initialize the application. Only call this once the DOM is ready.
  */
  init() {
    this.buildStaticScenes();
    this.buildCubeSliderScenes();
    this.forceStartAutoplayVideos();
    this.registerFigureVideos();
  }

  /*
  * Creates scroll-based animations for each section.
  */
  buildStaticScenes() {
    // Hero section
    this.scenes.hero = [
      // Caption fade/rise-in
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false,
        triggerHook: 1
      })
        .setClassToggle('#heroHeadline', 'active'),
      // Globe fade-in
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false,
        triggerHook: 1
      })
        .setClassToggle('#heroImage', 'active')
    ];
    this.controller.addScene(this.scenes.hero);

    // Featured Work header section
    this.scenes.featuredWorkHeader = [
      // "Featured Work" intro fade/rise-in
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false,
        triggerHook: 0.8
      })
        .setClassToggle('#featuredWorkHeaderCaption', 'active'),
      // ISS image fade/swoop-in
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false,
        triggerHook: 0.8
      })
        .setClassToggle('#featuredWorkHeaderFigure', 'active')
    ];
    this.controller.addScene(this.scenes.featuredWorkHeader);

    // Dark to light transition
    const tweenBodyFromDarkToLight = TweenLite.fromTo(document.body, 1, darkBodyStyle, lightBodyStyle);
    this.scenes.darkToLight = new ScrollMagic.Scene({
      triggerElement: lightSectionTrigger,
      triggerHook: 'onEnter',
      duration: 320
    }).setTween(tweenBodyFromDarkToLight);
    this.controller.addScene(this.scenes.darkToLight);
  }

  buildCubeSliderScenes() {
    const timeline = new TimelineLite();
    const slides = document.querySelectorAll('#cubeSlider > div');
    const slideCount = slides.length;

    // Add slides to the timeline.
    let slideIndex = slideCount - 1;
    while (slideIndex >= 0) {
      if (slideIndex > 0) {
        timeline.fromTo(slides[slideIndex], 1, { y: 0 }, { y: '-100%' });
      }
      slideIndex--;
    }

    this.scenes.cubeSlider = new ScrollMagic.Scene({
      triggerElement: lightSectionTrigger,
      triggerHook: 'onLeave',
      duration: `${slideCount - 1}00%`
    })
      .setPin(lightSectionTrigger)
      .setTween(timeline);

    this.controller.addScene(this.scenes.cubeSlider);
  }

  /*
  * Forces all autoplay videos to start.
  */
 forceStartAutoplayVideos() {
    document.querySelectorAll('video').forEach(video => {
      if (video.autoplay) {
        video.play();
      }
    });
  }

  /*
  * Registers featured work <figure>s.
  */
  registerFigureVideos() {
    this.figureVideos = document.querySelectorAll('.featuredWorkFigure video');
    Array.prototype.forEach.call(this.figureVideos, video => {
      video.addEventListener('mouseenter', this.handleMouseenterFigureVideo);
      video.addEventListener('mouseleave', this.handleMouseleaveFigureVideo);
    });
  }

  /*
  * Handles mouse enter event on a <figure> <video>.
  * @param {Event} e - Mouseenter event object.
  */
  handleMouseenterFigureVideo(e) {
    findAncestor(e.target, '.featuredWorkFigure').querySelector('figcaption').classList.add('secondary');
  }

  /*
  * Handles mouse leave event on a <figure> <video>.
  * @param {Event} e - Mouseleave event object.
  */
  handleMouseleaveFigureVideo(e) {
    findAncestor(e.target, '.featuredWorkFigure').querySelector('figcaption').classList.remove('secondary');
  }
}

module.exports = new App();
