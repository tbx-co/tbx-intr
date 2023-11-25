import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';

function decorateStatsItems(statsItems) {
  const descriptions = statsItems.querySelectorAll('p');
  descriptions.forEach((description) => description.classList.add('stats-items-description', 'description-m'));

  const headings = statsItems.querySelectorAll('h1,h2,h3,h4,h5,h6');
  headings.forEach((heading) => {
    heading.innerHTML = heading.innerHTML.replace(/\D+/g, (match) => `<span class="stats-deco-text">${match}</span>`);
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

  replaceAllChildElements(block, gridContainer);
}
