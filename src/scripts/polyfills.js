// Node.contains()
(function() {
	function contains(node) {
		if (!(0 in arguments)) {
			throw new TypeError('1 argument is required');
		}
		do {
			if (this === node) {
				return true;
			}
		} while (node = node && node.parentNode);
		return false;
	}

	// IE
	if ('HTMLElement' in window && 'contains' in HTMLElement.prototype) {
		try {
			delete HTMLElement.prototype.contains;
		} catch (e) {}
	}

	if ('Node' in window) {
		Node.prototype.contains = contains;
	} else {
		document.contains = Element.prototype.contains = contains;
	}
}());

// Element.matches()
Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {

	var element = this;
	var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
	var index = 0;

	while (elements[index] && elements[index] !== element) {
		++index;
	}

	return !!elements[index];
};
