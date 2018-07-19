!function(){"use strict";var e="undefined"==typeof global?self:global;if("function"!=typeof e.require){var r={},t={},n={},i={}.hasOwnProperty,o=/^\.\.?(\/|$)/,s=function(e,r){for(var t,n=[],i=(o.test(r)?e+"/"+r:r).split("/"),s=0,u=i.length;s<u;s++)t=i[s],".."===t?n.pop():"."!==t&&""!==t&&n.push(t);return n.join("/")},u=function(e){return e.split("/").slice(0,-1).join("/")},a=function(r){return function(t){var n=s(u(r),t);return e.require(n,r)}},l=function(e,r){var n=v&&v.createHot(e),i={id:e,exports:{},hot:n};return t[e]=i,r(i.exports,a(e),i),i.exports},c=function(e){return n[e]?c(n[e]):e},f=function(e,r){return c(s(u(e),r))},d=function(e,n){null==n&&(n="/");var o=c(e);if(i.call(t,o))return t[o].exports;if(i.call(r,o))return l(o,r[o]);throw new Error("Cannot find module '"+e+"' from '"+n+"'")};d.alias=function(e,r){n[r]=e};var h=/\.[^.\/]+$/,g=/\/index(\.[^\/]+)?$/,p=function(e){if(h.test(e)){var r=e.replace(h,"");i.call(n,r)&&n[r].replace(h,"")!==r+"/index"||(n[r]=e)}if(g.test(e)){var t=e.replace(g,"");i.call(n,t)||(n[t]=e)}};d.register=d.define=function(e,n){if(e&&"object"==typeof e)for(var o in e)i.call(e,o)&&d.register(o,e[o]);else r[e]=n,delete t[e],p(e)},d.list=function(){var e=[];for(var t in r)i.call(r,t)&&e.push(t);return e};var v=e._hmr&&new e._hmr(f,d,r,t);d._cache=t,d.hmr=v&&v.wrap,d.brunch=!0,e.require=d}}(),function(){"undefined"==typeof window?this:window;require.register("app.js",function(e,r,t){"use strict";function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),o=r("scrollmagic"),s=r("utils"),u=s.findAncestor,a=function(){function e(){n(this,e),this.controller=new o.Controller,this.scenes={},this.figureVideos=[],this.handleMouseenterVideo=this.handleMouseenterFigureVideo.bind(this),this.handleMouseleaveVideo=this.handleMouseleaveFigureVideo.bind(this)}return i(e,[{key:"init",value:function(){this.buildScenes(),this.addFigures()}},{key:"buildScenes",value:function(){var e="#hero";this.scenes.hero=[new o.Scene({triggerElement:e,reverse:!1,triggerHook:1}).setClassToggle("#heroHeadline","active"),new o.Scene({triggerElement:e,reverse:!1,triggerHook:1}).setClassToggle("#heroImage","active")],this.controller.addScene(this.scenes.hero);var r="#featuredWorkHeader";this.scenes.featuredWorkHeader=[new o.Scene({triggerElement:r,reverse:!1,triggerHook:.8}).setClassToggle("#featuredWorkHeaderCaption","active"),new o.Scene({triggerElement:r,reverse:!1,triggerHook:.8}).setClassToggle("#featuredWorkHeaderFigure","active")],this.controller.addScene(this.scenes.featuredWorkHeader)}},{key:"addFigures",value:function(){var e=this;this.figureVideos=document.querySelectorAll(".featuredWorkFigure video"),Array.prototype.forEach.call(this.figureVideos,function(r){r.addEventListener("mouseenter",e.handleMouseenterFigureVideo),r.addEventListener("mouseleave",e.handleMouseleaveFigureVideo)})}},{key:"handleMouseenterFigureVideo",value:function(e){u(e.target,".featuredWorkFigure").querySelector("figcaption").classList.add("secondary")}},{key:"handleMouseleaveFigureVideo",value:function(e){u(e.target,".featuredWorkFigure").querySelector("figcaption").classList.remove("secondary")}}]),e}();t.exports=new a}),require.register("main.js",function(e,r,t){"use strict";var n=r("app");n.init()}),require.register("polyfills.js",function(e,r,t){"use strict";Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(e){for(var r=(this.document||this.ownerDocument).querySelectorAll(e),t=r.length;--t>=0&&r.item(t)!==this;);return t>-1})}),require.register("utils.js",function(e,r,t){"use strict";function n(e,r){if("function"==typeof e.closest)return e.closest(r)||null;for(;e;){if(e.matches(r))return e;e=e.parentElement}return null}t.exports={findAncestor:n}}),require.register("___globals___",function(e,r,t){})}(),require("___globals___"),require("main");