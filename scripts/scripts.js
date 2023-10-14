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
} from "./aem.js";
import { createTag } from "./helpers.js";

const LCP_BLOCKS = []; // add your LCP blocks to the list

// custom methods
async function loadGsapLib() {
  const gsapCDN =
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
  await loadScript(gsapCDN);
  const initScript = createTag("script", {}, "");
  document.body.append(initScript);
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector("h1");
  const picture = main.querySelector("picture");
  // eslint-disable-next-line no-bitwise
  if (
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement("div");
    section.append(buildBlock("hero", { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes("localhost"))
      sessionStorage.setItem("fonts-loaded", "true");
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
    console.error("Auto Blocking failed", error);
  }
}

// decorate function
export function decorateTitleSection(main) {
  const titleSections = main.querySelectorAll(".title-section");
  if (!titleSections) return;
  titleSections.forEach((section) => {
    const elements = section.querySelectorAll("h1,h2,h3,h4,h5,h6,p");
    if (!elements) return;

    const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

    elements.forEach((el) => {
      let currentTag = el.tagName.toLowerCase();
      if (headingTags.includes(currentTag)) {
        if (currentTag == "h1" || currentTag == "h2") {
          el.classList.add("heading-xl", "section-title");
        } else {
          el.classList.add("heading-l");
        }
      } else {
        el.classList.add("section-description");
      }
    });

    // const eyebrow = elements[0];
    // const headline = elements[1];
    // if (eyebrow) {
    //   eyebrow.classList.add('icon-eyebrow');
    // }
    // if (headline) {
    //   headline.classList.add('main-headline');
    // }
  });
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

// load external libraries
function loadExternalLibraries() {
  loadGsapLib();
}

// TODO: set theme based on page's first section
// function updateNavMenuTheme() {
// }

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = "en";
  decorateTemplateAndTheme();
  const main = doc.querySelector("main");
  if (main) {
    decorateMain(main);
    document.body.classList.add("appear");
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem("fonts-loaded")) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }

  loadExternalLibraries();
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector("main");
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector("header"));
  loadFooter(doc.querySelector("footer"));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM("lazy");
  sampleRUM.observe(main.querySelectorAll("div[data-block-name]"));
  sampleRUM.observe(main.querySelectorAll("picture > img"));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import("./delayed.js"), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
