import { map, reduce } from 'lodash';

/*
* convenience functions
*/

function randomBetween(x, y) {
  return Math.floor(Math.random() * y) + x;
}

function randomX() {
  return randomBetween(0, window.innerWidth) + 'px';
}
function randomY() {
  return randomBetween(0, window.innerHeight) + 'px';
}
function randomAngle() {
  return randomBetween(-60, 60) + 'deg';
}

function randomContainerPlacement(el) {
  var flip = randomBetween(0, 2) > 0 ? '-' : '';
  el.style.transform =
    'translate(' + randomX() + ',' + randomY() + ') ' +
    'rotate(' + randomAngle() + ') ' +
    'scaleX(' + flip + '1)';
}

function appendCSS(selector, styles, overlay) {
  let stylestr = reduce(styles, (total, row) => {
    return total + `${row[0]}: ${row[1]};`;
  }, '');
  let rule = `.${selector} { ${stylestr} }`;
  console.log(rule);

  var css = document.createElement('style');
  css.type = 'text/css';

  css.appendChild(document.createTextNode(rule));
  overlay.appendChild(css);
}

function animationCSS(duration, overlay) {
  appendCSS('🤔', [
    ['animation', `🤔 ${duration}ms linear forwards`],
    ['display', 'inline-block'],
    ['will-change', 'transform'],
    ['pointer-events', 'none'],
  ], overlay);

  appendCSS('🤔::after', [
    ['animation', `🤔🤔 ${duration}ms linear forwards`],
    ['height', '6.5em'],
    ['width', '6.5em'],
    ['position', 'absolute'],
    ['left', '-1.5em'],
    ['top', '-0.75em'],
    ['opacity', '0.5'],
    ['z-index', '-1'],
  ], overlay);
}

var genCSS = (function() {
  var used = [];
  return function (emoji, overlay) {
    if (used.indexOf(emoji) > -1)
      return;
    used.push(emoji)

    var css = document.createElement('style');
    css.type = 'text/css';

    var rule = '.🤔-' + emoji + '::before, .🤔-' + emoji + '::after { content: "' + emoji + '"};'

    css.appendChild(document.createTextNode(rule));
    var elements = overlay.appendChild(css);
  }
})();

function getOverlay() {
  var elHmmOverlay = document.createElement('div');
  elHmmOverlay.className = '🤔-overlay';
  return document.body.appendChild(elHmmOverlay);
}


function hmm(emoji, elHmmOverlay, duration) {
  genCSS(emoji, elHmmOverlay);

  var elHmmContainer = document.createElement('div');
  elHmmContainer.className = '🤔-container';
  var elHmm = document.createElement('div');
  elHmm.className = '🤔 🤔-' + emoji;
  elHmmContainer.appendChild(elHmm);
  elHmmOverlay.appendChild(elHmmContainer);

  randomContainerPlacement(elHmmContainer);

  setTimeout(function() {
    elHmmOverlay.removeChild(elHmmContainer);
  }, duration + (duration * 0.1));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomIter(length) {
  let nums = [...Array(length).keys()];
  return () => {
    if (nums.length === 0)
      nums = [...Array(length).keys()];

    const index = getRandomInt(nums.length);
    const val = nums[index];

    nums.splice(index, 1);
    return val;
  }
}

function linearIter(length) {
  let nums = [...Array(length).keys()];
  return () => {
    if (nums.length === 0)
      nums = [...Array(length).keys()];
    const val = nums[0];
    nums.splice(0, 1);
    return val;
  }
}

const emojiList = ['🤔', '😁','🤣','😒','💕','🤦','🤞','🎶','😜','🌹','🤳','😊',
                 '❤', '👌','👍','🤷','😉','👏','🎉','🐱','‍👤','😂','😍','😘',
                 '🙌','✌','😎','💖','💋','🎂','🐱','💻'];

function genCb(interval, overlay) {
  return (smooth=false) => {
    clearInterval(interval);
    if (!smooth) {
      document.body.removeChild(overlay);
    }
  }
}

/*
* exposed functions
*/

// From https://stackoverflow.com/questions/18862256/how-to-detect-emoji-using-javascript
// A convenience function that is likely useful in any real application of this library
export function isEmoji(str) {
    var ranges = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
    ];
    if (str.match(ranges.join('|'))) {
        return true;
    } else {
        return false;
    }
}

const defaultConfig = {
  emojis: emojiList,
  random: true,
  interval: 1500,
  duration: 5000
}

function startEmoji(_config=defaultConfig) {
  const config = { ...defaultConfig, ..._config };
  console.log(config);

  const overlay = getOverlay();
  // Config handling
  const emojis = config.emojis;
  let iter = config.random ? randomIter(emojis.length) :  linearIter(emojis.length);
  animationCSS(config.duration, overlay);

  hmm(emojis[iter()], overlay, config.duration);
  let i = setInterval(() => {
    // hmm(emojiList[iter()], elHmmOverlay);
    hmm(emojis[iter()], overlay, config.duration);
  }, config.interval);

  return genCb(i, overlay);
}

export default startEmoji;
