/* eslint-disable */

function rgbToHex(red, green, blue) {
  const rgb = blue | (green << 8) | (red << 16);
  return `#${(0x1000000 + rgb).toString(16).slice(1)}`;
}

function isPercentage(n) {
  return typeof n === 'string' && n.indexOf('%') != -1;
}

function isOnePointZero(n) {
  return typeof n === 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = '100%';
  }

  const processPercent = isPercentage(n);
  n = Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(n * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return (n % max) / parseFloat(max);
}

function hslToRgb(h, s, l) {
  let r, g, b;

  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function isWindow(obj) {
  return obj !== null && obj === obj.window;
}

function getWindow(elem) {
  return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

function offset(elem) {
  let docElem,
    win,
    box = {
      top: 0,
      left: 0,
    },
    doc = elem && elem.ownerDocument;

  docElem = doc.documentElement;

  if (typeof elem.getBoundingClientRect !== typeof undefined) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow(doc);
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft,
  };
}

function segmentNumber(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

const color = [0, 100, 50];

const elements = {
  hue_bar: document.querySelector('.hue_bar'),
  sat_rect: document.querySelector('.sat_rect'),
  note: document.querySelector('.bg'),
  inputHidden: document.querySelector('.hid'),
  preview: document.querySelector('.color_preview'),
  sat_picker: document.querySelector('.sat_picker'),
  hue_picker: document.querySelector('.hue_picker'),
};

const sat_width = elements.sat_rect.offsetWidth;
const sat_height = elements.sat_rect.offsetHeight;
const hue_height = elements.hue_bar.offsetHeight;

function returnPickedColor() {
  elements.hue_picker.style.background = `hsl( ${color[0]},100%, 50% )`;
  // elements.note.style.background = "hsl( " + color[0] + "," + color[1] + "%," + color[2] + "% )";
  elements.sat_picker.style.background = `hsl( ${color[0]},${color[1]}%,${color[2]}% )`;
  elements.preview.style.background = `hsl( ${color[0]},${color[1]}%,${color[2]}% )`;

  const rgb_color = hslToRgb(color[0], color[1], color[2]);
  const hex_color = rgbToHex(rgb_color[0], rgb_color[1], rgb_color[2]);

  elements.inputHidden.value = hex_color;
}

function setHuePickerValue(e) {
  const hue_bar_position = {
    top: offset(elements.sat_rect).top,
  };

  color[0] = segmentNumber(Math.floor((e.pageY - hue_bar_position.top) / hue_height * 360), 0, 360);

  elements.hue_picker.style.top = `${segmentNumber(
    (e.pageY - hue_bar_position.top) / hue_height * 100,
    0,
    hue_height / 2
  )}%`;

  elements.sat_rect.style.background = `hsl(${color[0]}, 100%, 50%)`;

  returnPickedColor();
}

let hue_drag_started = false,
  sat_drag_started = false;

// LINE DRAG START
elements.hue_bar.addEventListener('mousedown', e => {
  hue_drag_started = true;
  elements.hue_picker.classList.add('active');

  setHuePickerValue(e);
});

// ---------------------------------//

function setSatPickerValue(e) {
  const rect_position = {
    left: offset(elements.sat_rect).left,
    top: offset(elements.sat_rect).top,
  };

  const position = [
    segmentNumber(e.pageX - rect_position.left, 0, sat_width),
    segmentNumber(e.pageY - rect_position.top, 0, sat_height),
  ];

  elements.sat_picker.style.left = `${position[0]}px`;
  elements.sat_picker.style.top = `${position[1]}px`;

  color[1] = Math.floor(position[0] / sat_width * 100);

  let x = e.pageX - offset(elements.sat_rect).left;
  let y = e.pageY - offset(elements.sat_rect).top;
  // constrain x max
  if (x > sat_width) {
    x = sat_width;
  }
  if (x < 0) {
    x = 0;
  }
  if (y > sat_height) {
    y = sat_height;
  }
  if (y < 0) {
    y = 0;
  }

  // convert between hsv and hsl
  let xRatio = x / sat_width * 100,
    yRatio = y / sat_height * 100,
    hsvValue = 1 - yRatio / 100,
    hsvSaturation = xRatio / 100,
    lightness = hsvValue / 2 * (2 - hsvSaturation);

  color[2] = Math.floor(lightness * 100);

  returnPickedColor();
}

// COLOR DRAG START
elements.sat_rect.addEventListener('mousedown', e => {
  sat_drag_started = true;

  elements.sat_picker.classList.add('active');
  setSatPickerValue(e);
});

document.addEventListener('mousemove', e => {
  // COLOR DRAG MOVE
  if (sat_drag_started) {
    setSatPickerValue(e);
  }

  // LINE DRAG MOVE
  if (hue_drag_started) {
    setHuePickerValue(e);
  }
});

// MOUSE UP
document.addEventListener('mouseup', () => {
  if (sat_drag_started) {
    elements.sat_picker.classList.remove('active');
    sat_drag_started = false;
  }

  if (hue_drag_started) {
    elements.hue_picker.classList.remove('active');
    hue_drag_started = false;
  }
});
