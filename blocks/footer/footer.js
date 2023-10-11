import { readBlockConfig, decorateIcons } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helpers.js';

// decorate
function decorateFooterContent(footer) {
  const footerContent = footer.querySelector('.footer-content');
  if (!footerContent) return null;

  const footerContentRows = footerContent.querySelectorAll(':scope > div');
  const topContent = footerContentRows[0].querySelector('div');
  topContent.classList.add('footer-top-content', 'heading-l');

  const bottomContent = footerContentRows[1];
  bottomContent.classList.add('footer-bottom-content');

  footerContent.innerHTML = '';
  footerContent.appendChild(topContent);
  footerContent.appendChild(bottomContent);

  return footerContent;
}

function decorateFooterDecoText(footer) {
  const footerDecoText = footer.querySelector('.deco-text');
  if (!footerDecoText) return null;

  const footerDecoTextWrapper = createTag(
    'span',
    { class: 'deco-text-element' },
    footerDecoText.textContent,
  );
  const footerDecoTextMarqueeContent = createTag(
    'div',
    { class: 'deco-text-content marquee-content' },
    '',
    // footerDecoTextWrapper
  );

  const requiredContentAmount = 8;
  const arrayOfRequiredContent = Array.from(
    Array(requiredContentAmount).keys(),
  );
  arrayOfRequiredContent.forEach((_, index) => {
    const marqueeContent = footerDecoTextWrapper.cloneNode(true);
    marqueeContent.classList.add(`marquee-content-${index}`);
    footerDecoTextMarqueeContent.appendChild(marqueeContent);
  });

  const decoTextMarquee = createTag(
    'div',
    { className: 'marquee' },
    footerDecoTextMarqueeContent,
  );

  footerDecoText.innerHTML = '';
  footerDecoText.appendChild(decoTextMarquee);

  return footerDecoText;
}

// TODO: animate
// function animateFooterDecoText(footerDecoText) {
//   const target = footerDecoText.querySelector('.marquee-content');

//   gsap.to(target, {
//     xPercent: -100,
//     repeat: -1,
//     duration: 40,
//     ease: 'linear',
//   })
//     .totalProgress(0.5);
// }

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(
    `${footerPath}.plain.html`,
    window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {},
  );

  if (resp.ok) {
    const html = await resp.text();

    // get document from drive
    const footer = document.createElement('div');
    footer.innerHTML = html;
    decorateIcons(footer);

    // reorganize block structure
    const footerContent = decorateFooterContent(footer);
    const footerDecoText = decorateFooterDecoText(footer);
    // animateFooterDecoText(footerDecoText);

    block.append(footerContent);
    block.append(footerDecoText);
  }
}
