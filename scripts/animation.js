// import { addAnimationToSplitTitleSection } from '../blocks/split-title-section/split-title-section.js';
// import { addFooterRevealAnimation } from '../blocks/footer/footer.js';

// TODO: see if we can strip away GSAP completely
// call all animations at once after block has loaded in
export function initAnimationInBlocks() {
//   addAnimationToSplitTitleSection();
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

// TODO: explore parallax animation
// export function addParallaxAnimationToElement(triggerElements, translateXpercent = 0, translateYpercent = 0) {
//   const observerOptions = {
//     root: null,
//     threshold: 0,
//   };

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         // 1 above viewpoint, -1: inview or below viewpoint
//         const isElementAboveViewpoint = entry.boundingClientRect.y < 0 ? 1 : -1;
//         const translateX = (translateXpercent * (1 - entry.intersectionRatio)) * (isElementAboveViewpoint);
//         const translateY = (translateYpercent * (1 - entry.intersectionRatio)) * (isElementAboveViewpoint);
//         target.style.transform = `translateX(${translateX}%) translateY(${translateY}%)`;
//       } else {
//         target.style.transform = 'translateX(0) translateY(0)';
//       }
//     });
//   }, observerOptions);
//   observer.observe(triggerElements);
// }

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
