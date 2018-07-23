'use strict';

// Libs
import CSSPlugin from 'gsap/CSSPlugin';
import EasePack from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import debounce from 'lodash/debounce';

// Utils
import { checkForElement, findAncestor } from 'utils';
import { BREAKPOINTS, COLORS } from 'constants';

// Local constants
// Styles
const DARK_BODY_STYLE = {
  backgroundColor: COLORS.SPACE_GREY,
  color: COLORS.WHITE
};
const LIGHT_BODY_STYLE = {
  backgroundColor: COLORS.GREY,
  color: COLORS.SPACE_GREY
};
// Classes
const ACTIVE_CLASS = 'active';
const LIGHT_SECTION_SPACER_CLASS = 'lightSectionSpacer';
// Trigger constants
const HERO_TRIGGER = '#hero';
const FEATURED_WORK_HEADER_TRIGGER = '#featuredWorkHeader';
const LIGHT_SECTION_TRIGGER = '#lightSection';
// Selectors
const CUBE_SLIDER_SELECTOR = '#cubeSlider';
const CUBE_SLIDER_TRACK_SELECTOR = `${CUBE_SLIDER_SELECTOR} .Cube-slider-track`;
const CUBE_SLIDER_SLIDE_SELECTOR = `${CUBE_SLIDER_SELECTOR} .Cube-slider-slide`;
const CUBE_SLIDER_SLIDE_CONTENT_SELECTOR = '.Cube-slider-slide-content';
const LIGHT_SECTION_SPACER_SELECTOR = `.${LIGHT_SECTION_SPACER_CLASS}`;

/*
* Homepage class is the base controller for the homepage.
*/
class Homepage {
  constructor() {
    // Properties
    this.controller = new ScrollMagic.Controller();
    this.scenes = {};
    this.figureVideos = [];

    // Event handlers
    this.debouncedHandleResize = debounce(this.handleResize.bind(this), 150);
    this.handleEnterCubeSliderScene = this.handleEnterCubeSliderScene.bind(this);
    this.handleMouseenterVideo = this.handleMouseenterFigureVideo.bind(this);
    this.handleMouseleaveVideo = this.handleMouseleaveFigureVideo.bind(this);
  }

  // Methods
  // -------

  /*
  * Used to initialize the application. Only call this once the DOM is ready.
  */
  init() {
    this.buildStaticScenes();
    this.registerFigureVideos();
    this.handleResize();
    window.addEventListener('resize', this.debouncedHandleResize);
  }

  /*
  * Creates scroll-based animations for static section.
  */
  buildStaticScenes() {
    // Hero section
    this.scenes.hero = [
      // Caption fade/rise-in
      new ScrollMagic.Scene({
        triggerElement: HERO_TRIGGER,
        reverse: false,
        triggerHook: 1
      })
        .setClassToggle('#heroHeadline', ACTIVE_CLASS),
      // Globe fade-in
      new ScrollMagic.Scene({
        triggerElement: HERO_TRIGGER,
        reverse: false,
        triggerHook: 1
      })
        .setClassToggle('#heroImage', ACTIVE_CLASS)
    ];
    this.controller.addScene(this.scenes.hero);

    // Featured Work header section
    this.scenes.featuredWorkHeader = [
      // "Featured Work" intro fade/rise-in
      new ScrollMagic.Scene({
        triggerElement: FEATURED_WORK_HEADER_TRIGGER,
        reverse: false,
        triggerHook: 0.8
      })
        .setClassToggle('#featuredWorkHeaderCaption', ACTIVE_CLASS),
      // ISS image fade/swoop-in
      new ScrollMagic.Scene({
        triggerElement: FEATURED_WORK_HEADER_TRIGGER,
        reverse: false,
        triggerHook: 0.8
      })
        .setClassToggle('#featuredWorkHeaderFigure', ACTIVE_CLASS)
    ];
    this.controller.addScene(this.scenes.featuredWorkHeader);

    // Dark to light transition
    this.scenes.darkToLight = new ScrollMagic.Scene({
      triggerElement: LIGHT_SECTION_TRIGGER,
      triggerHook: 'onEnter',
      duration: 320
    }).setTween(TweenLite.fromTo(document.body, 1, DARK_BODY_STYLE, LIGHT_BODY_STYLE));
    this.controller.addScene(this.scenes.darkToLight);
  }

  /*
  * Creates the scene for the cube slider.
  */
  buildCubeSliderScenes() {
    const slides = document.querySelectorAll(CUBE_SLIDER_SLIDE_SELECTOR);
    const slideCount = slides.length;
    const sliderSceneOptions = {
      triggerElement: LIGHT_SECTION_TRIGGER,
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
      timeline.to(CUBE_SLIDER_TRACK_SELECTOR, 1, toVars);
      slideIndex++;
    }

    // Create slider scene.
    this.scenes.cubeSlider = new ScrollMagic.Scene(sliderSceneOptions)
      .setPin(LIGHT_SECTION_TRIGGER, { spacerClass: LIGHT_SECTION_SPACER_CLASS })
      .setTween(timeline)
      .on('change', e => { console.log('changed') })
      .on('enter', this.handleEnterCubeSliderScene)
      .on('leave destroy', e => { this.unpinSlides(slides); });
    this.controller.addScene(this.scenes.cubeSlider);
  }

  rebuildCubeSliderScenes() {
    // Destroy it if it exists.
    if (this.scenes.cubeSlider) {
      this.scenes.cubeSlider = this.scenes.cubeSlider.destroy(true);
    }
    // Create it if we are in desktop mode and it does not already exist.
    if (this.shouldBuildCubeSlider()) {
      this.buildCubeSliderScenes();
    }
    // Make videos play.
    this.registerSliderVideos();
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
    this.forcePlay(this.figureVideos);
  }

  /*
  * Registers cube slider videos.
  */
  registerSliderVideos() {
    this.sliderVideos = document.querySelectorAll(`${CUBE_SLIDER_SLIDE_SELECTOR} video`);
    this.forcePlay(this.sliderVideos);
  }

  // Event handlers
  // --------------

  /*
  * Handles window resizing.
  * @param {Event} e - Window resize event.
  */
  handleResize(e) {
    this.rebuildCubeSliderScenes();
  }

  /*
  * Handles entering the cube slider scene.
  * @param {Event} e - ScrollMagic "enter" event object.
  */
  handleEnterCubeSliderScene(e) {
    if (!this.scenes.cubeSlider) {
      return;
    }
    if (this.scenes.cubeSlider.state() === 'DURING') {
      checkForElement(LIGHT_SECTION_SPACER_SELECTOR, this.pinSlides);
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
  // -------

  /*
  * Forces HTML5 videos to start playing.
  * @param {NodeList} videos - List of videos to play.
  */
  forcePlay(videos) {
    if (videos.length) {
      Array.prototype.forEach.call(videos, video => {
        if (video.autoplay) {
          video.play();
        }
      });
    }
  }

  /*
  * Determines if the cube slider should be built.
  * @returns {Boolean} - Flag indicating whether to build the slider.
  */
  shouldBuildCubeSlider() {
    if (window.innerWidth >= BREAKPOINTS.DESKTOP_S && !this.scenes.cubeSlider) {
      return true;
    }
    return false;
  }

  /*
  * Pins slides in place.
  * @param {NodeList} slides - List of slide nodes
  */
  pinSlides(slides) {
    if (!slides) {
      slides = document.querySelectorAll(CUBE_SLIDER_SLIDE_SELECTOR);
    }
    if (slides.length > 0) {
      let slider = document.querySelector(CUBE_SLIDER_SELECTOR);
      const sliderDimentions = slider.getBoundingClientRect();
      Array.prototype.forEach.call(slides, slide => {
        const slideContent = slide.querySelector(CUBE_SLIDER_SLIDE_CONTENT_SELECTOR);
        slideContent.classList.add(ACTIVE_CLASS);
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
    if (!slides) {
      slides = document.querySelectorAll(CUBE_SLIDER_SLIDE_SELECTOR);
    }
    if (slides.length > 0) {
      Array.prototype.forEach.call(slides, slide => {
        const slideContent = slide.querySelector(CUBE_SLIDER_SLIDE_CONTENT_SELECTOR);
        slideContent.classList.remove(ACTIVE_CLASS);
        slideContent.style.top = '';
        slideContent.style.left = '';
        slideContent.style.width = '';
        slideContent.style.height = '';
      });
    }
  }
}

module.exports = new Homepage();
