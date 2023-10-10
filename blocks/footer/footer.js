import { readBlockConfig, decorateIcons } from "../../scripts/aem.js";
import { createTag } from "../../scripts/helpers.js";

// decorate
function decorateFooterContent(footer) {
  const footerContent = footer.querySelector(".footer-content");
  if (!footerContent) return;

  const footerContentRows = footerContent.querySelectorAll(":scope > div");
  const topContent = footerContentRows[0].querySelector("div");
  topContent.classList.add("footer-top-content", "heading-l");
  // const topContentTextElements = topContent.querySelectorAll('p')
  // topContentTextElements.forEach((el) => {

  // })

  const bottomContent = footerContentRows[1];
  bottomContent.classList.add("footer-bottom-content");

  footerContent.innerHTML = "";
  footerContent.appendChild(topContent);
  footerContent.appendChild(bottomContent);

  return footerContent;
}

function decorateFooterDecoText(footer) {
  const footerDecoText = footer.querySelector(".deco-text");
  if (!footerDecoText) return;
  const footerDecoTextContent = createTag(
    "p",
    { class: "deco-text-content" },
    footerDecoText.textContent
  );
  footerDecoText.innerHTML = "";
  footerDecoText.appendChild(footerDecoTextContent);
  return footerDecoText;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = "";

  // fetch footer content
  const footerPath = cfg.footer || "/footer";
  const resp = await fetch(
    `${footerPath}.plain.html`,
    window.location.pathname.endsWith("/footer") ? { cache: "reload" } : {}
  );

  if (resp.ok) {
    const html = await resp.text();

    // get document from drive
    const footer = document.createElement("div");
    footer.innerHTML = html;
    decorateIcons(footer);

    // reorganize block structure
    const footerContent = decorateFooterContent(footer);
    const footerDecoText = decorateFooterDecoText(footer);

    block.append(footerContent);
    block.append(footerDecoText);
  }
}
