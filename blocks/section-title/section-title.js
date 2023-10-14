import { createTag } from "../../scripts/helpers.js";

export default function decorate(block) {
  const titleElements = block.querySelectorAll("h1, h2, h3, h4, h5, h6");
  titleElements.forEach((el) => {
    // TODO: add condition
    el.classList.add("heading-xl");
  });
  console.log(block);
}
