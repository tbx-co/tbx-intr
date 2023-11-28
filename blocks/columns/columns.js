import { createTag, replaceAllChildElements, returnLinkTarget } from '../../scripts/helpers.js';

function decorateStatsItems(statsItems) {
  const descriptions = statsItems.querySelectorAll('p');
  descriptions.forEach((description) => description.classList.add('stats-items-description', 'description-m'));

  const headings = statsItems.querySelectorAll('h1,h2,h3,h4,h5,h6');
  headings.forEach((heading) => {
    heading.innerHTML = heading.innerHTML.replace(/\D+/g, (match) => `<span class="stats-deco-text">${match}</span>`);
  });
}

function decorateImageList(list) {
  [...list.children].forEach((item) => {
    const image = item.querySelector('.image-wrapper');
    const linkEl = item.querySelector('a');
    if (!linkEl) return;
    const linkWrapper = createTag('a', {
      href: linkEl.href,
      title: linkEl.title,
      target: returnLinkTarget(linkEl.href),
      class: 'image-link-wrapper hover-shine',
    });
    linkWrapper.append(image);
    replaceAllChildElements(item, linkWrapper);
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const gridContainer = createTag('div', { class: 'columns-grid-container' });

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('columns-item');

      const bigTitle = col.querySelector('h1, h2, h3, h4');
      if (bigTitle) bigTitle.classList.add('heading-m', 'big-heading');
      const title = col.querySelector('h5, h6');
      if (title) {
        title.classList.add('heading-s', 'heading');
        if (!bigTitle) {
          title.classList.add('text-blue');
        }
      }

      const description = col.querySelector('p');
      if (description) description.classList.add('description-m', 'description');

      const pic = col.querySelector('picture');
      if (pic) {
        pic.parentElement.remove();
        const imageWrapper = createTag('div', {
          class: 'image-wrapper',
        }, pic);
        col.append(imageWrapper);
      }

      gridContainer.append(col);
    });
  });

  if (block.classList.contains('stats-items')) {
    decorateStatsItems(gridContainer);
  }

  if (block.classList.contains('image-list')) {
    decorateImageList(gridContainer);
  }

  replaceAllChildElements(block, gridContainer);
}
