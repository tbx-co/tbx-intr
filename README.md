# TBX Intr Site

Adobe EDS site for tbx Intr site, based on adobe's aem template:
https://github.com/adobe/aem-boilerplate

## Environments

- Your-branch Preview: https://_branchname_--tbx-intr--tbx-co.hlx.live/
- Preview: https://main--tbx-intr--tbx-co.hlx.page/
- Live: https://main--tbx-intr--tbx-co.hlx.live/
- PROD: https://hellointr.com/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository

If you have helix cli installed before (haven't use adobe franklin before):

3. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
4. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)

If you have used helix/franklin before:

4. Start Helix Proxy: `hlx up` (opens your browser at `http://localhost:3000`)

5. Open the `{repo}` directory in your favorite IDE and start coding :)

## Before submitting code

- run `npm run lint:fix` to fix the fixable stylelint css & eslint js errors with --fix option
- run `npm run lint` to ensure that no eslint error exists

## Other setup

### Eslint Setup 

- Disabled `max-len` rule: as most of the time some codes / comments are long by nature (esp. for shorthand one-liner js methods), disabled for more convenient implementation 
- Allowed `console.warn`: please use `console.warn` to alert user input error, like something is missing from the google doc side & alert user to input correctly -> easier to debug. Format prefix the error like `Content Input Alert in block_name: xxxx` so that we know it's intended & can spot out the user input error right away


## References

1. Developer Tutorial: https://www.hlx.live/developer/tutorial
2. Block Collection: https://www.hlx.live/developer/block-collection
