// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { createTag } from './helpers.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// GA setup
const GAcodeID = 'G-X2NK8ZFC38';
function addGAtagCode(gaCodeID) {
  const gaScriptSrc = `https://www.googletagmanager.com/gtag/js?id=${gaCodeID}`;
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = gaScriptSrc;
  document.body.append(gaScript);

  const gaInitScript = createTag('script', {
  }, `
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', '${gaCodeID}');
  `);
  document.body.append(gaInitScript);
}

addGAtagCode(GAcodeID);