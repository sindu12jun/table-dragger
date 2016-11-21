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

export const handleTr = (table, cb) =>
  Array.from(table.children).forEach(organ =>
    Array.from(organ.children)
      .forEach(tr => cb.call(this, tr))
  );

// export const getNodeByPath = (node, paths) => {
//   let current = node;
//   paths.forEach(path => {
//     current = current.children[path];
//   })
//   return current;
// };
