function checkForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (!document.contains(element)) {
    window.requestAnimationFrame(checkForElement);
  } else {
    setTimeout(callback, 0);
  }
}

function findAncestor(el, sel) {
  if (typeof el.closest === 'function') {
    return el.closest(sel) || null;
  }
  while (el) {
    if (el.matches(sel)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

module.exports = {
  checkForElement,
  findAncestor
};
