import { loadScript } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helpers.js';

const initHubspotSetting = (infoLines) => {
  const hubspotSetting = {
    region: '',
    portalId: '',
    formId: '',
    target: '.contact-form-wrapper',
  };

  infoLines.forEach((line) => {
    Object.keys(hubspotSetting).forEach((key) => {
      const innerText = line.textContent.trim();

      if (innerText.startsWith(`${key}:`)) {
        const value = innerText.replace(new RegExp(`^${key}:`), '').trim();
        hubspotSetting[key] = value;
      }
    });
    line.remove();
  });

  return hubspotSetting;
};

async function loadHubsportLibrary(hubspotSetting) {
  const hubspotScript = 'https://js.hsforms.net/forms/embed/v2.js';
  await loadScript(hubspotScript, {
    type: 'text/javascript',
    charset: 'utf-8',
  });

  /** disable using embed & render form directly on page instead
   *  css: "" to allow render form directly & not use default hubspot styles * */
  const initHubSpotScript = createTag(
    'script',
    {},
    `
        hbspt.forms.create({
            region: "${hubspotSetting.region}",
            portalId: "${hubspotSetting.portalId}",
            formId: "${hubspotSetting.formId}",
            target: "${hubspotSetting.target}",
            css: "",
            cssClass: "embed-hbspot-form",
        });
    `,
  );

  document.body.append(initHubSpotScript);
}

const validateHubspotSettingInput = (hubspotSetting) => {
  let isValid = true;

  Object.keys(hubspotSetting).forEach((key) => {
    if (hubspotSetting[key] === '') {
      console.warn(`Missing "${key}: xxxxx" in Hubspot Form Block`);
      isValid = false;
    }
  });

  return isValid;
};

const decorateHeadings = (headings) => {
  headings.forEach((heading, i) => {
    if (i === 0) {
      heading.classList.add('heading', 'text-blue', 'heading-s');
    } else {
      heading.classList.add('subheading', 'description-m');
    }
  });
};

// docs: https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
export default async function decorate(block) {
  const infoLines = block.querySelectorAll('p');
  if (infoLines.length <= 0) {
    console.warn('Content Input Alert in Hubspot Form: need user input');
    return;
  }

  const headings = block.querySelectorAll('h1,h2,h3,h4,h5,h6');
  if (headings.length > 0) {
    decorateHeadings(headings);
  }

  const contactFormWrapper = createTag('div', {
    class: 'contact-form-wrapper',
  }, '');
  block.append(contactFormWrapper);

  const hubspotSetting = initHubspotSetting(infoLines);
  const isHubsportSettingValid = validateHubspotSettingInput(hubspotSetting);

  if (isHubsportSettingValid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadHubsportLibrary(hubspotSetting);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '300px',
    });
    observer.observe(block);
  }
}
