/**
 * Created by lijun on 2016/11/16.
 */
export const empty = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

export const appendSibling = ({ target, origin }) => {
  origin.parentNode.insertBefore(target, origin.nextSibling);
};

export const insertBeforeSibling = ({ target, origin }) => {
  origin.parentNode.insertBefore(target, origin);
};

export const handleTr = (table, cb) => {
  let trIndex = 0;
  Array.from(table.children).forEach(organ =>
    Array.from(organ.children).forEach(
      (tr) => {
        cb.call(this, { tr, organ, trIndex });
        trIndex += 1;
      }));
};

export const throttlerTimeoutFunc = (cb) => {
  let resizeTimeout;
  return () => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        cb();
      }, 66);
    }
  };
};

// export const getNodeByPath = (node, paths) => {
//   let current = node;
//   paths.forEach(path => {
//     current = current.children[path];
//   })
//   return current;
// };
