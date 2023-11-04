import { addInviewObserverToAnimatedElement, addRevealWrapperToAnimationTarget, addStaggerAnimation } from '../../scripts/animation.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      const titles = div.querySelectorAll('h1,h2,h3,h4,h5,h6');

      if (titles.length >= 2) {
        div.classList.add('split-title');
        titles[0].classList.add('top-left', 'heading-l', 'animate-target');
        titles[1].classList.add('bottom-right', 'heading-l', 'animate-target');

        titles.forEach((title) => {
          addRevealWrapperToAnimationTarget(title);
        });

        const description = div.querySelector('p');
        if (description) description.classList.add('caligraphy-text');
      } else {
        row.classList.add('description', 'description-m');
        div.classList.add('description-text', 'right');
      }
    });
  });

  addInviewObserverToAnimatedElement(block);

  // add stagger timing
  const targets = block.querySelectorAll('.slide-reveal-inner');
  const staggerTime = 0.2;
  addStaggerAnimation(targets, staggerTime);
}
