import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  loadScript,
} from './aem.js';
import { createTag } from './helpers.js';
import { addInviewObserverToAnimatedElement } from './animation.js';

const LCP_BLOCKS = ['project-card']; // add your LCP blocks to the list

export async function loadGlideLib() {
  const glideCSS = createTag('link', {
    rel: 'stylesheet',
    href: '/libs/glide/glide.core.min.css',
  });
  document.head.append(glideCSS);

  await loadScript('/libs/glide/glide.min.js');
  const initScript = createTag('script', {}, `
      new Glide('.glide', {
        type: 'carousel',
      }).mount();
  `);
  document.body.append(initScript);
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (
    h1
    && picture
    && h1.compareDocumentPosition(picture)
    && Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

// decorate functions here:
export function decorateTitleSection(main) {
  const titleSections = main.querySelectorAll('.title-section');
  if (!titleSections) return;
  titleSections.forEach((section) => {
    section.classList.add('animated-split-text');
    const elements = section.querySelectorAll('h1,h2,h3,h4,h5,h6,p');
    if (!elements) return;

    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    elements.forEach((el) => {
      const currentTag = el.tagName.toLowerCase();
      if (headingTags.includes(currentTag)) {
        if (currentTag === 'h1' || currentTag === 'h2') {
          el.classList.add('heading-xl', 'section-title', 'fade-up');
        } else {
          el.classList.add('heading-l');
        }
      } else {
        el.classList.add('section-description');
        section.classList.add('with-section-description');
      }
    });

    addInviewObserverToAnimatedElement(section);
  });
}

/**
 * Looks for a meta tag with the given name and returns styles the body background color
 * @param main
 */
function decoratePageTheme() {
  const theme = document.querySelector('meta[name="page-theme-color"]');
  if (theme) {
    const main = document.querySelector('main');
    const mainBgColor = theme.getAttribute('content');
    main.style.setProperty('--main-bg-color', mainBgColor);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateTitleSection(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main); // NOTE: load all blocks

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  decoratePageTheme();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  // copied how 3rd library is loaded in Adobe Helix official site

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => {
    import('./delayed.js');
  }, 4000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
