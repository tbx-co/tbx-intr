import {
  createTag,
  returnLinkTarget,
  replaceElementType,
  replaceAllChildElements,
  observeElementWithCallback,
} from '../../scripts/helpers.js';
import { addTextSplitAnimationToElement } from '../../scripts/animation.js';

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

// accept .mp4
function createVideoElement(videoUrl) {
  const attrs = 'playsinline autoplay loop muted';
  const videoHTML = /* html */`
    <video ${attrs}>
      <source src="${videoUrl}" type="video/mp4"> 
    </video>
  `;
  const videoWrapper = createTag('div', {
    class: 'video-wrapper',
  }, videoHTML);

  return videoWrapper;
}

function createMediaDiv(div, block) {
  const picture = div.querySelector('picture');

  const mediaDiv = createTag('div', { class: 'project-card-media' }, '');
  mediaDiv.append(picture);

  const videoLinkElement = div.querySelector('a');
  if (videoLinkElement) {
    const videoUrl = videoLinkElement.href;
    if (videoUrl.endsWith('.mp4')) {
      observeElementWithCallback(block, () => {
        const mediaVideo = createVideoElement(videoUrl);
        if (mediaVideo) mediaDiv.append(mediaVideo);
      });
    }
  }

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
  newTitle.classList.add('project-card-title');
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
  const projectMainInfo = mainInfoWithImage.children[1];
  const projectDetailInfo = blockRowArray[1];

  const projectLinkWrapper = createProjectLinkWrapper(projectMainInfo);

  const mediaDiv = createMediaDiv(mainInfoWithImage, block);
  if (mediaDiv) projectLinkWrapper.append(mediaDiv);

  const infoDiv = createInfoDiv(projectMainInfo, projectDetailInfo);
  if (infoDiv) projectLinkWrapper.append(infoDiv);

  replaceAllChildElements(block, projectLinkWrapper);

  // add animation
  const mainTitle = block.querySelector('.project-card-title');
  if (mainTitle) {
    addTextSplitAnimationToElement(mainTitle, true, projectLinkWrapper);
  }
}
