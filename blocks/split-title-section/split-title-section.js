// testing
import { createTag } from '../../scripts/helpers.js';
// import { addInviewObserverToAnimatedElement } from '../../scripts/animation.js';

export function addRevealWrapperToAnimationTarget(element) {
  const revealWrapper = createTag(
    'span',
    { class: 'slide-reveal-inner' },
    element.innerHTML,
  );
  element.classList.add('slide-reveal-wrapper');
  element.innerHTML = '';
  element.append(revealWrapper);
}

export function addAnimationToSplitTitleSection() {
  const target = document.querySelectorAll('.animate-target');
  if (target.length <= 0) return;

  // eslint-disable-next-line no-undef
  gsap.to(target, {
    scrollTrigger: {
      // markers: true,
      trigger: '.split-title-section',
      start: 'top center',
      end: 'bottom center',
      toggleClass: 'in-view',
      once: true,
    },
  });
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      const titles = div.querySelectorAll('h1,h2,h3,h4,h5,h6');

      if (titles.length >= 2) {
        div.classList.add('split-title');
        titles[0].classList.add('top-left', 'heading-l', 'animate-target');
        titles[1].classList.add('bottom-right', 'heading-l', 'animate-target');

        addRevealWrapperToAnimationTarget(titles[0]);
        addRevealWrapperToAnimationTarget(titles[1]);

        const description = div.querySelector('p');
        if (description) description.classList.add('caligraphy-text');
      } else {
        row.classList.add('description', 'description-m');
        div.classList.add('description-text', 'right');
      }
    });
  });

  // addInviewObserverToTriggerElement(block);
  // addAnimationToSplitTitleSection();
}
