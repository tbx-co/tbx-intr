import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';
import { addTextSplitAnimationToAllLinks } from '../../scripts/animation.js';

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

function addPersonInfoTextWrapper(personInfo) {
  const personInfoTextHTML = personInfo.innerHTML;
  const personTextWrapper = createTag(
    'div',
    { class: 'person-info-text' },
    personInfoTextHTML,
  );
  replaceAllChildElements(personInfo, personTextWrapper)
}

function addPersonIconToPersonInfo(div, personInfo) {
  const icon = div.querySelector('picture');
  const iconWrapper = createTag('div', { class: 'person-info-icon' }, '');
  const parentWrapper = icon.parentNode;
  iconWrapper.append(icon);
  parentWrapper.remove();

  const personTextWrapper = personInfo.querySelector('.person-info-text');

  replaceAllChildElements(personInfo, iconWrapper, personTextWrapper);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('person-card-wrapper');

    [...row.children].forEach((col, index) => {
      col.classList.add(`person-card-col-${index + 1}`);

      // image column
      if (index === 0) {
        col.classList.add('person-image-wrapper');
        const images = col.querySelectorAll('img');
        if (images.length === 2) {
          images[0].classList.add('original-image');
          images[1].classList.add('hover-active-image');
        }
      }

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
          addPersonInfoTextWrapper(personInfo);

          // add icon if has icon
          const icon = col.querySelector('picture');
          if (icon) {
            personInfo.classList.add("with-icon");
            addPersonIconToPersonInfo(col, personInfo);
          }
        }

        if (personInfo) col.append(personInfo);
      }
    });
  });

  addTextSplitAnimationToAllLinks(block);
}
