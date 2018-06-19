$(function() {

  var wrappers               = [],
      $window                = $(window),
      $body                  = $('body'),
      currentWrapper         = null,
      scrollTimeoutID        = 0,
      bodyHeight             = 0,
      windowHeight           = 0,
      windowWidth            = 0,
      prevKeyframesDurations = 0,
      scrollTop              = 0,
      relativeScrollTop      = 0,
      currentKeyframe        = 0,
      keyframes              = [
        {
          'wrapper': '#one',
          'duration': '100%',
          'animations': [
            {
              'selector': '.intro',
              'translateY': -110,
              'opacity': [1, 0],
              'scale': [1, 4]
            }, {
              'selector': '.subhead',
              'translateY': 300,
              'opacity': [1, 0]
            }
          ]
        }, {
          'wrapper': '#two',
          'duration': '200%',
          'animations': [
            {
              'selector': '.blurb',
              'translateY': -25, 
              'opacity': [0, 1]
            }, {
              'selector': '.picture',
              'translateY': -25
            }, {
              'selector': '.rj',
              'translateY': -360,
              'rotate': [0, 0],
              'opacity': [0, 1]
            }, {
              'selector': '.ufo',
              'translateX': 1800,
            }
          ]
        }, {
          'wrapper': '#two',
          'duration': '100%',
          'animations': []
        }, {
          'wrapper': '#two',
          'duration': '200%',
          'animations': [
            {
              'selector': '.picture',
              'translateY': [-25, -1000]
            }, {
              'selector': '.rj',
              'translateX': 400,
              'translateY': [-360, -60],
              'rotate': [0, -90]
            }
          ]
        }, {
          'wrapper': '#three',
          'duration': '150%',
          'animations': [
            {
              'selector': '.third-blurb',
              'translateX': 50, 
              'opacity': [0, 1]
            }, {
              'selector': '.shape-hold',
              'translateY': -150,
              'opacity': [0, 1]
            }
          ]
        }, {
          'wrapper': '#three',
          'duration': '100%',
          'animations': []
        }, {
          'wrapper': '#three',
          'duration': '100%',
          'animations': [
            {
              'selector': '.one',
              'translateY': 11,
              'translateX': 11
            }, {
              'selector': '.two',
              'translateY': 11,
            }, {
              'selector': '.three',
              'translateY': 11,
              'translateX': -11
            }, {
              'selector': '.four',
              'translateX': 11
            }, {
              'selector': '.six',
              'translateX': -11
            }, {
              'selector': '.seven',
              'translateY': -11,
              'translateX': 11
            }, {
              'selector': '.eight',
              'translateY': -11
            }, {
              'selector': '.nine',
              'translateY': -11,
              'translateX': -11
            }
          ]
        }, {
          'wrapper': '#three',
          'duration': '100%',
          'animations': [
            {
              'selector': '.shape-hold',
              'translateY' : [-150, -150],
              'rotate': 45
            }
          ]
        }, {
          'wrapper': '#three',
          'duration': '50%',
          'animations': []
        }, {
          'wrapper': '#three',
          'duration': '100%',
          'animations': [
            {
              'selector': '.one',
              'translateY': [11, -110],
              'translateX': [11, -58],
              'opacity': [1, 0]
            }, {
              'selector': '.two',
              'translateY': [11, -60],
              'opacity': [1, 0]
            }, {
              'selector': '.three',
              'translateY': [11, -42],
              'translateX': [-11, 50],
              'opacity': [1, 0]
            }, {
              'selector': '.four',
              'translateX': [11, -240],
              'opacity': [1, 0]
            }, {
              'selector': '.six',
              'translateX': [-11, 300],
              'opacity': [1, 0]
            }, {
              'selector': '.seven',
              'translateY': [-11, 92],
              'translateX': [11, -220],
              'opacity': [1, 0]
            }, {
              'selector': '.eight',
              'translateY': [-11, 180],
              'opacity': [1, 0]
            }, {
              'selector': '.nine',
              'translateY': [-11, 240],
              'translateX': [-11, 169],
              'opacity': [1, 0]
            }
          ]
        }, {
          'wrapper': '#three',
          'duration': '100%',
          'animations': []
        }, {
          'wrapper': '#final',
          'duration': '100%',
          'animations': [
            {
              'selector': '.outro',
              'translateY': -25, 
              'opacity': [0, 1]
            }
          ]
        }, {
          'duration': '100%',
          'animations': []
        }
      ];


  function init() {
    setInterval(updatePage, 10);
    setValues();
  }

  function setValues() {
    scrollTop = $window.scrollTop();
    windowHeight = $window.height();
    windowWidth = $window.width();
    convertPropsToPx();
    buildPage();
  }

  function buildPage() {
    var i, j;
    for(i = 0; i < keyframes.length; i++) { 
      bodyHeight += keyframes[i].duration;
      if($.inArray(keyframes[i].wrapper, wrappers) == -1) {
        wrappers.push(keyframes[i].wrapper);
      }

      for (j = 0; j < keyframes[i].animations.length; j++) {
        Object.keys(keyframes[i].animations[j]).forEach(function(key) {
          value = keyframes[i].animations[j][key];
          if (key !== 'selector' && value instanceof Array === false) {
            var valueSet = [];
            valueSet.push(getDefaultPropertyValue(key), value);
            value = valueSet;
          }
          keyframes[i].animations[j][key] = value;
        });
      }
    }

    $body.height(bodyHeight);
    currentWrapper = wrappers[0];
    $(currentWrapper).show();
  }

  function convertPropsToPx() {
    var i;
    for (i = 0; i < keyframes.length; i++) {
      keyframes[i].duration = convertPercentToPx(keyframes[i].duration, 'y');
    }
  }

  function updatePage() {
    window.requestAnimationFrame(function() {
      setScrollTops();
      if (scrollTop > 0 && scrollTop <= (bodyHeight - windowHeight)) {
        animateElements();
        setKeyframe();
      } 
    });
  }

  function animateElements() {
    var animation, translateY, translateX, scale, rotate, opacity;
    for (var i = 0; i < keyframes[currentKeyframe].animations.length; i++) {
      animation  = keyframes[currentKeyframe].animations[i];
      translateY = calcPropValue(animation, 'translateY');
      translateX = calcPropValue(animation, 'translateX');
      scale      = calcPropValue(animation, 'scale');
      rotate     = calcPropValue(animation, 'rotate');
      opacity    = calcPropValue(animation, 'opacity');

      $(animation.selector).css({
        'transform': 'translate3d(' + translateX +'px, ' + translateY + 'px, 0) scale('+ scale +') rotate('+ rotate +'deg)', 'opacity' : opacity
      });
    }
  }

  function calcPropValue(animation, property) {
    var value = animation[property];
    if (value) {
      value = easeInOutQuad(relativeScrollTop, value[0], (value[1]-value[0]), keyframes[currentKeyframe].duration);
    } else {
      value = getDefaultPropertyValue(property);
    }
    value = +value.toFixed(2);
    return value;
  }

  function easeInOutQuad(t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  };

  function getDefaultPropertyValue(property) {
    switch (property) {
      case 'translateX':
        return 0;
      case 'translateY':
        return 0;
      case 'scale':
        return 1;
      case 'rotate':
        return 0;
      case 'opacity':
        return 1;
      default:
        return null;
    }
  }

  function setScrollTops() {
    scrollTop = $window.scrollTop();
    relativeScrollTop = scrollTop - prevKeyframesDurations;
  }

  function convertPercentToPx(value, axis) {
    var num = value.split('%');
    if (axis === 'y') { value = (num[0] / 100) * windowHeight };
    if (axis === 'x') { value = (num[0] / 100) * windowWidth };
    return value;
  }

  function setKeyframe() {
    if (scrollTop > (keyframes[currentKeyframe].duration + prevKeyframesDurations)) {
      prevKeyframesDurations += keyframes[currentKeyframe].duration;
      currentKeyframe++;
      showCurrentWrappers();
    } else if (scrollTop < prevKeyframesDurations) {
      currentKeyframe--;
      prevKeyframesDurations -= keyframes[currentKeyframe].duration;
      showCurrentWrappers();
    }
  }

  function showCurrentWrappers() {
    if (keyframes[currentKeyframe].wrapper != currentWrapper) {
      $(currentWrapper).fadeOut(200, function() {
        $(keyframes[currentKeyframe].wrapper).fadeIn(200);
      }); 
      currentWrapper = keyframes[currentKeyframe].wrapper;
    }
  }

  init();

});