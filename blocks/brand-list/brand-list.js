import { createTag } from '../../scripts/helpers.js';

export default function decorate(block) {
  const blockRows = block.querySelectorAll(':scope > div');
  const blockRowArray = [...blockRows];

  // text-section
  const textSection = blockRowArray.shift();
  textSection.classList.add('text-section');

  // brand-logo-list
  const brandLogoList = createTag('ul', { class: 'brand-logo-list' }, '');

  blockRowArray.forEach((row) => {
    const picture = row.querySelector('picture');
    const listItem = createTag('li', { class: 'brand-logo-item' }, '');
    const linkEl = row.querySelector('a');

    if (linkEl) {
      const pictureLink = createTag(
        'a',
        {
          href: linkEl.href,
          title: linkEl.title,
        },
        picture,
      );
      listItem.append(pictureLink);
    } else {
      listItem.append(picture);
    }

    brandLogoList.append(listItem);
    row.remove();
  });

  block.append(brandLogoList);
}
