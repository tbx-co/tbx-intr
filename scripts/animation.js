import { createTag } from './helpers.js';

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

export function addStaggerAnimation(elements, duration) {
  elements.forEach((element, index) => {
    element.style.transitionDelay = `${duration * index}s`;
  });
}

// staggerDuration = last item delay
export function addAnimationClassWithStaggering(elements, animationClass, staggerDuration, triggerElement) {
  elements.forEach((element, index) => {
    element.classList.add(animationClass);

    // ease-like delay
    const delayFactor = ((index + 1) / elements.length) ** 2;
    const calculatedDelay = staggerDuration * delayFactor;
    element.style.transitionDelay = `${calculatedDelay}s`;

    // linear
    // element.style.transitionDelay = `${staggerDuration * index}s`;
  });

  addInviewObserverToAnimatedElement(triggerElement);
}

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

/**
 * Marquee Animation: make horizontal scroll animation
 * @param {array of elements} targetElements Array of HTMLElements selected
 * with .querySelectorAll()
 * @param {number} duration marquee time in milliseconds
 */
export function addMarqueeAnimationToElements(targetElements, duration) {
  const startTime = performance.now();
  const distance = 100; // Adjust as needed

  function animate() {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime) % duration;
    const progress = elapsedTime / duration;

    const x = -progress * distance;

    targetElements.forEach((element) => {
      element.style.transform = `translateX(${x}%)`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// accessibility handling based on this article:
// https://css-irl.info/how-to-accessibly-split-text/
export function addTextSplitAnimationToElement(el, duplicateText = true, hoverWrapper = null) {
  el.setAttribute('aria-label', el.textContent);
  el.classList.add('split-text-wrapper');
  // eslint-disable-next-line no-useless-escape
  const textRegex = /[-A-Za-z0-9!$#%^&*@()_+|~=`{}\[\]:";'<>?,.\/]/g;
  const elChildNodes = el.childNodes;

  elChildNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const wrapperDiv = createTag('span', {
        'aria-hidden': true,
        class: 'original',
      });
      wrapperDiv.innerHTML = child.textContent.replace(textRegex, '<span class="splitted-wrapper"><span class="splitted-letter">$&</span></span>');
      el.replaceChild(wrapperDiv, child);

      if (duplicateText) {
        const clonedNode = wrapperDiv.cloneNode(true);
        clonedNode.classList.add('cloned');
        el.appendChild(clonedNode);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      child.innerHTML = child.innerText.replace(textRegex, '<span class="splitted-wrapper"><span class="splitted-letter">$&</span></span>');
      child.setAttribute('aria-hidden', 'true');
    }
  });

  // add index for potential stagger animation
  [...el.querySelectorAll('.splitted-letter')].forEach((letter, i) => {
    letter.style = `--index: ${i};`;
  });

  if (hoverWrapper) {
    hoverWrapper.classList.add('split-text-hover-wrapper');
  }
}

export function addTextSplitAnimationToAllLinks(wrapper) {
  const linkElements = wrapper.querySelectorAll('a');
  linkElements.forEach((linkElement) => {
    addTextSplitAnimationToElement(linkElement);
  });
}

/**
 * Reveal Section Animation: parallax bottom reveal animation
 * @param {targetSection} HTMLElement of section to be revealed
 * @param {triggerSection} HTMLElement of the top overlay section as trigger
 * @param {number} transYpercent: percentage of section translated vertically
 * @param {number} endAnimationPercent: when trggerElement reaches X%
 * (endAnimationPercent) of viewport, the reveal animation ends
 */
export function addRevealAnimationToSection(targetSection, triggerSection, transYpercent = -50, endAnimationPercent = 75) {
  if (!targetSection || !triggerSection) return;

  const targetSectionZIndex = targetSection.style.zIndex;
  const triggerSectionZIndex = targetSectionZIndex === '' ? '2' : `${Number(targetSectionZIndex) + 1}`;
  triggerSection.style.zIndex = triggerSectionZIndex;

  // init start position
  targetSection.style.transform = `translateY(${transYpercent}%)`;

  window.addEventListener('scroll', () => {
    // scrolled distance measured from top position of viewport
    const scrollPosition = window.scrollY;
    // triggerSection bottom - window's height = start point of window top
    const triggerStartPoint = triggerSection.offsetTop + triggerSection.clientHeight - window.innerHeight;

    if (scrollPosition >= triggerStartPoint) {
      const scrollDistanceInTarget = scrollPosition - triggerStartPoint;
      const targetScrollDistance = window.innerHeight * (endAnimationPercent / 100);
      const progress = scrollDistanceInTarget / targetScrollDistance;
      const progressPercent = 1 - progress;

      // if in progress, update element position
      if (progressPercent >= 0) {
        const scrubbedTransY = transYpercent * progressPercent;
        targetSection.style.transform = `translateY(${scrubbedTransY}%)`;
      } else {
        // restore to 0 if scroll progress is finished
        targetSection.style.transform = 'translateY(0%)';
      }
    }
  });
}

// TODO: explore parallax animation
// export function addParallaxAnimationToElement(wrapperElement, animatedElements, translateYpercent = 0) {
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         // 1 above viewpoint, -1: inview or below viewpoint
//         if (entry.isIntersecting) {
//         // const isElementAboveViewpoint = entry.boundingClientRect.y < 0 ? 1 : -1;
//         const translateY = (translateYpercent * (1 - entry.intersectionRatio)) * (isElementAboveViewpoint) * -1;
//         animatedElements.forEach((element) => {
//           element.style.transform = `translateX(${translateX}%) translateY(${translateY}%)`;
//         });
//       } else {
//           animatedElements.forEach((element) => {
//               element.style.transform = 'translateX(0) translateY(0)';
//         });
//       }
//     });
//   }, observerOptions);

//   observer.observe(wrapperElement, observerOptions);
//   // console.log(observer);
// }
