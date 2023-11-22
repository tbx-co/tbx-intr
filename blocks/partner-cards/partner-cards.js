import { createGlideCarousel } from '../../libs/carousel.js';

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

  // TODO: explore carousel options
  const slides = block.querySelectorAll('.partner-card-wrapper');
  if (slides.length > 1) {
    createGlideCarousel(block);
  }
}
