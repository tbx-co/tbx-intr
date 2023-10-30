import { addAnimationToSplitTitleSection } from '../blocks/split-title-section/split-title-section.js';
import { addFooterRevealAnimation, animateFooterDecoText } from '../blocks/footer/footer.js';

// call all animations at once after block has loaded in
export function initAnimationInBlocks() {
    addAnimationToSplitTitleSection();
    animateFooterDecoText();
    addFooterRevealAnimation();
}

// add animation using intersectionObserver
// .inview .animatedClass to animate element
export function addInviewObserverToAnimatedElement(triggerElement, animateOnce = true) {
  const observerOptions = {
    threshold: 0.25, // show when is 25% in view
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (animateOnce) { observer.unobserve(entry.target); }
      }
    });
  }, observerOptions);
  observer.observe(triggerElement);
}
