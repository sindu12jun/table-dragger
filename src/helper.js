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

export function emptyContent(ele) {
  ele.innerHTML = ''
  return ele
}




