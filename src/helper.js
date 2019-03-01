export function setCSSes(el, csses) {
  Object.keys(csses).forEach((k) => {
    el.style[k] = csses[k];
  });
  return el;
}
