import { loadEmbed } from '../embed/embed.js';
import { createTag } from '../../scripts/helpers.js';

const loadEmbedVideoByIntersectionObserver = (block, videoLink, hideControls) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      block.classList.add('has-video');
      loadEmbed(block, videoLink, true, hideControls);
    }
  });
  observer.observe(block);
};

const loadEmbedVideoByClick = (block, videoLink, mediaWrapper) => {
  const hideControls = false;
  const videoClickArea = createTag(
    'div',
    {
      class: 'play-media-area',
    },
    '<button title="Play"></button></div>',
  );
  mediaWrapper.append(videoClickArea);
  block.classList.add('has-video');
  const targetEmbedElement = videoClickArea;

  mediaWrapper.addEventListener('click', () => {
    loadEmbed(targetEmbedElement, videoLink, true, hideControls);
  });
};

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
  }
  block.append(mediaWrapper);

  if (videoLinkElement) {
    const videoLink = videoLinkElement.href;
    if (videoLink.length <= 0) {
      return;
    }

    const isAutoPlay = block.classList.contains('autoplay');
    const hideControls = block.classList.contains('hide-controls');
    if (isAutoPlay) {
      loadEmbedVideoByIntersectionObserver(block, videoLink, hideControls);
    } else {
      loadEmbedVideoByClick(block, videoLink, mediaWrapper);
    }
  }
}
