/*
* Checks if an element exists in the DOM.
* @param {String} selector - Selector used to find the desired element.
* @param {Function} callback - Function to run once the element exists.
*/
function checkForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (!document.contains(element)) {
    window.requestAnimationFrame(checkForElement);
  } else {
    setTimeout(callback, 0);
  }
}

/*
* Finds the next closest sibling element.
* @param {Element} el - Element to start searching from.
* @param {String} selector - Selector of the element to find.
* @returns {Element|Null} - Ancestor element.
*/
function findAncestor(el, selector) {
  if (typeof el.closest === 'function') {
    return el.closest(selector) || null;
  }
  while (el) {
    if (el.matches(selector)) {
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
