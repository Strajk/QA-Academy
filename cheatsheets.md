# Cheatsheets 🗒

## Useful links

* https://github.com/cypress-io
* https://github.com/cypress-io/cypress/issues


## Selectors

[](./assets/cheatsheet-selectors.md ':include')

## Cypress

[](./assets/cheatsheet-cypress.md ':include')

### Tips

#### Project initialization

[](assets/cypress/initialize.mp4 ':include :type=video width=100% controls')

#### Configuration

Commonly changed configuration options:

* **baseUrl**: default `null`, change to `http://localhost:8000` and use just relative URLs in `cy.visit("/en/...")`
* **defaultCommandTimeout**: default `4000` (4s), increase to at least `10000` (10s) for Kiwi.com 🐌
* **numTestsKeptInMemory**: default `50`, don't worry to increase to 200
* **watchForFileChanges**: default `true`, set to `false` to disable auto reloading on file save

[](assets/cypress/config.mp4 ':include :type=video width=100% controls')

#### Selector playground: Finding simple selectors  

[](assets/cypress/selector-playground.mp4 ':include :type=video width=100% controls')

#### Selector playground: Finding complex selectors with DevTools

[](assets/cypress/selector-playground-with-devtools.mp4 ':include :type=video width=100% controls')

#### Selector playground: Narrowing selectors

[](assets/cypress/selector-playground-narrowing-selectors.mp4 ':include :type=video width=100% controls')


### Recipes

#### Checking dimensions

[](assets/snippets.js ':include :type=code :fragment=checking-dimensions')

#### Conditional interaction (e.g. clicking)

[](assets/snippets.js ':include :type=code :fragment=conditional-interaction')

#### Removing items from local storage

[](assets/snippets.js ':include :type=code :fragment=local-storage')

#### Wait until loader is gone

[](assets/snippets.js ':include :type=code :fragment=loader-gone')
