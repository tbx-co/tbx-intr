import { getMetadata, decorateIcons } from '../../scripts/aem.js';

const BRAND_LOGO = '<img loading="lazy" alt="Intr" class="intr-logo placeholder" src="/assets/img/intr-logo-white.svg">';
const BRAND_LOGO_WHITE = '<img loading="lazy" alt="Intr" class="intr-logo white" src="/assets/img/intr-logo-white.svg">';
const BRAND_LOGO_BLACK = '<img loading="lazy" alt="Intr" class="intr-logo black" src="/assets/img/intr-logo-black.svg">';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function decorateBrandLogo(nav) {
  const brandBlock = nav.querySelector('.nav-brand');
  if (!brandBlock) return;

  const brandLink = brandBlock.querySelector('a');
  if (!brandLink) return;
  brandLink.classList.add('nav-brand-logo-link', 'intr-logo-wrapper');
  brandLink.innerHTML = `<span class="d-none">${brandLink.textContent}</span>`;
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO);
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO_WHITE);
  brandLink.insertAdjacentHTML('afterbegin', BRAND_LOGO_BLACK);
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
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? 'false' : 'true',
  );
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
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
    // console.log(nav);

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

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });

      const navSectionLinks = navSections.querySelectorAll('a');
      navSectionLinks.forEach((navLink) => {
        navLink.classList.add('nav-link');
        if (document.URL === navLink.href) navLink.classList.add('active');
      });
    }

    // TODO: hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);

    // TODO: update theme
    if (document.body.classList.contains('project-detail')) {
      block.classList.add('theme-transparent');
    } else {
      block.classList.add('theme-dark');
    }
    block.append(navWrapper);
  }
}
