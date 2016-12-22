/**
 * Created by lijun on 2016/11/16.
 */

import crossvent from 'crossvent';

const global = window;
const touch = {
  mouseup: 'touchend',
  mousedown: 'touchstart',
  mousemove: 'touchmove',
};
const pointers = {
  mouseup: 'pointerup',
  mousedown: 'pointerdown',
  mousemove: 'pointermove',
};

export const getTouchyEvent = () => {
  let event;
  if (global.navigator.pointerEnabled) {
    /* eslint-disable */
    if (document.createEvent) {
      event = document.createEvent("PointerEvent");
      event.initMouseEvent("pointerdown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    } else {
      event = new PointerEvent('pointerdown',
        {
          cancelable: true,
          bubbles: true,
          view: window,
        });
    }
  }
  if (document.createEvent) {
    event = document.createEvent("MouseEvent");
    event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  } else {
    event = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
  }
  return event;
};

export const touchy = (el, op, type, fn) => {
  if (global.navigator.pointerEnabled) {
    crossvent[op](el, pointers[type], fn);
  } else {
    crossvent[op](el, touch[type], fn);
    crossvent[op](el, type, fn);
  }
};


export const getLongestRow = (table) => {
  let result = table.rows[0];
  Array.from(table.rows).forEach((row) => {
    const rowL = row.children.length;
    const resultL = result.children.length;
    result = rowL > resultL ? row : result;
  });
  return result;
};

export const css = (el, csses) => {
  Object.keys(csses).forEach((k) => {
    /* eslint-disable */
    el.style[k] = csses[k];
  });
  return el;
};

export const empty = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
// TODO 兼容性
export const on = (el, eventName, cb) => {
  el.addEventListener(eventName, cb);
};

export const remove = (el, eventName, cb) => {
  el.removeEventListener(eventName, cb);
};

export const appendSibling = ({ target, origin, parent }) => {
  if (!target) {
    return;
  }
  // if row length is different
  (parent || target.parentNode).insertBefore(target, origin ? origin.nextElementSibling : null);
};

export const insertBeforeSibling = ({ target, origin }) => {
  if (!target) {
    return;
  }
  origin.parentNode.insertBefore(target, origin);
};

export const sort = ({ list, from, to, parent }) => {
  if (from < to) {
    appendSibling({ target: list[from], origin: list[to], parent });
  } else {
    insertBeforeSibling({ target: list[from], origin: list[to] });
  }
};

export const getScrollBarWidth = () => {
  /* eslint-disable */
  if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
    return 0
  }
  let inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  let outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  let w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth
  if (w1 === w2) w2 = outer.clientWidth

  document.body.removeChild(outer)

  return (w1 - w2)
}

// export const handleTr = (table, cb) => {
//   let trIndex = 0;
//   Array.from(table.children).forEach(organ =>
//     Array.from(organ.children).forEach(
//       (tr) => {
//         cb.call(this, { tr, organ, trIndex });
//         trIndex += 1;
//       }));
// };

// if node.Name==='TR',call cb;else,call fail
// export const handleTr = (table, cb, fail) => {
//   let trIndex = 0;
//   Array.from(table.children).forEach(organ =>
//     Array.from(organ.children).forEach(
//       (likeTr) => {
//         if (likeTr && likeTr.nodeName === 'TR') {
//           cb.call(this, { tr: likeTr, organ, trIndex });
//           trIndex += 1;
//         } else if (fail) {
//           fail.call(this, { likeTr });
//         }
//       }));
// };

// export const timeout = (time) => {
//   let resizeTimeout;
//   return new Promise((resolve) => {
//     if (!resizeTimeout) {
//       resizeTimeout = setTimeout(() => {
//         resizeTimeout = null;
//         resolve();
//       }, time);
//     }
//   });
// };


// export const dispatchEvent =
//   ({ table, evt, eventName }) => {
//     const options = table.options;
//     const originEl = table.el;
//
//     if (options[eventName]) {
//       options[eventName].call(originEl, Object.assign({}, evt, { table: originEl }));
//     }
//   };

// export const before = (fn, beforeFunc) => (...args) => {
//   beforeFunc.apply(this, args);
//   return fn && fn.apply(this, args);
// };


// export const getNodeByPath = (node, paths) => {
//   let current = node;
//   paths.forEach(path => {
//     current = current.children[path];
//   })
//   return current;
// };
