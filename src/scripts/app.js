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
    this.buildScenes();
    this.forceStartAutoplayVideos();
    this.registerFigureVideos();
  }

  /*
  * Creates scroll-based animations for each section.
  */
  buildScenes() {
    // Trigger constants
    const heroTrigger = '#hero';
    const featuredWorkHeaderTrigger = '#featuredWorkHeader';
    const lightSectionTrigger = '#lightSection';

    // Tween constants
    const tweenBodyFromDarkToLight = TweenLite.fromTo(document.body, 1, darkBodyStyle, lightBodyStyle);
    const cubeSliderTimeline = new TimelineLite();
    cubeSliderTimeline.fromTo('#slide1', 1, { y: 0 }, { y: '-100%' });
    cubeSliderTimeline.fromTo('#slide2', 1, { y: 0 }, { y: '-100%' });

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

    // Cube section
    this.scenes.lightSection = [
      // Background color transition
      new ScrollMagic.Scene({
        triggerElement: lightSectionTrigger,
        triggerHook: 'onEnter',
        duration: 320
      })
        .setTween(tweenBodyFromDarkToLight),
      // Vertical cube slider
      new ScrollMagic.Scene({
        triggerElement: lightSectionTrigger,
        triggerHook: 'onLeave',
        duration: '200%'
      })
        .setPin(lightSectionTrigger)
        .setTween(cubeSliderTimeline)
    ];
    this.controller.addScene(this.scenes.lightSection);
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
