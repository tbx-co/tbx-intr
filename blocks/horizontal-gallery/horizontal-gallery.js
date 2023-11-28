import { createTag, replaceAllChildElements, getPatternIndex } from '../../scripts/helpers.js';

const imagePattern = ['align-top', 'align-bottom', 'align-center'];

// TODO: see if we can parallax or tie to scroll
// const lerp = (start, end, t) => start * (1 - t) + end * t;
// const setTransform = (el, transform) => {
//   el.style.transform = transform;
// };

function initMouseGrabOnScrollingElement(scrollTarget) {
  let isDown = false;
  let scrollX;
  let scrollLeft; // distance of element that has scrolled left

  // track mouse down state + add grab cursor on grab
  scrollTarget.addEventListener('mouseup', () => {
    isDown = false;
    scrollTarget.classList.remove('active');
  });

  scrollTarget.addEventListener('mouseleave', () => {
    isDown = false;
    scrollTarget.classList.remove('active');
  });

  scrollTarget.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDown = true;
    scrollTarget.classList.add('active');
    scrollX = e.clientX - scrollTarget.getBoundingClientRect().left;
    scrollLeft = scrollTarget.scrollLeft;
  });

  // Mouse Move Function
  scrollTarget.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const element = e.pageX - scrollTarget.getBoundingClientRect().left;
    const movingSpeed = 2.7;
    // Distance moved by the mouse since the initial click * speed
    const scrolling = (element - scrollX) * movingSpeed;
    scrollTarget.scrollLeft = scrollLeft - scrolling;

    // TODO: smooth scrolling
    // scrollTarget.scrollLeft = lerp(scrollLeft, scrollLeft - scrolling, 1);
  });
}

export default function decorate(block) {
  const innerWrapper = createTag('div', {
    class: 'horizontal-gallery-inner-wrapper js-scroll',
  });

  [...block.children].forEach((row, index) => {
    [...row.children].forEach((col) => {
      const galleryItem = createTag('div', {
        class: 'horizontal-gallery-item ',
      });

      if (block.classList.contains('diff-alignment')) {
        const patternIndex = getPatternIndex(imagePattern, index);
        galleryItem.classList.add(`${imagePattern[patternIndex]}`);
      }

      col.classList.add('horizontal-gallery-item-inner-wrapper');
      galleryItem.append(col);
      innerWrapper.append(galleryItem);
    });
  });

  replaceAllChildElements(block, innerWrapper);
  initMouseGrabOnScrollingElement(block);
}
