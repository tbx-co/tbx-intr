# TBX Intr Site

Adobe EDS site for tbx Intr site, based on adobe's aem template:
https://github.com/adobe/aem-boilerplate

## Environments

- Your-branch Preview: https://_branchname_--tbx-intr--tbx-co.hlx.live/
- Preview: https://main--tbx-intr--tbx-co.hlx.page/
- Live: https://main--tbx-intr--tbx-co.hlx.live/
- PROD: going to setup a new domain connection for Intr site \* [TODO]

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

- run `npm run lint:fix` to fix the fixable stylelin css & js errors with --fix option
- run `npm run lint` to ensure that no eslint error exists
- run `npm run test` to double-check & avoid failing tests

## References

1. Developer Tutorial: https://www.hlx.live/developer/tutorial
2. Block Collection: https://www.hlx.live/developer/block-collection
