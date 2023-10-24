import {
  createTag,
  returnLinkTarget,
  replaceAllChildElements,
} from "../../scripts/helpers.js";

export default function decorate(block) {
  const nextProjectLink = block.querySelector("a");
  const projectImage = block.querySelector("img");
  const nextProjectLinkWrapper = createTag("a", {
    href: nextProjectLink.href,
    target: returnLinkTarget(nextProjectLink.href),
    title: nextProjectLink.title,
    class: "next-project-link-wrapper",
  });

  const projectLinkTextWrapper = createTag(
    "div",
    { class: "project-link-text-wrapper" },
    `<p class="heading-s"> Next Project </p> <p class="heading-m project-name">${nextProjectLink.innerText} </p>`
  );
  nextProjectLinkWrapper.append(projectLinkTextWrapper);

  const projectImageWrapper = createTag(
    "div",
    {
      class: "project-image-wrapper",
    },
    projectImage
  );
  nextProjectLinkWrapper.append(projectImageWrapper);

  replaceAllChildElements(block, nextProjectLinkWrapper);
}
