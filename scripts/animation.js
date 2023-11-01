import { addAnimationToSplitTitleSection } from '../blocks/split-title-section/split-title-section.js';
import { addFooterRevealAnimation, animateFooterDecoText } from '../blocks/footer/footer.js';

// call all animations at once after block has loaded in
export function initAnimationInBlocks() {
    addAnimationToSplitTitleSection();
    animateFooterDecoText();
    // addFooterRevealAnimation();
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


export function addParallaxAnimationToElement(translateX = 0, translateY = 0) {
    const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // 1 above viewpoint, -1: inview or below viewpoint
            const isElementAboveViewpoint = entry.boundingClientRect.y < 0 ? 1 : -1;
            const translateX = (translateXpercent * (1 - entry.intersectionRatio)) * (isElementAboveViewpoint)
            const translateY = (translateYpercent * (1 - entry.intersectionRatio)) * (isElementAboveViewpoint)
            target.style.transform = `translateX(${translateX}%) translateY(${translateY}%)`;
        } else {
            target.style.transform = `translateX(0) translateY(0)`;
        }
    });
  }, observerOptions);
  observer.observe(triggerElement);
}

