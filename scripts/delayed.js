// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { createTag } from './helpers.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// GTM code setup
const GTMcodeID = 'GTM-523X9Q42';
function addGTMtagCode(gtmcodeID) {
  const gtmScript = createTag('script', {}, `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmcodeID}');
    `);
  document.head.prepend(gtmScript);

  const gtmIframe = createTag('iframe', {
    src: `https://www.googletagmanager.com/ns.html?id=${gtmcodeID}`,
    height: '0',
    width: '0',
    style: 'display:none;visibility:hidden',
  });
  const gtmNoScript = createTag('noscript', {}, gtmIframe);
  document.body.prepend(gtmNoScript);
}

addGTMtagCode(GTMcodeID);
