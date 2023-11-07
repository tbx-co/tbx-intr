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

// TODO: explore animation options based on final design
// function throttle(fn, wait) {
//   let time = Date.now();
//   return function () {
//     if ((time + wait - Date.now()) < 0) {
//       fn();
//       time = Date.now();
//     }
//   };
// }

// TODO: explore parallax animation
// export function addParallaxAnimationToElement(wrapperElement, animatedElements, translateYpercent = 0) {
//   const createThreshold = (step) => {
//     const threshold = [];
//     for (let i = 0; i <= step; i++) {
//       threshold.push(i / step);
//     }
//     return threshold;
//   };

//   const observerOptions = {
//     root: null,
//     rootMargin: '0px 0px',
//     threshold: createThreshold(500),
//   };

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {

//         // 1 above viewpoint, -1: inview or below viewpoint
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
//   console.log(observer);
// }

// TODO: bottom reveal animation
/**
 * Reveal Section Animation: parallax bottom reveal animation
 * @param {targetSection}  HTMLElement of HTMLElements selected
 * with .querySelectorAll()
 * @param {number} transYpercent: percentage of section translated vertically
 * @param {number} endAnimationPercent: when trggerElement reaches X%
 * (endAnimationPercent), the reveal animation ends
 */
// ? trigger element / the section above
// export function addRevealAnimationToSection(targetSection, triggerSection, transYpercent = -50, endAnimationPercent = 75) {

//     // console.log(targetSection)
//     // console.log(triggerSection)

//     // init start position
//     // targetSection.style.transform = `translateY(${transYpercent}%)`;

//     const uncoverAnimation = () => {
//         // Add a keyframe to the timeline (yPercent: 0)
//         const uncover = new AnimationSequence();
//         uncover.addKeyframe(new KeyframeEffect(targetSection, { transform: 'translateY(0)' }, { duration: 0, fill: 'both' }));

//         // not sure if that works
//         document.timeline.play(uncover);
//     }

//     window.addEventListener('scroll', () => {
//         const scrollPosition = window.scrollY;
//         const sectionBottom = triggerSection.offsetTop + targetSection.offsetHeight;
//         const triggerSectionBottom = triggerSection.offsetTop + triggerSection.offsetHeight;
//         const targetSectionBottom = targetSection.offsetTop + targetSection.offsetHeight;
//         const triggerPoint = sectionBottom - window.innerHeight * 0.75;

//         // console.log('sectionBottom', sectionBottom);
//         // console.log('triggerPoint', triggerPoint);

//         if (scrollPosition >= triggerPoint) {
//             const scrollDistanceInTarget = triggerSectionBottom - scrollPosition;
//             const percentage = scrollDistanceInTarget / targetSection.offsetHeight;
//             console.log('scrollDistanceInTarget', scrollDistanceInTarget);
//             console.log('percentage', percentage);
//             // uncoverAnimation();
//         }
//     });

//     // Create an Intersection Observer
//     // const observer = new IntersectionObserver(entries => {
//     //     let prevRatio = 0.0;

//     //     entries.forEach(entry => {
//     //         // if (entry.isIntersecting) {
//     //         if ( entry.intersectionRatio > prevRatio) {
//     //         // uncoverAnimation();
//     //         const isElementAboveViewpoint = entry.boundingClientRect.y < 0 ? 1 : -1;
//     //         // const translateY = (transYpercent * (1 - entry.intersectionRatio)) * (isElementAboveViewpoint);
//     //         const translateY = (1 - entry.intersectionRatio) * transYpercent;
//     //         console.log(entry.intersectionRatio);
//     //         console.log(translateY);
//     //         //     targetSection.style.transform = `translateY(${translateY}%)`;
//     //         // } else {
//     //         //     targetSection.style.transform = `translateY(0%)`;
//     //         }

//     //         prevRatio = entry.intersectionRatio;
//     //     });
//     // }, {
//     //     root: null, // Use the viewport as the root
//     //     threshold: 0,
//     //     // threshold: endAnimationPercent / 100, // Trigger when ?% of the element is visible
//     // });

//     // Observe the last section
//     // observer.observe(targetSection);
// }
