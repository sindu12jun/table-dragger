import * as R from "ramda";

export function setCSSes(el, csses) {
  Object.keys(csses).forEach((k) => {
    el.style[k] = csses[k];
  });
  return el;
}

export function addClass(ele, className) {
  ele.classList.add(className)
  return ele
}

export function removeClass(ele, className) {
  ele.classList.remove(className)
  return ele
}

export function removeAttrs(ele, attrs) {
  R.forEach(ele.removeAttribute.bind(ele))(attrs)
  return ele
}

export function isLeftButton(e) {
  if ('touches' in e) {
    return e.touches.length === 1;
  }
  if ('buttons' in e) {
    return e.buttons === 1;
  }
  if ('button' in e) {
    return e.button === 0;
  }
  return false;
}

export function checkIsTable(ele) {
  return ele
    &&
    typeof ele === 'object'
    &&
    'nodeType' in ele
    &&
    ele.nodeType === 1
    &&
    ele.cloneNode
    &&
    ele.nodeName === 'TABLE';
}

export function appendDOMChild(parentNode, childNode) {
  parentNode.appendChild(childNode);
  return parentNode;
}

export function removeDom(node) {
  return node.parentNode.removeChild(node)
}

export function prop(obj, name) {
  return obj[name]
}

export function setStyle(node, prop, value) {
  node.style[prop] = value
  return node
}

export function getCellByIndexInRow(index, row) {
  return row.children[index]
}

export function createArrByNumber(num) {
  return [...Array(num).keys()]
}


export function addPx(str) {
  return str + 'px'
}

// insert target before origin
export function insertBeforeSibling(toEle, fromEle) {
  if (!fromEle) {
    return;
  }
  toEle.parentNode.insertBefore(fromEle, toEle);
  return fromEle
}

// insert target after origin
export function appendSibling(toEle, fromEle) {
  if (!fromEle) {
    return;
  }
  // if row length is different
  toEle.parentNode.insertBefore(fromEle, toEle ? toEle.nextElementSibling : null);
};

export function getMouseDownEvent() {
  let event;
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



