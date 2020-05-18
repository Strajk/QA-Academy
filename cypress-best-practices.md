# Cheatsheets: Cypress Best practices & Common Code reviews

## General

* Ask yourself: Will I understand this after a month?

#### Use Spellchecker

Although incorrect spelling is readable by humans,
it makes searching/filtering hard for computers.

##### Example

```js
it("Fliht transport is sucessfuly booked")
it("Flight transport is successfully booked")
```

When searching for `successful` or `flight`, first line will not be matched.

Spellchecking can be performed by:

* WebStorm (and other JetBrains products): natively
* VSCode: [Extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
* ESLint plugin

**🥝 Kiwi.com**: We enforce correct spellchecking via ESLint. Disable editor spellcheckers to get consistent behaviour.

Another nice side-effect of this rule is that it forbids using generated classes as selectors,
e.g. `.get(".TextLink__StyledTextLink-sc-1bvlje4-1")` will throw spell checking error
and nudges you to rewrite it to e.g. `.get("[class^=TextLink_]")`

## Cookies

#### Cookies: Set them before `visit`

```js
cy.setCookie("cookie_consent", "agreed")
cy.visit("…")
```

## Waiting

#### Prefer `.get` with longer timeout over `.wait`

```js
cy.visit("»some slow page«")

// Sub-optimal
cy.wait(10 * 1000)
cy.get("…").click()

// Good
cy.get("…", { timeout: 14 * 1000 }).click()

// Also good
// Change defaultCommandTimeout in configuration to 14000
cy.get("…").click()
```

#### Avoid chaining `.wait` as it could be confusing

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

## Selecting & targeting

* **TODO**: Styled components, `Foo__StyledFoo_xyz`
* **TODO**: Selecting dynamic classes (invalid, touched, ...)

#### Don't rely on generated classes

<details>

<summary>What are these weird "sc-bdVaJa cXeDc" classes?</summary>

Nowadays, it's common to generate CSS instead of manually writing it.

One of the most popular examples of this technique is [Styled components](https://styled-components.com/) (Used at Kiwi.com)

###### Developer writes

```text
const Box = styled.div`
  background: salmon;
  height: 100px
`
<Box />
```

###### Styled components output

```text
<div class="sc-bdVaJa cXeDcp"></div>
.cXeDcp {
  height: 100px;
  background: salmon;
}
```

This approach has many advantages (mostly out of scope for this explanation),
but comes at a *cost of mangled class names* obstructing selecting them in automation tools, like Cypress.

Fortunately, Styled components allows [setting](https://www.styled-components.com/docs/tooling#babel-plugin) of "nicer classes for debugging" and Kiwi.com's Orbit components are using it.

###### Nicer output, Orbit example

```text
<button class="Button__StyledButton-sc-1brqp3f-1 jPZlME">
```

This generated class as a whole will still change often (even every release), and therefore cannot be used as selector.

But the beginning of the class `Button_` will **stay the same and can be used.**

Playground for Styled components: <https://jsbin.com/mizijaz/edit?html,output>

</details>

```js
// Bad
cy.get("[class='BookingSeat__Container-sc-1qu37au-0 ewtsmp']").click()

// Good
cy.get("[class^='BookingSeat_']").click() // ^= means "starts with"
```

**⚠️ Beware:** Trailing `_` is very important

###### Given

```html
<div class="BookingSeating__Container-xyz123">
  <div class="BookingSeat__Container-xyz123"></div>
</div>
```

```js
cy.get("[class^='BookingSeat']") // 🔴 This will select BookingSeating
cy.get("[class^='BookingSeat_']") // ✅ This will select BookingSeat
```

**⚠️ Beware:** It's not possible to use "starts with" operator `^=` with shorter dot syntax `.` for selecting classes.

```js
// This will not work!!!
cy.get(".^PaymentButton_']").click()
```

#### Strive for descriptive selectors

```js
cy.get("[data-tkey='booking.global.agreement.text_new2']").check() // 😐
cy.get(".ReservationAgreement checkbox").check() // 🙏
```

#### Explain unclear selectors

```js
// Suboptimal
cy.get(".InsuranceOption:last").click()

// Good
cy.get(".InsuranceOption:last").click() // Select "Premium insurance"
```

#### Classes are fine as selectors when you use verbose naming methodology (like BEM)

```js
cy.get(".BookingPassengerEditSummaryInfo .BookingPassengerEditSummaryInfo-wrap-single._original")
// ==>
cy.get(".BookingPassengerEditSummaryInfo-wrap-single._original")
```

###### Classical CSS

```css
.Hotels .Ad .Title .Actions {}
```

###### BEM

```css
.Hotels-Ad-Title-Actions {}
```

#### Avoid unnecessary `find`s

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

#### Avoid implementation details in selectors

```js
cy.get("[src='/images/flags/spFlag-cz.png']")
// ===>
cy.get("[src$='cz.png']")
```

#### Keep selectors consistent

###### Given

```html
<div class="PaymentFormCard">
  <input
    type="text"
    name="payment.card.number"
    autocomplete="cc-number"
    data-test="payment-cc-number-input"
  />
  <!-- … more inputs -->
</div>
```

```js
cy.get(".PaymentFormCard [autocomplete='cc-number']").type("...")
cy.get("input[name='payment.card.number']").type("...")
cy.get("[data-test='payment-cc-number-input']").type("...")
```

All are valid and acceptable selectors, but for clarify, choose one and stick to it.

---

Another example

```js
// Suboptimal
cy.get("[type=email]").type("test@example.com")
cy.get("[name='contact.phone']").type("123456789")

// Good
cy.get("[name='contact.email']").type("test@example.com")
cy.get("[name='contact.phone']").type("123456789")
```

#### Prefer using values over text content for translation independent tests

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
// Sub-optimal
cy.get("select[name='gender']").select("Hombre")
cy.get("select[name='birthMonth']").select("Leden")

// Good
cy.get("select[name='gender']").select("mr")
cy.get("select[name='birthMonth']").select("01")
```

## Structuring

#### Consider lot of `it`s vs fewer `it`s

Few `it`s

```js
it("title", () => {
  cy.veryClearCommand()
  veryClearFunction()
  cy.log("comment what next command does")
  notSoDescriptiveFunction()
})
```

**Lot of `it`s**

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

#### Strive for both extensiveness and brevity

![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539180263216_image.png)

#### Use hierarchical structure for tests

![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539243462974_image.png)
![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539244176381_image.png)

#### Open/load/visit the page in `before` hook, so it’s possible to add `.only` to `it`s

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

#### Prefer skipping to commenting

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

## Clarity

#### Focus on the feature under test

In order to keep tests clean and succinct, focus on the feature under the test
and prepare your environment is such a way it doesn't interfere much with outside world.

```js
describe("Auth", () => {
  before(() => {
    cy.setCookie("cookie_consent", "agreed")
    cy.setCookie("newsletter_prompt", "hide")
    cy.setCookie("native_app_banner", "hide")
    cy.visit("…")
  })
  it("Signup", () => { /* ... */ })
  it("Login with credentials", () => { /* ... */ })
  it("Login with Facebook", () => { /* ... */ })
  it("Login with Google", () => { /* ... */ })
  it("Forget password", () => { /* ... */ })
  // ...
})
```

If integration with other features is important, cover it separately.

```js
describe("Auth: integration with other components", () => {
  it("Integration with Cookie consent", () => { /* ... */ })
  it("Integration with Sidebar", () => { /* ... */ })
  it("Integration with Native app banner", () => { /* ... */ })
  // ...
})
```

#### Explain non-obvious

```js
// Suboptimal
cy.get("button").contains("Continue").click()
cy.get("button").contains("Continue").click()
cy.get("button").contains("Continue").click()

// Good
cy.get("button").contains("Continue").click() // Continue to "Shipping"
cy.get("button").contains("Continue").click() // Continue to "Overview"
cy.get("button").contains("Continue").click() // Continue to "Payment"

// Perfect - will be shown also in Cypress UI
cy.log("Continue to 'Shipping'")
cy.get("button").contains("Continue").click()

cy.log("Continue to 'Overview'")
cy.get("button").contains("Continue").click()

cy.log("Continue to 'Payment'")
cy.get("button").contains("Continue").click()
```

```js
// Suboptimal
cy.get("button").click().click()

// Good
cy.get("button").click().click() // Add two items
```

#### Explain non-standard

```js
// TODO: Explain
Cypress.on(
  "uncaught:exception",
  err => err.message.indexOf("Cannot set property 'aborted' of undefined") === -1
)
```

#### Explain force usage

```js
cy.get("[name='cardExpirationYear']").type("20", { force: true }) // it's weirdly covered by ...
```

#### Explain skipping tests

```js
describe.skip("…", () => {}) // Disabled due to flakiness // TODO: Solve it and un-skip

it.skip("…", () => {}) // Feature is temporarily disabled, un-skip when enabled
```

#### Prefer plain functions over Cypress commands

Prefer simple Javascript functions over Cypress commands.

**Use cypress commands only if:**

* chaining, and using subject returned from previous command
* chaining, and providing returned subject for next commands in chain
* 100% sure you want to extend `cy`

***otherwise, use simple javascript functions***

Also see official Cypress recommendation: [Don’t make everything a custom command](https://docs.cypress.io/api/cypress-api/custom-commands.html#Best-Practices)

Bad

```js
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
})
```

Good

```js
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
})
```

**Why?** Awesome support in IDE and static analysis!

* [Find usages](http://take.ms/e95GS)
* [Go to definition](http://take.ms/5SFIz)
* [Quick definition](http://take.ms/OGQMW)
* [Highlight errors](http://take.ms/XQ5YN)
* ...many others

#### Don’t overcomplicate things with unnecessary levels of abstractions

```js
// Bad
function mmbIsAccountBookingListVisible() {
  cy.get(".AccountBookingList")
}
```

```js
// Bad
Cypress.Commands.add("haveLength", (elements, length) => {
  expect(elements.length).to.equal(length)
})
cy.get("something").haveLength(3)

// Good
cy.get("something").should("have.length", 3)
````

#### Readability > Prettier

![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539245406229_image.png)

#### Use `within` when appropriate

![](https://d2mxuefqeaa7sj.cloudfront.net/s_7F57A7A8D35FC5303BAC42EE7925F708AE045380DF4F28A8656DA8AF91080EA4_1539256387889_image.png)

#### Use invoke if possible to avoid accessing elements directly

```js
// Sub-optimal
cy.get("input[name=firstName]")
  .then($input => {
    expect($input.val()).to.contain("Test")
  })

// Better
cy.get("input[name=firstName]").invoke("val").should("contain", "Test")
```

#### Use `multiple: true` for clicking/checking on more elements

```js
// Sub-optimal
cy.get("input[type='checkbox'][required]").each($el => { // T&C, GDPR and Adult checkboxes
  $el.click()
})

// Better
cy.get("input[type='checkbox'][required]").click({ multiple: true }) // T&C, GDPR and Adult checkboxes
```

#### Assert on multiple elements instead of iterating over them  

```js
// Sub-optimal
cy.get("input").each($el => {
  cy.wrap($el).should("have.class", "_disabled")
})

// Better, simpler
cy.get("input").should("have.class", "_disabled")
```

## Unsorted (yet)

#### Simplify via afterEach

![](https://d2mxuefqeaa7sj.cloudfront.net/s_77ECE64E7E3CF5A437BDA620719F63E668BE8780F72118332B3499A67B8F19BB_1540207373888_image.png)

#### `should("exist")` is implicit after `get` or `find`

```js
cy.get(".navbar .logo").should("exist")
cy.get(".navbar").find(".logo").should("exist")
// is same as
cy.get(".navbar .logo")
cy.get(".navbar").find(".logo")
```

#### Use `{ }` when using arrow functions for tests

([Slack announcement](https://skypicker.slack.com/archives/C050XFGMN/p1542196373169200))
**Reasoning**
Without `{ }`, expression is implicitly returned.
When returned value is promise-like (and almost all cypress commands are),
Mocha switches to async mode and requires explicit completion
(usually via `done()` callback)
Cypress is doing some behind-the-scenes magic to work even without `{ }`,
but it's not standard and
it's breaking other standardised, well behaved, tools (like test coverage)

Example

```js
// Bad, bad boy
it("some check", () =>
  cy.verySophisticatedCommand("Foo", "Whoo"))

// Good citizen
it("some check", () => {
  cy.verySophisticatedCommand("Foo", "Whoo")
})
```

#### Smart defaults

##### Hide ubiquitous, insignificant elements by default

Examples: Cookie consent banner, chat, newsletter popup, promo modal, ...

Why?

* Less complexity & noise while authoring and debugging tests
* Less complexity & noise in reports (screenshots, videos) and visual testing

Considered disadvantages:

* Less confidence in tests, as mentioned elements could really break something. But this is negligible to all the benefits.  

##### Example

```js
Cypress.Commands.overwrite("visit", (original, url, opts = {}) => {
  cy.setCookie("cookie_consent", "agreed")
  // …
  original(url, opts)
})
```

Side effect of this best practice is that it partially omits need to setting cookies in beforeEach blocks, which was common source of confusion and hard-to-debug bugs.  

```js
describe("…", () => {
  beforeEach(() => {
    cy.setCookie("cookie_consent", "agreed") // execution order: 2
  })
  
  describe("…", () => {
    before(() => {
      cy.visit("…") // execution order: 1
    })

    it("…", () => {
      cy.get("…").should("…") // execution order: 3
    })
  })
})
```
