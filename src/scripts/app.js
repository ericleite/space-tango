'use strict';

// Libs
import CSSPlugin from 'gsap/CSSPlugin';
import EasePack from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

// Utils
import { findAncestor } from 'utils';
import { colors } from 'constants';

// Local constants
// Styles
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

// Tweens
const tweenBodyFromDarkToLight = TweenLite.fromTo(document.body, 1, darkBodyStyle, lightBodyStyle);

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
    this.addFigures();
  }

  /*
  * Creates scroll-based animations for each section.
  */
  buildScenes() {
    const heroTrigger = '#hero';
    const featuredWorkHeaderTrigger = '#featuredWorkHeader';
    const cubeSectionTrigger = '#cubeSection';

    // Hero section
    this.scenes.hero = [
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false,
        triggerHook: 1
      }).setClassToggle('#heroHeadline', 'active'),
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false,
        triggerHook: 1
      }).setClassToggle('#heroImage', 'active')
    ];
    this.controller.addScene(this.scenes.hero);

    // Featured Work header section
    this.scenes.featuredWorkHeader = [
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false,
        triggerHook: 0.8
      }).setClassToggle('#featuredWorkHeaderCaption', 'active'),
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false,
        triggerHook: 0.8
      }).setClassToggle('#featuredWorkHeaderFigure', 'active')
    ];
    this.controller.addScene(this.scenes.featuredWorkHeader);

    // Cube section
    this.scenes.cubeSection = [
      new ScrollMagic.Scene({
        triggerElement: cubeSectionTrigger,
        triggerHook: 0.75,
        duration: '50%'
      }).setTween(tweenBodyFromDarkToLight)
    ];
    this.controller.addScene(this.scenes.cubeSection);
  }

  /*
  * Registers featured work <figure>s.
  */
  addFigures() {
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
