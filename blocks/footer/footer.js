import { readBlockConfig, decorateIcons } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helpers.js';
import { addMarqueeAnimationToElements, addTextSplitAnimationToElement, addRevealAnimationToSection } from '../../scripts/animation.js';

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

  const linkElements = footer.querySelectorAll('a');
  linkElements.forEach((linkElement) => addTextSplitAnimationToElement(linkElement));

  return footerContent;
}

function decorateFooterDecoText(footer) {
  const footerDecoText = footer.querySelector('.deco-text');
  if (!footerDecoText) return null;

  const footerDecoTextWrapper = createTag(
    'div',
    { class: 'deco-text-element' },
    footerDecoText.textContent,
  );
  const footerDecoTextMarqueeContent = createTag(
    'div',
    { class: 'deco-text-content marquee-inner-wrapper' },
    '',
  );

  const requiredContentAmount = 8;
  const arrayOfRequiredContent = Array.from(
    Array(requiredContentAmount).keys(),
  );
  arrayOfRequiredContent.forEach((_, index) => {
    const marqueeContent = footerDecoTextWrapper.cloneNode(true);
    marqueeContent.classList.add(`marquee-content-${index}`, 'marquee-content');
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

    // add marquee animation
    const targetElements = footerDecoText.querySelectorAll('.marquee-content');
    const marqueeTime = 15000;
    addMarqueeAnimationToElements(targetElements, marqueeTime);

    const allSections = document.querySelectorAll('main > div');
    const revealTriggerSection = allSections[allSections.length - 1];
    addRevealAnimationToSection(block, revealTriggerSection);

    block.append(footerContent);
    block.append(footerDecoText);
  }
}
