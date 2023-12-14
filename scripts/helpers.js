/**
 * Create an element with ID, class, children, and attributes
 * @param {String} tag the tag nav of the element
 * @param {Object} attributes the attributes of the tag
 * @param {HTMLElement} html the content of the element
 * @returns {HTMLElement} the element created
 */
export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }
  return el;
}

// replace ALL innerHTML of the parentElement with childNodes {HTMLElement} provided
export function replaceAllChildElements(parentElement, ...childNodes) {
  if (parentElement && childNodes) {
    parentElement.innerHTML = '';
    childNodes.forEach((child) => {
      parentElement.append(child);
    });
  }
}

/**
 * Replace element type. ex) <p> -> <div>
 * @param {Element} el The original element that subject to replace.
 * @param {string} type The nodeName to be set for el.
 * @returns newEl Updated Element
 */
export const replaceElementType = (el, type) => {
  // If they are same, no need to replace.
  if (el === null || el.nodeName === type.toUpperCase()) {
    return el;
  }
  const newEl = document.createElement(type);
  newEl.innerHTML = el.innerHTML;
  el.parentNode.replaceChild(newEl, el);
  // copy all attributes from el to newEl
  [...el.attributes].forEach((attr) => newEl.setAttribute(attr.nodeName, attr.nodeValue));
  return newEl;
};

/**
 * * @param {string} url the href of a link element
 * result: return `_self` or `_blank` if the link has the same host
 */
export function returnLinkTarget(url) {
  const currentHost = window.location.host;
  const urlObject = new URL(url);
  const isSameHost = urlObject.host === currentHost;

  // take in pathname that should be opened in new tab, in redirects excel
  const redirectExternalPaths = [];
  const redirectToExternalPath = redirectExternalPaths.includes(
    urlObject.pathname,
  );

  if (!isSameHost || redirectToExternalPath) {
    return '_blank';
  }
  return '_self';
}

export function setProjectThemeColorToVariable(targetElement, cssVariable) {
  const projectTheme = document.querySelector('meta[name="project-theme-color"]');
  if (projectTheme) {
    const projectThemeColor = projectTheme.getAttribute('content');
    targetElement.style.setProperty(cssVariable, projectThemeColor);
  }
}

// patternArray, currentIndex
/**
 * * @param {string} patternArray array of pattern
 * * @param {number} currentIndex
 * * result: return index of pattern
 */
export const getPatternIndex = (patternArray, currentIndex) => (currentIndex % patternArray.length);

// in-view related animations

// run callback function once when targetElement is in viewport
export function observeElementWithCallback(targetElement, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        callback(entry.target);
      }
    });
  });
  observer.observe(targetElement);
}
