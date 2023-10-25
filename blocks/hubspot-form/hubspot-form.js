import { loadScript } from "../../scripts/aem.js";
import { createTag } from "../../scripts/helpers.js";

const initHubspotSetting = (infoLines) => {
  let hubspotSetting = {
    region: "",
    portalId: "",
    formId: "",
    target: ".hubspot-form",
  };

  infoLines.forEach((line) => {
    for (let key in hubspotSetting) {
      let innerText = line.textContent.trim();

      if (innerText.startsWith(`${key}:`)) {
        let value = innerText.replace(new RegExp(`^${key}:`), "").trim();

        hubspotSetting[key] = value;
      }
    }
  });

  return hubspotSetting;
};

async function loadHubsportLibrary(hubspotSetting) {
  const hubspotScript = "https://js.hsforms.net/forms/embed/v2.js";
  await loadScript(hubspotScript, {
    type: "text/javascript",
    charset: "utf-8",
  });

  // css: "" -> disable using embed & render form directly on page instead*

  // TODO: styling for form
  const initHubSpotScript = createTag(
    "script",
    {},
    `
        hbspt.forms.create({
            region: "${hubspotSetting.region}",
            portalId: "${hubspotSetting.portalId}",
            formId: "${hubspotSetting.formId}",
            target: "${hubspotSetting.target}",
            cssClass: "embed-hbspot-form"
        });
    `
  );

  console.log(initHubSpotScript);

  document.body.append(initHubSpotScript);
}

const validateHubspotSettingInput = (hubspotSetting) => {
  for (let key in hubspotSetting) {
    if (hubspotSetting[key] === "") {
      console.warn(`Missing "${key}: xxxxx" in Hubspot Form Block`);
      return false;
    }
  }
  return true;
};

// TODO: need higher access to style, may need to restyle on hubspot instead

// docs: https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
export default async function decorate(block) {
  const infoLines = block.querySelectorAll("p");
  if (infoLines.length <= 0) {
    console.warn(`Content Input Alert in Hubspot Form: need user input`);
    return;
  }

  const hubspotSetting = initHubspotSetting(infoLines);
  console.log(hubspotSetting);
  const isHubsportSettingValid = validateHubspotSettingInput(hubspotSetting);

  if (isHubsportSettingValid) await loadHubsportLibrary(hubspotSetting);
}
