import { getMetadata, loadScript } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helpers.js';
import { addTextSplitAnimationToElement } from '../../scripts/animation.js';

// constants
const BRAND_LOGO = '<img loading="lazy" alt="Intr" class="intr-logo placeholder" src="/assets/logo/intr-white-black-logo.svg">';
const BRAND_LOGO_WHITE = '<img loading="lazy" alt="Intr" class="intr-logo white" src="/assets/logo/intr-white-logo.svg">';
const BRAND_LOGO_WHITE_BLACK = '<img loading="lazy" alt="Intr" class="intr-logo white-black" src="/assets/logo/intr-white-black-logo.svg">';
const BRAND_LOGO_BLUE_BLACK = '<img loading="lazy" alt="Intr" class="intr-logo blue-black" src="/assets/logo/intr-blue-black-logo.svg">';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function getMobileMenuExpandedStatus() {
  const mobileMenu = document.querySelector('.mobile-menu-wrapper .mobile-menu');
  const isMobileMenuExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
  return isMobileMenuExpanded;
}

function decorateBrandLogo(nav) {
  const brandBlock = nav.querySelector('.nav-brand');
  if (!brandBlock) return;

  const brandLink = brandBlock.querySelector('a');
  if (!brandLink) return;
  brandLink.classList.add('nav-brand-logo-link', 'intr-logo-wrapper');
  brandLink.innerHTML = `<span class="d-none">${brandLink.textContent}</span>`;
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO);
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO_WHITE);
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO_WHITE_BLACK);
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO_BLUE_BLACK);
  brandBlock.innerHTML = '';
  brandBlock.appendChild(brandLink);
}

function decorateCTAButton(nav) {
  const ctaBlock = nav.querySelector('.nav-cta');
  if (!ctaBlock) return;

  const ctaButton = ctaBlock.querySelector('a');
  if (ctaButton) ctaButton.classList.add('primary-button');
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
    const mobileMenuButton = document.querySelector('.nav-btn');
    const mobileMenuExpanded = getMobileMenuExpandedStatus();

    if (mobileMenuExpanded && !isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(mobileMenuWrapper, mobileMenuButton);
      mobileMenuButton.focus();
    }
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} mobileNav The mobileNav menu element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(mobileMenuWrapper, toggleMenuButton, forceExpanded = null) {
  const mobileNav = mobileMenuWrapper.querySelector('nav');
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : mobileNav.getAttribute('aria-expanded') === 'true';

  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  mobileNav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  toggleMenuButton.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  toggleMenuButton.setAttribute('data-open', expanded ? 'false' : 'true');

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function createMobileMenu(nav) {
  // use separate mobile menu for adding animations
  const mobileMenu = nav.cloneNode(true);
  mobileMenu.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('id', 'mobile-nav');
  mobileMenu.classList.add('mobile-menu');

  // placeholder div for nav btn area
  const navButtonPlaceholderDiv = createTag(
    'div',
    {
      class: 'nav-hamburger placeholder-div',
    },
    '',
  );
  mobileMenu.prepend(navButtonPlaceholderDiv);

  const animateClass = 'mobile-nav-js';
  const mobileMenuWrapper = createTag(
    'div',
    {
      class: `mobile-menu-wrapper ${animateClass}`,
    },
    mobileMenu,
  );

  return mobileMenuWrapper;
}

const setupHamburgerButton = () => {
  const animateClass = 'nav-btn-js';
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" class="nav-btn ${animateClass}" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
  return hamburger;
};

const updateNavMenuThemeBasedOnNavThemeSetting = (block) => {
  const navThemeSetting = document.querySelector('meta[name="nav-theme"]');
  if (navThemeSetting && navThemeSetting.getAttribute('content')) {
    const navTheme = navThemeSetting.getAttribute('content');
    block.classList.add(navTheme);
  } else {
    block.classList.add('theme-dark');
  }
};

// ---- animations ----
// scroll & reveal header
const setScrollRevealAnimation = (navWrapper) => {
  let { scrollY } = window;
  const myFunc = () => {
    if (scrollY > 80) {
      if (scrollY < window.scrollY) {
        navWrapper.classList.add('hide');
      } else {
        navWrapper.classList.remove('hide');
      }
    }
    scrollY = window.scrollY;
  };
  window.addEventListener('scroll', myFunc);
};

async function initCircularNavAnimation() {
  await loadScript('/libs/circularNav.js');

  const revealerNav = window.revealer({
    revealElementSelector: '.mobile-nav-js',
    options: {
      anchorSelector: '.nav-btn-js',
    },
  });

  const actionBtn = document.querySelector('.nav-btn-js');
  actionBtn.addEventListener('click', () => {
    if (!revealerNav.isRevealed()) {
      revealerNav.reveal();
      actionBtn.setAttribute('data-open', true);
    } else {
      revealerNav.hide();
      actionBtn.setAttribute('data-open', false);
    }
  });
}

function updateCircularRevealState() {
  const actionBtn = document.querySelector('.nav-btn-js');
  actionBtn.click();
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    // decorate section with classes
    const classes = ['brand', 'sections', 'cta'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
      if (section.classList.contains('nav-cta')) {
        const ctaButton = section.querySelector('a');
        ctaButton.classList.add('primary-button');
      }
    });

    // decorate nav sections
    decorateBrandLogo(nav);
    decorateCTAButton(nav);

    // update navlink classes
    const navSectionLinks = nav.querySelectorAll('.nav-sections a');
    navSectionLinks.forEach((navLink) => {
      navLink.classList.add('nav-link');
      addTextSplitAnimationToElement(navLink, true);
      if (document.URL === navLink.href) navLink.classList.add('active');
    });

    // setup mobile menu & mobile menu btn
    const mobileMenuWrapper = createMobileMenu(nav);
    const hamburger = setupHamburgerButton();
    hamburger.addEventListener('click', () => toggleMenu(mobileMenuWrapper, hamburger));
    nav.prepend(hamburger);

    // prevent mobile nav behavior on window resize back to desktop
    isDesktop.addEventListener('change', () => {
      const isMobileMenuExpanded = getMobileMenuExpandedStatus();
      if (isMobileMenuExpanded && isDesktop.matches) {
        updateCircularRevealState();
      }
    });

    // append newly created menu here
    nav.append(mobileMenuWrapper);
    nav.removeAttribute('aria-expanded');

    const navWrapper = createTag(
      'div',
      {
        class: 'nav-wrapper',
      },
      nav,
    );

    // update theme based on nav-theme setting in Metadata table
    updateNavMenuThemeBasedOnNavThemeSetting(block);
    block.append(navWrapper);

    // animation setup
    setScrollRevealAnimation(navWrapper);
    initCircularNavAnimation();
  }
}
