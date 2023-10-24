const addCustomBgColor = (block) => {
  const bgColorClass = Array.from(block.classList).find((className) =>
    className.startsWith("bg-color-")
  );
  if (bgColorClass) {
    const bgColor = bgColorClass.replace(/^bg-color-/, "");
    block.style = `--bg-color: #${bgColor}`;
  }
};

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add("project-summary-row");

    [...row.children].forEach((div, index) => {
      div.className = `project-summary-col col-${index + 1}`;

      const heading = div.querySelector("h1,h2,h3,h4,h5,h6");
      heading.classList.add("project-summary-heading");
    });
  });

  addCustomBgColor(block);
}
