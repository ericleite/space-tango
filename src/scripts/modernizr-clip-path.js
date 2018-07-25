(function(Modernizr) {
  const tests = [
    // False positive in IE, supports SVG clip-path, but not on HTML element
    { name: 'svg', value: 'url(#test)' },
    { name: 'inset', value: 'inset(10px 20px 30px 40px)' },
    // { name: 'circle', value: 'circle(60px at center)' },
    // { name: 'ellipse', value: 'ellipse(50% 50% at 50% 50%)' },
    { name: 'polygon', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' }
  ];

  for (let i = 0; i < tests.length; i++) {
    const name = tests[i].name;
    const value = tests[i].value;
    Modernizr.addTest(
      'cssclippath' + name,
      function() {
        // Try using window.CSS.supports
        if ('CSS' in window && 'supports' in window.CSS) {
          for (let j = 0; j < Modernizr._prefixes.length; j++) {
            const prop = Modernizr._prefixes[j] + 'clip-path'

            if (window.CSS.supports(prop, value)) {
              return true;
            }
          }
          return false;
        }
        // Otherwise, use Modernizr.testStyles and examine the property manually
        return Modernizr.testStyles(
          '#modernizr { ' + Modernizr._prefixes.join('clip-path:' + value + '; ') + ' }',
          function(elem, rule) {
            var style = getComputedStyle(elem),
              clip = style.clipPath;

            if (!clip || clip == "none") {
              clip = false;

              for (var i = 0; i < Modernizr._domPrefixes.length; i++) {
                const test = Modernizr._domPrefixes[i] + 'ClipPath';
                if (style[test] && style[test] !== "none") {
                  clip = true;
                  break;
                }
              }
            }

            return Modernizr.testProp('clipPath') && clip;
          }
        );
      }
    );
  }
})(Modernizr);
