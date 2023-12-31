import { createTag } from '../../scripts/helpers.js';
import { loadGlideLib } from '../scripts/scripts.js';

export function createArrowNavGlideCarousel() {
  const arrowHTML = `
    <button class="glide__arrow glide__arrow--left" data-glide-dir="<"> < </button>
    <button class="glide__arrow glide__arrow--right" data-glide-dir=">"> > </button>
  `;
  const glideSlideWrapper = createTag('div', {
    class: 'glide__arrows',
    'data-glide-el': 'controls',
  }, arrowHTML);
  return glideSlideWrapper;
}

export function createBulletNavGlideCarousel(slides) {
  const glideBulletWrapper = createTag('div', {
    class: 'glide__bullets',
    'data-glide-el': 'controls[nav]',
  }, '');
  slides.forEach((_, index) => {
    const glideBulletHTML = createTag('button', {
      class: "glide__bullet",
      'data-glide-dir': `=${index}`,
      'aria-label': `glide-slider-bullet-button-${index + 1}`
    });
    glideBulletWrapper.append(glideBulletHTML);
  });
  return glideBulletWrapper;
}

export function createGlideCarousel(block) {
  loadGlideLib();

  // if carousel has already been created, dont create again
  if (block.querySelector('.glide')) {
    return;
  }

  const slides = [...block.children];

  const glideWrapper = createTag('div', { class: 'glide' }, '');
  const glideTrack = createTag('div', {
    class: 'glide__track',
    'data-glide-el': 'track',
  });
  const glideSlideWrapper = createTag('ul', { class: 'glide__slides' }, '');
  slides.forEach((slide) => {
    let slideWrapper = createTag('li', {
      class: 'glide__slide'
    }, slide)
    glideSlideWrapper.append(slideWrapper);
  });
  glideTrack.append(glideSlideWrapper);
  glideWrapper.append(glideTrack);
  
  // const arrowNav = createArrowNavGlideCarousel();
  // glideWrapper.append(arrowNav);

  const bulletNav = createBulletNavGlideCarousel(slides);
  glideWrapper.append(bulletNav);
  
  block.append(glideWrapper);
}