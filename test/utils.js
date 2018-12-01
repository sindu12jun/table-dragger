export const createDrag = (drag, handler, { gapX = 0, gapY = 0 }) => {
  raise(handler, 'mousedown', { button: 0, clientX: 0, clientY: 0 })
  const { x, y } = drag.tappedCoord
  raise(handler, 'mousemove', { button: 0, clientX: x + gapX, clientY: y + gapY })
  raise(handler, 'mouseup', { button: 0,})
}

export const raise = (el, type, options) => {
  var o = options || {};
  var e = document.createEvent('Event');
  e.initEvent(type, true, true);
  Object.keys(o).forEach(apply);
  el.dispatchEvent(e);

  function apply (key) {
    e[key] = o[key];
  }
}

