import { createGlideCarousel } from '../../libs/carousel.js';
import { addTextSplitArrowLink } from '../../scripts/animation.js';
import { observeElementWithCallback } from '../../scripts/helpers.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('partner-card-wrapper');

    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        col.classList.add('partner-card-image-wrapper');
      } else {
        col.classList.add('partner-card-content-wrapper', 'description-m');
      }
    });
  });

  // decorate link elements
  const linkElements = block.querySelectorAll('a');
  linkElements.forEach((linkElement) => {
    addTextSplitArrowLink(linkElement);
  });

  // used glide.js for carousel
  const slides = block.querySelectorAll('.partner-card-wrapper');
  if (slides.length > 1) {
    observeElementWithCallback(block, () => {
      createGlideCarousel(block);
    });
  }
}
