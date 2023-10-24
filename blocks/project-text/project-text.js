export default function decorate(block) {
  [...block.children].forEach((row) => {
    const projectTitle = row.querySelectorAll("h1,h2,h3,h4,h5,h6");
    if (projectTitle && projectTitle.length > 0) {
      row.classList.add("project-title-wrapper");
      projectTitle.forEach((title) =>
        title.classList.add("heading-ml", "heading")
      );
      return;
    }

    row.classList.add("project-description-wrapper");
    [...row.children].forEach((div) => {
      div.classList.add("text-wrapper", "description-m");
      if (div.innerHTML.trim() == "") {
        div.classList.add("empty");
      }
    });
  });
}
