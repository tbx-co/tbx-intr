export default function decorate(block) {
  const titleLines = block.querySelectorAll("h1, h2, h3, h4, h5, h6");
  titleLines.forEach((title, index) => {
    title.classList.add("free-style-title-text", "heading-ml");
    if (index === titleLines.length - 1) {
      title.classList.add("last-line");
    }

    // style dot with <em> for different styles
    const highlightDotClassList = [
      "highlight-dot",
      "highlight-dot-light",
      "highlight-dot-blue",
    ];
    const hasHighlightDotClass = highlightDotClassList.some((className) =>
      block.classList.contains(className)
    );
    if (hasHighlightDotClass) {
      let titleInnerHTML = title.innerHTML;
      let newHighlightedHTML = titleInnerHTML.replaceAll(".", "<em>.</em>");
      title.innerHTML = newHighlightedHTML;
    }
  });

  const lineStyleClasses = Array.from(block.classList).filter((className) =>
    className.startsWith("line-")
  );

  if (lineStyleClasses.length > 0) {
    lineStyleClasses.forEach((className) => {
      const parts = className.split("-");
      const index = Number(parts[1]) - 1;
      titleLines[index].classList.add(parts[2]);
    });
  }
}
