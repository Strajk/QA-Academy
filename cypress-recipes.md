# Cheatsheets: Cypress: Recipes

### Project initialization

<video src="./assets/cypress/initialize.mp4" width="100%" controls="controls"></video>

### Configuration

Commonly changed configuration options:

* **baseUrl**: default `null`, change to `http://localhost:8000` and use just relative URLs in `cy.visit("/en/...")`
* **defaultCommandTimeout**: default `4000` (4s), increase to at least `10000` (10s) for Kiwi.com 🐌
* **numTestsKeptInMemory**: default `50`, don't worry to increase to `200`
* **watchForFileChanges**: default `true`, set to `false` to disable auto reloading on file save

<video src="./assets/cypress/config.mp4" width="100%" controls="controls"></video>

### Selector playground: Finding simple selectors  

<video src="./assets/cypress/selector-playground.mp4" width="100%" controls="controls"></video>

### Selector playground: Finding complex selectors with DevTools

<video src="./assets/cypress/selector-playground-with-devtools.mp4" width="100%" controls="controls"></video>

### Selector playground: Narrowing selectors

<video src="./assets/cypress/selector-playground-narrowing-selectors.mp4" width="100%" controls="controls"></video>

### Pause and enter debugging on every failed test (requires open DevTools)

In file: `cypress/support/index.js`

```js
Cypress.on("fail", (err, runnable) => {
  debugger // eslint-disable-line no-debugger
  return err
})
```

### Verbose Cypress logs

#### In DevTools when running Cypress via `cypress open`

In file: `cypress/support/index.js`

```js
win.localStorage.debug = "cypress:*"
```

#### In terminal/console when running Cypress in via `cypress run`

```bash
/node_modules/.bin/cypress run …
=>
DEBUG=cypress:* /node_modules/.bin/cypress run …
```

In current Kiwi.com Frontend pipeline, this line is located in `gitlab-ci.yml`

![](https://api.monosnap.com/file/download?id=fQ51xsIwnnKiuTmv5aItBOZxrlSu1E)

### Edit `baseUrl` in `cypress.json` to run Cypress on different "base url"

// TODO: Make more important and notice-able

```text
Change from
`baseUrl: "http://localhost:8000"`
to ie.
`baseUrl: "https://www.kiwi.com"`
```

### View tests in Webstorm

WebStorm has very useful **Test overview window**.

It's not compatible with Cypress by default, but it's compatible with Mocha – which Cypress uses under the hood. In order to make it work with Cypress, we need to create new **Run/Debug Configuration**.

* Search for action `Edit configurations...` and "open it"
* Click on the `+` icon in the top-left (or press `cmd+n`)
* Select Mocha
* In `Name` field, type `Cypress`
* In `Extra Mocha options`, put `--require @babel/register --require "cypress/cypress-mocha-mock.js"`
* In `Test directory`, click on the directory icon in the right side of the text input
* Navigate to the directory with frontend, navigate into `cypress`, navigate into `integration`, select Open
* Check that in `Test directory` is something like `PATH_TO_THE_PROJECT/cypress/integration`
* Check `Include subdirectories`
* Click on OK
* "Cypress" should appear in the top-right corner of WebStorm window
* Click on the play button next to it

<video src="./assets/webstorm-cypress-tests.mp4" width="100%" controls="controls"></video>

### Checking dimensions

```js
cy.get("…").invoke("width").should("be.greaterThan", 100) // TODO: Verify
cy.get("…").its("clientWidth").should("be.greaterThan", 100)
```

### Counting elements

// TODO

### Conditional interaction (e.g. clicking)

```js
cy.get("…")
  .then($el => {
    if ($el.is(":visible")) {
      cy.wrap($el).click() // TODO: Verify
    }
  })
```

### Removing items from local storage

```js
Cypress.Commands.add("logout", () => {
  return cy
    .window()
    .its("localStorage")
    .invoke("removeItem", "token")
})
```

### Wait until loader is gone

```js
cy.visit("")
cy.get(".Loader").should("not.exist", { timeout: 15 * 1000 })
```

### Loop scenarios

```js
describe("Loops", () => {
  configs.forEach(config => {
    describe(`Currency: ${config.currency}`, () => {
      it("…", () => {
        cy.visit(`/?currency=${config.currency}`)
        // …
      })
    })
  })
})
```

### Window access

```js
cy
  .window()
  .then(win => {
    expect(
      win.reduxStore.getState().options.currency
    ).to.eq("czk")
  })
```

### Forms

```js
cy.get("…").type("typing")
cy.get("…").type("slow.typing", { delay: 100 })

cy
  .get("…")
  .type("Typing")
  .blur()
  .should("have.class", "error")
  .prev() // TODO: Test and explain
  .should("have.attr", "style", "color: red;")
```

### File upload

```js
cy.fixture("image.jpg").then(file => {
  cy.get("form input[type=file]").then(fileInput => {
    const fileInputEl = fileInput.get(0)
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File([file], "image.jpg"))
    fileInputEl.files = dataTransfer.files
  })
})
```

## Other Tips

### Hover

// TODO: Double check if correct

```js
Cypress.Commands.add("triggerHover", elements => {
  function fireEvent(element, event) {
    if (element.fireEvent) {
      element.fireEvent(`on${event}`)
    } else {
      const evObj = document.createEvent("Events")
      evObj.initEvent(event, true, false)
      element.dispatchEvent(evObj)
    }
  }

  elements.each((index, element) => { fireEvent(element, "mouseover") })
})
```

### Searching for existing tests

Sadly, right now there’s no better way than full-text search

![](https://d2mxuefqeaa7sj.cloudfront.net/s_538AD2427C6DBB0588F3BF9F27A3292EFF30E80E476687873FF92850431B96E0_1539600402575_2018-10-15+12.46.17.gif)

### Right panel is normal Chrome instance

→ you can open devtools, use debugger, profile etc.

💡 open devtools to see console errors & warnings (e.g. proptypes errors)

### CLI 🤓 tips

**Run only specific file**
`cypress run --spec cypress/integration/booking/booking-misc-spec.js`   # or whatever folder with tests

Run only specific test

![](https://d2mxuefqeaa7sj.cloudfront.net/s_D317328CC61B4B0230A436EC855EF2CEECD13A7B46566716908E3360329048E7_1493279194060_file.png)

## Others

### URL/URI structure

```text
 https://       www.kiwi.com  /us/content/manage/1234 ?something=true
|- protocol -| |- hostname -| |- path              -| |- query --
```

### Snapshots

```js
let last = cy.createSnapshot('last') // » { name, htmlAttrs: {}, body: {} }
let lastBody = last.body.get() // » [$body]
Cypress.$autIframe.contents().find('body').remove()
Cypress.$autIframe.contents().find('html').append(lastBody)
```

### Access AUT (Application Under Test)

```js
Cypress.$autIframe.contents().find('body')
```

### Verify logs

```js
before() => {
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.spy(win.console, 'log').as('log')
  )

  it('logs message on startup', () => {
    cy.get('@log').should('have.been.calledOnceWithExactly', 'rendering app')
  )
```

### Bake
  
```js
// filter tests by title substring
Cypress.grep('hello world')
// run filtered tests 100 times
Cypress.grep('hello world', null, 100)
// filter tests by tag string
// in this case will run tests with tag @smoke OR @fast
Cypress.grep(null, '@smoke @fast')
// run tests tagged @smoke AND @fast
Cypress.grep(null, '@smoke+@fast')
// run tests with title containing "hello" and tag @smoke
Cypress.grep('hello', '@smoke')
// run tests with title containing "hello" and tag @smoke 10 times
Cypress.grep('hello', '@smoke', 10)
```

```shell
CYPRESS_grep='#stable' CYPRESS_burn=5 npx cypress run
```

### Env

Cypress.env() // 'CI', ...

### Asserting on logic from selectors

```js
it.only('adds numbers via aliases', () => {
  cy.visit('public/index.html')
  cy.get('[name=a]').invoke('val').then(parseIt).as('a')
  cy.get('[name=b]').invoke('val').then(parseIt).as('b')
  cy.get('#result')
    .invoke('text')
    .then(parseInt)
    .as('result')
    .then (function () {
      expect(this.a + this.b).to.eq(this.result)
    })
)
```

### Filtering tests

https://github.com/cypress-io/cypress-skip-test

```js
if (isOn('windows') && isOn('localhost')) { /* ... */ }
```
