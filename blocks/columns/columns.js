import { createTag, replaceAllChildElements } from "../../scripts/helpers.js";

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const gridContainer = createTag("div", { class: "columns-grid-container" });

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const bigTitle = col.querySelector("h1, h2, h3, h4");
      if (bigTitle) bigTitle.classList.add("heading-m", "big-heading");
      const title = col.querySelector("h5, h6");
      if (title) title.classList.add("heading-s", "heading");

      const description = col.querySelector("p");
      if (description)
        description.classList.add("description-m", "description");

      const pic = col.querySelector("picture");
      if (pic) {
        const picWrapper = pic.closest("div");
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add("with-image");
        }
      }

      gridContainer.append(col);
    });
  });

  replaceAllChildElements(block, gridContainer);
}
