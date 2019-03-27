# Cheatsheets
## Selectors
[](./assets/cheatsheet-selectors.md ':include')
## Cypress

### Useful links

* https://www.cypress.io
* https://docs.cypress.io
* https://docs.cypress.io/api/api/table-of-contents.html
* https://github.com/cypress-io
* https://github.com/cypress-io/cypress/issues

[](./assets/cheatsheet-cypress.md ':include')

### Best practices & Common Code reviews

#### General

Ask yourself: Will I understand this after a month?

#### Cookies
##### Cookies: Set them before `visit`

```js
cy.setCookie("cookie_consent", "agreed")
cy.visit("…")
```

#### Waiting
##### Prefer `.get` with longer timeout over `.wait`

```js
cy.visit("»some slow page«")

// Suboptimal
cy.wait(10 * 1000)
cy.get("…").click()

// Good
cy.get("…", { timeout: 14 * 1000 }).click()

// Also good
// Change defaultCommandTimeout in configuration to 14000
cy.get("…").click() 
```
##### Avoid chaining `.wait` as it could be confusing

```js
// Bad
cy.visit("some slow page")
cy.get("element load").wait(10000).click()
// This is actually not doing what it looks it's doing
// It's trying to find element with default timeout (4s), THEN waiting 10s, and THEN clicking
// So if the element won't be on the page in 4s, test will fail

// Better, if needed. But still prefer timeout
cy.visit("some slow page")
cy.wait(10000)
cy.get("element load").click()
```

#### Selecting & targeting

* **TODO**: Styled components, `Foo__StyledFoo_xyz`
* **TODO**: Selecting dynamic classes (invalid, touched, ...)

##### Don't use full generated classes

```js
// Bad
cy.get("[class='LanguageCurrent__Container-sc-1qu37au-0 ewtsmp']").click()

// Better
cy.get("[class=^'LanguageCurrent']").click()
```
##### Strive for descriptive selectors

```js
cy.get("[data-tkey='booking.global.agreement.text_new2']").check() // 😐
cy.get(".ReservationAgreement checkbox").check() // 🙏
```
##### Comment unclear selectors

```js
// Suboptimal
cy.get(".InsuranceOption:last").click()

// Good
cy.get(".InsuranceOption:last").click() // Select "Premium insurance"
```
##### Classes are fine as selectors when you use verbose naming methodology (like BEM)

```js
cy.get(".BookingPassengerEditSummaryInfo .BookingPassengerEditSummaryInfo-wrap-single._original")
// ==>
cy.get(".BookingPassengerEditSummaryInfo-wrap-single._original")
```

**Classical CSS**
```jade
.Hotels
  .Ad
    .Title
      .Actions
```

**BEM**
```jade
.Hotels-Ad-Title-actions
```
##### Avoid unnecessary `find`s
```js
cy
  .get(".SpecialAssistanceFormComponent")
  .find("button")
  .click()
// ==>
cy
  .get(".SpecialAssistanceFormComponent button")
  .click()
```
##### Avoid implementation details in selectors
```js
cy.get("[src='/images/flags/spFlag-cz.png']")
// ===>
cy.get("[src$='cz.png']")
```
##### Prefer using values over text content for translation independent tests
```html
<select name="gender">
  <option value="mr">Hombre</option>
  <option value="ms">Mujer</option>
</select>

<select name="birthMonth">
  <option value="01">Leden</option>
  <option value="02">Únor</option>
  <!-- ... -->
</select>
```

```js
// Suboptimal
cy.get("select[name='gender']").select("Hombre")
cy.get("select[name='birthMonth']").select("Leden")

// Good
cy.get("select[name='gender']").select("mr")
cy.get("select[name='birthMonth']").select("01")
```

#### Structuring
##### Consider lot of `it`s vs fewer `it`s

Few `**it**`s
```js
it("title", () => {
  cy.veryClearCommand()
  veryClearFunction()
  cy.log("comment what next command does")
  notSoDescriptiveFunction()
})
```

**Lot of `**it**`s**
```js
describe("title", () => {
  it("very clear description", () => {
    cy.veryClearCommand()
  })
  
  it("another very clear description", () => {
    cy.anotherVeryClearCommand()
  }) 
  
  it("description of not descriptive command", () => {
    cy.notSoDescriptive()
  }) 
})
```

##### Strive for both extensiveness and brevity
![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539180263216_image.png)
##### Be consistent when possible

```js
// Suboptimal
cy.get("[type=email]").type("test@example.com")
cy.get("[name='contact.phone']").type("123456789")

// Good
cy.get("[name='contact.email']").type("test@example.com")
cy.get("[name='contact.phone']").type("123456789")
```
##### Use hierarchical structure for tests
![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539243462974_image.png)
![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539244176381_image.png)
##### Open/load/visit the page in `before` hook, so it’s possible to add `.only` to `it`s
```js
// BAD
describe("Payment", () => {
  it("loads", () => {
    cy.visit()
  })
  it("checks something", () => { // .only not possible to add
    cy.get().click()
  })
})
    

// GOOD
describe("Payment", () => {
  before(() => {
    cy.visit()
  })
  it("checks something", () => { // .only possible to add
    cy.get().click()
  })
})
```
##### Prefer skipping to commenting

Commented code is not treated as code in editors and it will not be considered in linting / refactorings / searching for usages.

```js
function goToPayment() {
  cy.get(".Booking-dialog .Button").click()
}

it.skip("Something", () => {
  goToPayment() // Editor handles this
})

/*
it("Something", () => {
  goToPayment() // Editor does not handle this
})
*/
```

#### Clarity
##### Comment non-obvious

```js
// Suboptimal
cy.get("button").contains("Continue").click()
cy.get("button").contains("Continue").click()
cy.get("button").contains("Continue").click()

// Good
cy.get("button").contains("Continue").click() // Continue to "Shipping"
cy.get("button").contains("Continue").click() // Continue to "Overview"
cy.get("button").contains("Continue").click() // Continue to "Payment"
```

```js
// Suboptimal
cy.get("button").click().click()

// Good
cy.get("button").click().click() // Add two items
```
##### Comment non-standard
```js
// TODO: Explain
Cypress.on(
  "uncaught:exception",
  err => err.message.indexOf("Cannot set property 'aborted' of undefined") === -1,
)
```
##### Comment force usage

```js
cy.get("[name='cardExpirationYear']").type("20", { force: true }) // it's weirdly covered by ...
```
##### Prefer plain functions over Cypress commands

Prefer simple Javascript functions over Cypress commands.

**Use cypress commands only if:**

- chaining, and using subject returned from previous command
- chaining, and providing returned subject for next commands in chain
- 100% sure you want to extend `cy`

***otherwise, use simple javascript functions***

**Bad**

```
    // mmbCommands.js
    Cypress.Commands.add("mmbLoad", mock => {
      cy
        .visit(`/en/manage/123456789/${mock}?override_api=true}`)
        .get(".BookingHeader")
        .wait(500) // wait for ancilliaries api calls     
    })
    
    // some-tests-spec.js
    describe("MMB: Check-in", () => {
      before(() => {
        cy.mmbLoad("default:default")
      })
```

**Good**
```
// mmbCommands.js
export function load(mock) {
  cy
    .visit(`/en/manage/123456789/${mock}?override_api=true}`)
    .get(".BookingHeader")
    .wait(500) // wait for ancilliaries api calls 
}

// some-tests-spec.js
import * as mmbCommands from "./../mmbCommands"
describe("MMB: Check-in", () => {
  before(() => {
    mmbCommands.load("default:default")
  })
```

**Why?** Awesome support in IDE and static analysis! 

- [Find usages](http://take.ms/e95GS)
- [Go to definition](http://take.ms/5SFIz)
- [Quick definition](http://take.ms/OGQMW)
- [Highlight errors](http://take.ms/XQ5YN)
- + many others
##### Don’t overcomplicate things with unnecessary levels of abstractions
``` 
// Bad
Cypress.Commands.add("mmbIsAccountBookingListVisible", () => {
  cy.get(".AccountBookingList")
})
```
##### Readability > Prettier
![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539245406229_image.png)
##### Use `within` when appropriate
![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539256387889_image.png)

#### Unsorted (yet)
##### Simplify via afterEach
![](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1540207373888_image.png)
##### `should("exist")` is implicit after `get` or `find`
```js
cy.get(".navbar .logo").should("exist")
cy.get(".navbar").find(".logo").should("exist")
// is same as
cy.get(".navbar .logo")
cy.get(".navbar").find(".logo")
```
##### Use `{ }` when using arrow functions for tests

([Slack announcement](https://skypicker.slack.com/archives/C050XFGMN/p1542196373169200))
**Reasoning**
Without `{ }`, expression is implicitly returned. When returned value is promise-like (and almost all cypress commands are), Mocha switches to async mode and requires explicit completion (usually via `done()` callback)
Cypress is doing some behind-the-scenes magic to work even without `{ }`, but it's not standard and it's breaking other standardised, well behaved, tools (like test coverage)

**Example**
```js
// Bad, bad boy
it("some check", () =>
  cy.verySophisticatedCommand("Foo", "Whoo"))

// Good citizen
it("some check", () => {
  cy.verySophisticatedCommand("Foo", "Whoo"))
}
```

### Tips
#### Project initialization
[](assets/cypress/initialize.mp4 ':include :type=video width=100% controls')

#### Configuration

Commonly changed configuration options:

* **baseUrl**: default `null`, change to `http://localhost:8000` and use just relative URLs in `cy.visit("/en/...")`
* **defaultCommandTimeout**: default `4000` (4s), increase to at least `10000` (10s) for Kiwi.com 🐌
* **numTestsKeptInMemory**: default `50`, don't worry to increase to `200`
* **watchForFileChanges**: default `true`, set to `false` to disable auto reloading on file save

[](assets/cypress/config.mp4 ':include :type=video width=100% controls')
#### Selector playground: Finding simple selectors  

[](assets/cypress/selector-playground.mp4 ':include :type=video width=100% controls')
#### Selector playground: Finding complex selectors with DevTools

[](assets/cypress/selector-playground-with-devtools.mp4 ':include :type=video width=100% controls')
#### Selector playground: Narrowing selectors

[](assets/cypress/selector-playground-narrowing-selectors.mp4 ':include :type=video width=100% controls')
#### Pause and enter debugging on every failed test (requires open DevTools)

In file: `cypress/support/index.js`

```js
Cypress.on("fail", (err, runnable) => {
  debugger // eslint-disable-line no-debugger
  return err
})
```
#### VERY verbose Cypress logs in DevTools

In file: `cypress/support/index.js`

```js
win.localStorage.debug = "cypress:*"
```
#### Edit `baseUrl` in `cypress.json` to run Cypress on different "base url"
 
 ```text    
 Change from
 `baseUrl: "http://localhost:8000"` 
 to ie.
 `baseUrl: "https://www.kiwi.com"`
 ```
#### View tests in Webstorm
 
![Configuration](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1539337924527_image.png)

![](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1539337962809_image.png)

![](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1539341572272_ScreenFlow.gif)

### Recipes
#### Checking dimensions

[](assets/snippets.js ':include :type=code :fragment=checking-dimensions')
#### Counting elements
// TODO
#### Conditional interaction (e.g. clicking)

[](assets/snippets.js ':include :type=code :fragment=conditional-interaction')
#### Removing items from local storage
[](assets/snippets.js ':include :type=code :fragment=local-storage')
#### Wait until loader is gone
[](assets/snippets.js ':include :type=code :fragment=loader-gone')
#### Loops
```js
describe("Loops", () => {
  configs.forEach(config => {
    describe(`Currency: ${config.currency}`, () => {
      it("…", () => {
        cy.visit(`/?currency=${config.currency}`)
        // …
```
#### Window access
```js
cy
  .window()
  .then(win => {
    expect(
      win.reduxStore.getState().options.currency
    ).to.eq("czk")
  })
```
#### Forms
```
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
#### File upload
```
cy.fixture("image.jpg").then(file => {
  cy.get("form input[type=file]").then(fileInput => {
    const fileInputEl = fileInput.get(0)
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File([file], "image.jpg"))
    fileInputEl.files = dataTransfer.files
  })
})
```

### Other Tips
#### Searching for existing tests

Sadly, right now there’s no better way than full-text search

![](https://d2mxuefqeaa7sj.cloudfront.net/s_538AD2427C6DBB0588F3BF9F27A3292EFF30E80E476687873FF92850431B96E0_1539600402575_2018-10-15+12.46.17.gif)
#### Right panel is normal Chrome instance

→ you can open devtools, use debugger, profile etc.

- 💡 open devtools to see console errors & warnings (e.g. proptypes errors)
#### CLI 🤓 tips

**Run only specific file**
`cypress run --spec cypress/integration/booking/booking-misc-spec.js`   # or whatever folder with tests 

**Run only specific test**

![](https://d2mxuefqeaa7sj.cloudfront.net/s_D317328CC61B4B0230A436EC855EF2CEECD13A7B46566716908E3360329048E7_1493279194060_file.png)

## Others
### URL/URI structure
```
 https://       www.kiwi.com  /us/content/manage/1234 ?something=true
|- protocol -| |- hostname -| |- path              -| |- query --
```
