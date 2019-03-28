# Cheatsheets: Cypress: Recipes

### Project initialization

[](assets/cypress/initialize.mp4 ':include :type=video width=100% controls')

### Configuration

Commonly changed configuration options:

* **baseUrl**: default `null`, change to `http://localhost:8000` and use just relative URLs in `cy.visit("/en/...")`
* **defaultCommandTimeout**: default `4000` (4s), increase to at least `10000` (10s) for Kiwi.com 🐌
* **numTestsKeptInMemory**: default `50`, don't worry to increase to `200`
* **watchForFileChanges**: default `true`, set to `false` to disable auto reloading on file save

[](assets/cypress/config.mp4 ':include :type=video width=100% controls')

### Selector playground: Finding simple selectors  

[](assets/cypress/selector-playground.mp4 ':include :type=video width=100% controls')

### Selector playground: Finding complex selectors with DevTools

[](assets/cypress/selector-playground-with-devtools.mp4 ':include :type=video width=100% controls')

### Selector playground: Narrowing selectors

[](assets/cypress/selector-playground-narrowing-selectors.mp4 ':include :type=video width=100% controls')

### Pause and enter debugging on every failed test (requires open DevTools)

In file: `cypress/support/index.js`

```js
Cypress.on("fail", (err, runnable) => {
  debugger // eslint-disable-line no-debugger
  return err
})
```

### VERY verbose Cypress logs in DevTools

In file: `cypress/support/index.js`

```js
win.localStorage.debug = "cypress:*"
```

### Edit `baseUrl` in `cypress.json` to run Cypress on different "base url"

```text
Change from
`baseUrl: "http://localhost:8000"`
to ie.
`baseUrl: "https://www.kiwi.com"`
```

### View tests in Webstorm

![Configuration](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1539337924527_image.png)

![](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1539337962809_image.png)

![](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1539341572272_ScreenFlow.gif)


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

```
cy.visit("")
cy.get(".Loader").should("not.exist", { timeout: 15 * 1000 })
```

### Loops

```js
describe("Loops", () => {
  configs.forEach(config => {
    describe(`Currency: ${config.currency}`, () => {
      it("…", () => {
        cy.visit(`/?currency=${config.currency}`)
        // …
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
cy.get("…").type("slow.typing", {delay: 100})

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
