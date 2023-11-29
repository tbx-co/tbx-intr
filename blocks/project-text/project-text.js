import { setProjectThemeColorToVariable, createTag } from '../../scripts/helpers.js';
import { addInviewObserverToAnimatedElement, addTextSplitArrowLink } from '../../scripts/animation.js';

function initBlockAnimation(block) {
  const titleWrapper = block.querySelector('.project-title-wrapper');
  titleWrapper.classList.add('fade-up');
  addInviewObserverToAnimatedElement(block);
}

export default function decorate(block) {
  setProjectThemeColorToVariable(block, '--title-text-color');

  [...block.children].forEach((row) => {
    const projectTitle = row.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (projectTitle && projectTitle.length > 0) {
      row.classList.add('project-title-wrapper');
      projectTitle.forEach((title) => title.classList.add('heading-ml', 'heading'));
      return;
    }

    row.classList.add('project-description-wrapper');
    [...row.children].forEach((div) => {
      div.classList.add('text-wrapper', 'description-m');
      if (div.innerHTML.trim() === '') {
        div.classList.add('empty');
      }

      // change structure into testimonial if image present
      const image = div.querySelector('picture');
      if (image) {
        image.parentNode.remove();
        const imageWrapper = createTag('div', { class: 'testimonial-img-wrapper' }, '');
        imageWrapper.append(image);

        const texts = div.querySelectorAll('p');
        const textWrapper = createTag('div', { class: 'testimonial-text-wrapper' }, '');
        texts.forEach((text) => {
          textWrapper.append(text);
        });

        div.append(imageWrapper);
        div.append(textWrapper);
        div.classList.add('project-text-testimonial');
      }

      const links = div.querySelectorAll('a');
      if (links.length > 0) {
        links.forEach((link) => {
          addTextSplitArrowLink(link);
        });
      }
    });
  });

  initBlockAnimation(block);
}
