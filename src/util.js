/**
 * Created by lijun on 2016/11/16.
 */
export const empty = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
// TODO 兼容性
export const on = (el, eventName, cb) => {
  el.addEventListener(eventName, cb);
}

export const appendSibling = ({ target, origin }) => {
  origin.parentNode.insertBefore(target, origin.nextSibling);
};

export const insertBeforeSibling = ({ target, origin }) => {
  origin.parentNode.insertBefore(target, origin);
};

export const sort = ({ list, from, to }) => {
  if (from < to) {
    appendSibling({ target: list[from], origin: list[to] });
  } else {
    insertBeforeSibling({ target: list[from], origin: list[to] });
  }
}

//TODO 把sortable改成draggable
export const classes = {
  originTable: 'sindu_origin_table',
  draggableTable: 'sindu_sortable_table',
  dragging: 'sindu_dragging',
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
export const handleTr = (table, cb, fail) => {
  let trIndex = 0;
  Array.from(table.children).forEach(organ =>
    Array.from(organ.children).forEach(
      (likeTr) => {
        if (likeTr && likeTr.nodeName === 'TR') {
          cb.call(this, { tr: likeTr, organ, trIndex });
          trIndex += 1;
        } else if (fail) {
          fail.call(this, { likeTr });
        }
      }));
};

export const timeout = (time) => {
  let resizeTimeout;
  return new Promise((resolve) => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        resolve();
      }, time);
    }
  });
};


// export const dispatchEvent =
//   ({ table, evt, eventName }) => {
//     const options = table.options;
//     const originEl = table.el;
//
//     if (options[eventName]) {
//       options[eventName].call(originEl, Object.assign({}, evt, { table: originEl }));
//     }
//   };

export const before = (fn, beforeFunc) => (...args) => {
  beforeFunc.apply(this, args);
  return fn && fn.apply(this, args);
};


// export const getNodeByPath = (node, paths) => {
//   let current = node;
//   paths.forEach(path => {
//     current = current.children[path];
//   })
//   return current;
// };
