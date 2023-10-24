import { createTag } from "../../scripts/helpers.js";

export default function decorate(block) {
  const picture = block.querySelector("picture");
  const headings = block.querySelectorAll("h1, h2, h3");
  const subtitle = block.querySelector("p");

  block.innerHTML = "";

  const backgroundWrapper = createTag("div", {class: "background-wrapper"}, "");
  if (picture) backgroundWrapper.append(picture);

  const content = createTag("div", { class: "copy-wrapper"}, "");
  if (headings.length > 0) {
    headings.forEach((heading) => {
      heading.classList.add("project-hero-heading", "heading-sl");
      content.append(heading);
    });
  }
  if (subtitle) {
    subtitle.classList.add('project-hero-subtitle')
    content.append(subtitle);
  }

  const backdrop = createTag("div", { class: "project-hero-backdrop"}, "");

  block.append(backgroundWrapper, backdrop, content);
}
