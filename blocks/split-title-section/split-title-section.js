// testing
import { createTag } from "../../scripts/helpers.js";

export function addInviewObserverToTriggerElement(triggerElement) {
  const observerOptions = {
    threshold: 0.25, // show when is 25% in view
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  observer.observe(triggerElement);
}

export function addRevealWrapperToAnimationTarget(element) {
  // console.log("split-title loaded");
  const revealWrapper = createTag(
    "span",
    { class: "slide-reveal-inner" },
    element.innerHTML
  );
  element.classList.add("slide-reveal-wrapper");
  element.innerHTML = "";
  element.append(revealWrapper);
}

export function addAnimationWithGsap(block) {
  const target = block.querySelectorAll(".animate-target");
  console.log(window.gsap);

  gsap.to(target, {
    scrollTrigger: {
      markers: true,
      trigger: block,
      start: "top center",
      end: "bottom center",
      toggleClass: "in-view",
    },
  });
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      const titles = div.querySelectorAll("h1,h2,h3,h4,h5,h6");

      if (titles.length >= 2) {
        div.classList.add("split-title");
        titles[0].classList.add("top-left", "heading-l", "animate-target");
        titles[1].classList.add("bottom-right", "heading-l", "animate-target");

        addRevealWrapperToAnimationTarget(titles[0]);
        addRevealWrapperToAnimationTarget(titles[1]);

        const description = div.querySelector("p");
        if (description) description.classList.add("caligraphy-text");
      } else {
        row.classList.add("description", "description-m");
        div.classList.add("description-text", "right");
      }
    });
  });

  // addAnimationWithGsap(block);
  addInviewObserverToTriggerElement(block);
}
