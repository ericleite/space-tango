'use strict';

// Libs
import CSSPlugin from 'gsap/CSSPlugin';
import EasePack from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

// Utils
import { checkForElement, findAncestor } from 'utils';
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
// Classes
const activeClass = 'active';
const lightSectionSpacerClass = 'lightSectionSpacer';
// Trigger constants
const heroTrigger = '#hero';
const featuredWorkHeaderTrigger = '#featuredWorkHeader';
const lightSectionTrigger = '#lightSection';
// Selectors
const cubeSliderSelector = '#cubeSlider';
const cubeSliderSlideContentSelector = '.Cube-slider-slide-content';
const cubeSliderTrackSelector = `${cubeSliderSelector} .Cube-slider-track`;
const lightSectionSpacerSelector = `.${lightSectionSpacerClass}`;

/*
* App class is the base controller for the app.
*/
class App {
  constructor() {
    // Properties
    this.controller = new ScrollMagic.Controller();
    this.scenes = {};
    this.figureVideos = [];

    // Event handlers
    this.handleMouseenterVideo = this.handleMouseenterFigureVideo.bind(this);
    this.handleMouseleaveVideo = this.handleMouseleaveFigureVideo.bind(this);
    this.handleEnterCubeSliderScene = this.handleEnterCubeSliderScene.bind(this);
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
        .setClassToggle('#heroHeadline', activeClass),
      // Globe fade-in
      new ScrollMagic.Scene({
        triggerElement: heroTrigger,
        reverse: false,
        triggerHook: 1
      })
        .setClassToggle('#heroImage', activeClass)
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
        .setClassToggle('#featuredWorkHeaderCaption', activeClass),
      // ISS image fade/swoop-in
      new ScrollMagic.Scene({
        triggerElement: featuredWorkHeaderTrigger,
        reverse: false,
        triggerHook: 0.8
      })
        .setClassToggle('#featuredWorkHeaderFigure', activeClass)
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
    const slides = document.querySelectorAll('#cubeSlider .Cube-slider-slide');
    const slideCount = slides.length;
    const sliderSceneOptions = {
      triggerElement: lightSectionTrigger,
      triggerHook: 'onLeave',
      duration: `${slideCount - 1}00%`
    };
    const timeline = new TimelineLite();

    // Add slides to the timeline.
    let slideIndex = 0;
    while (slideIndex < slideCount - 1) {
      const toVars = {
        top: `-${(slideIndex + 1) * 100}%`
      };
      timeline.to(cubeSliderTrackSelector, 1, toVars);
      slideIndex++;
    }

    // Setup slider container scene.
    this.scenes.cubeSlider = new ScrollMagic.Scene(sliderSceneOptions)
      .setPin(lightSectionTrigger, { spacerClass: lightSectionSpacerClass })
      .setTween(timeline)
      .on('enter', this.handleEnterCubeSliderScene)
      .on('leave', e => { this.unpinSlides(slides); });
    this.controller.addScene(this.scenes.cubeSlider);
  }

  /*
  * Forces all autoplay videos to start.
  */
  forceStartAutoplayVideos() {
    const videos = document.querySelectorAll('video');
    Array.prototype.forEach.call(videos, video => {
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

  // Event handlers

  handleEnterCubeSliderScene(e) {
    if (this.scenes.cubeSlider.state() === 'DURING') {
      checkForElement(lightSectionSpacerSelector, this.pinSlides);
    } else {
      this.pinSlides();
    }
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

  // Helpers

  /*
  * Pins slides in place.
  * @param {NodeList} slides - List of slide nodes
  */
  pinSlides(slides) {
    if (!slides) {
      slides = document.querySelectorAll('#cubeSlider .Cube-slider-slide');
    }
    if (slides.length > 0) {
      let slider = document.querySelector(cubeSliderSelector);
      const sliderDimentions = slider.getBoundingClientRect();
      Array.prototype.forEach.call(slides, slide => {
        const slideContent = slide.querySelector(cubeSliderSlideContentSelector);
        slideContent.classList.add(activeClass);
        slideContent.style.top = `${sliderDimentions.top}px`;
        slideContent.style.left = `${sliderDimentions.left}px`;
        slideContent.style.width = `${sliderDimentions.width}px`;
        slideContent.style.height = `${sliderDimentions.height}px`;
      });
    }
  }

  /*
  * Unpins slides.
  * @param {NodeList} slides - List of slide nodes
  */
  unpinSlides(slides) {
    if (slides.length > 0) {
      Array.prototype.forEach.call(slides, slide => {
        const slideContent = slide.querySelector(cubeSliderSlideContentSelector);
        slideContent.classList.remove(activeClass);
        slideContent.style.top = '';
        slideContent.style.left = '';
        slideContent.style.width = '';
        slideContent.style.height = '';
      });
    }
  }
}

module.exports = new App();
