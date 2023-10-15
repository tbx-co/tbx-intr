import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';

function createPersonInfo(div) {
  const personTitles = div.querySelectorAll('h5');
  if (personTitles.length === 0) return null;

  const personInfo = createTag('div', { class: 'person-card-person-info' }, '');
  personTitles.forEach((title, index) => {
    if (index === 0) title.classList.add('person-name', 'heading-xs');
    if (index === 1) title.classList.add('person-title', 'description-s');
    personInfo.append(title);
  });

  return personInfo;
}

function addPersonIconToPersonInfo(div, personInfo) {
  const icon = div.querySelector('picture');
  if (!icon) return;
  const iconWrapper = createTag('div', { class: 'person-info-icon' }, '');
  const parentWrapper = icon.parentNode;
  iconWrapper.append(icon);
  parentWrapper.remove();

  const personInfoTextHTML = personInfo.innerHTML;
  const personTextWrapper = createTag(
    'div',
    { class: 'person-info-text' },
    personInfoTextHTML,
  );

  replaceAllChildElements(personInfo, iconWrapper, personTextWrapper);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('person-card-wrapper');

    [...row.children].forEach((col, index) => {
      col.classList.add(`person-card-col-${index + 1}`);

      // content column
      if (index === 1) {
        const title = col.querySelector('h4');
        if (title) title.classList.add('person-card-title', 'heading-s');

        const paragraphs = col.querySelectorAll('p');
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => p.classList.add('description-m', 'description'));
        }

        const personInfo = createPersonInfo(col);
        if (block.classList.contains('testimonial')) {
          addPersonIconToPersonInfo(col, personInfo);
        }

        if (personInfo) col.append(personInfo);
      }
    });
  });
}
