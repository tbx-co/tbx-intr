import { loadScript } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helpers.js';

const initHubspotSetting = (infoLines) => {
  const hubspotSetting = {
    region: '',
    portalId: '',
    formId: '',
    target: '.hubspot-form',
  };

  infoLines.forEach((line) => {
    Object.keys(hubspotSetting).forEach((key) => {
      const innerText = line.textContent.trim();

      if (innerText.startsWith(`${key}:`)) {
        const value = innerText.replace(new RegExp(`^${key}:`), '').trim();
        hubspotSetting[key] = value;
      }
    });
  });

  return hubspotSetting;
};

async function loadHubsportLibrary(hubspotSetting) {
  const hubspotScript = 'https://js.hsforms.net/forms/embed/v2.js';
  await loadScript(hubspotScript, {
    type: 'text/javascript',
    charset: 'utf-8',
  });

  // css: "" -> disable using embed & render form directly on page instead*

  // TODO: styling for form
  const initHubSpotScript = createTag(
    'script',
    {},
    `
        hbspt.forms.create({
            region: "${hubspotSetting.region}",
            portalId: "${hubspotSetting.portalId}",
            formId: "${hubspotSetting.formId}",
            target: "${hubspotSetting.target}",
            cssClass: "embed-hbspot-form"
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

// TODO: need higher access to style, may need to restyle on hubspot instead

// docs: https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
export default async function decorate(block) {
  const infoLines = block.querySelectorAll('p');
  if (infoLines.length <= 0) {
    console.warn('Content Input Alert in Hubspot Form: need user input');
    return;
  }

  const hubspotSetting = initHubspotSetting(infoLines);
  const isHubsportSettingValid = validateHubspotSettingInput(hubspotSetting);

  if (isHubsportSettingValid) await loadHubsportLibrary(hubspotSetting);
}
