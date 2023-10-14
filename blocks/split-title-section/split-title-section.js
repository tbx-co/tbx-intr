export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      const titles = div.querySelectorAll("h1,h2,h3,h4,h5,h6");

      if (titles.length >= 2) {
        div.classList.add("split-title");
        titles[0].classList.add("top-left", "heading-l");
        titles[1].classList.add("bottom-right", "heading-l");

        const description = div.querySelector("p");
        if (description) description.classList.add("caligraphy-text");
      } else {
        row.classList.add("description", "description-m");
        div.classList.add("description-text", "right");
      }
    });
  });
}
