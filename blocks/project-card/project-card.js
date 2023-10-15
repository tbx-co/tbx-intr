import {
  createTag,
  returnLinkTarget,
  replaceElementType,
  replaceAllChildElements,
} from '../../scripts/helpers.js';

function createProjectLinkWrapper(infoDiv) {
  const projectLink = infoDiv.querySelector('a');
  if (!projectLink) {
    console.warn('Content Input Alert in Project Card: Need project link');
  }

  const projectLinkWrapper = createTag(
    'a',
    {
      class: 'project-card-link-wrapper',
      href: projectLink.href,
      title: projectLink.title,
      target: returnLinkTarget(projectLink.href),
    },
    '',
  );
  return projectLinkWrapper;
}

function createMediaDiv(div) {
  const picture = div.querySelector('picture');
  const mediaDiv = createTag('div', { class: 'project-card-media' }, '');
  mediaDiv.append(picture);
  return mediaDiv;
}

function createTitleWrapper(div) {
  const titleWrapper = createTag(
    'div',
    { class: 'project-card-title-wrapper' },
    '',
  );
  const title = div.querySelector('h3');
  const newTitle = replaceElementType(title, 'h4');
  const description = div.querySelector('p');
  description.classList.add('description-s');
  const descriptionItems = description.innerText.split(',');
  if (descriptionItems.length > 1) {
    description.innerHTML = '';
    descriptionItems.forEach((item) => {
      description.innerHTML += `<span>${item}</span>`;
    });
  }
  titleWrapper.append(newTitle, description);
  return titleWrapper;
}

function createDescriptionWrapper(div) {
  const descWrapper = createTag(
    'div',
    { class: 'project-card-description-wrapper' },
    '',
  );
  const title = div.querySelector('h5');
  const description = div.querySelector('p');
  description.classList.add('description-s');
  descWrapper.append(title, description);
  return descWrapper;
}

function createInfoDiv(briefInfoDiv, detailInfoDiv) {
  const infoDiv = createTag('div', { class: 'project-card-info-wrapper' }, '');
  const titleWrapper = createTitleWrapper(briefInfoDiv);
  const descriptionWrapper = createDescriptionWrapper(detailInfoDiv);
  infoDiv.append(titleWrapper, descriptionWrapper);
  return infoDiv;
}

export default function decorate(block) {
  const blockRows = block.querySelectorAll(':scope > div');
  const blockRowArray = [...blockRows];
  if (blockRows.length < 2) {
    console.warn('Content Input Alert in Project Card: Need at least 2 rows of data');
    return;
  }

  const mainInfoWithImage = blockRowArray[0];
  const projectDetailInfo = blockRowArray[1];

  const projectLinkWrapper = createProjectLinkWrapper(mainInfoWithImage);

  const mediaDiv = createMediaDiv(mainInfoWithImage);
  if (mediaDiv) projectLinkWrapper.append(mediaDiv);

  const infoDiv = createInfoDiv(mainInfoWithImage, projectDetailInfo);
  if (infoDiv) projectLinkWrapper.append(infoDiv);

  replaceAllChildElements(block, projectLinkWrapper);
}
