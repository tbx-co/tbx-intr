import { loadEmbed } from '../embed/embed.js';
import { createTag } from '../../scripts/helpers.js';

const loadVideoByIntersectionObserver = (block, videoLink, hideControls) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, videoLink, true, hideControls);
    }
  });
  observer.observe(block);
};

const loadVideoByClick = (block, videoLink, mediaWrapper, hideControls) => {
  const videoClickArea = createTag(
    'div',
    {
      class: 'play-media-area',
    },
    '<button title="Play"></button></div>',
  );
  mediaWrapper.append(videoClickArea);

  mediaWrapper.addEventListener('click', () => {
    loadEmbed(block, videoLink, true, hideControls);
  });
};

// TODO: see if add in support for .mp4 is needed
export default function decorate(block) {
  if (block.classList.contains('full-width')) {
    block.parentNode.classList.add('full-width');
  }

  const image = block.querySelector('picture');
  const videoLinkElement = block.querySelector('a');

  block.textContent = '';
  const mediaWrapper = createTag('div', { class: 'media-wrapper' }, '');
  if (image) {
    mediaWrapper.append(image);
    block.append(mediaWrapper);
  }

  if (videoLinkElement) {
    const videoLink = videoLinkElement.href;
    if (videoLink.length <= 0) {
      return;
    }

    const isAutoPlay = block.classList.contains('autoplay');
    const hideControls = block.classList.contains('hide-controls');
    if (isAutoPlay) {
      loadVideoByIntersectionObserver(block, videoLink, hideControls);
    } else {
      loadVideoByClick(block, videoLink, mediaWrapper, hideControls);
    }
  }
}
