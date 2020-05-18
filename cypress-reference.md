# Cheatsheets: Cypress Reference

### Navigating

* ️[**setCookie**](https://docs.cypress.io/api/commands/setcookie.html)
  * `cy.setCookie("cookie_consent", "agreed")`
* [**visit**](https://docs.cypress.io/api/commands/visit.html)
  * `cy.visit("https://www.kiwi.com")` - absolute
  * `cy.visit("/account/login")` – relative, will use baseUrl from `cypress.json` config
* [go](https://docs.cypress.io/api/commands/go.html)
  * `cy.go("back") / cy.go("forward")`, same as `cy.go(-1) / cy.go(1)`
* [reload](https://docs.cypress.io/api/commands/reload.html)
  * `cy.reload()`

### Selecting

* ️[**get**](https://docs.cypress.io/api/commands/get.html)
  * `cy.get("h1.title")` / `cy.get("[data-test='uniqueSelectorJustForTests']")`
  * `cy.get("#todos").as("todos") …then… cy.get("@todos")`
* [**️contains**](https://docs.cypress.io/api/commands/contains.html)
  * `cy.contains("Register")`
  * `cy.get("button").contains("Submit")`
* [focused](https://docs.cypress.io/api/commands/focused.html)
  * `cy.focused()`

### Asserting/Expecting

* [**should**](https://docs.cypress.io/api/commands/should.html)
  * `cy.get(…).should("have.class", "active")`
  * `cy.get(…).should("have.length", 5)`
  * `cy.get(…).should("be.disabled")`
  * `cy.get(…).should("contain", "Joe")`
  * `cy.get(…).should("not.contain", "Joe")`

➡️ [**List of Assertions**](https://docs.cypress.io/guides/references/assertions.html#BDD-Assertions) ⬅️

### Interaction

* [**click**](https://docs.cypress.io/api/commands/click.html) & [dblclick](https://docs.cypress.io/api/commands/dblclick.html)
  * `cy.get(»selector«).click()`
  * `cy.get(»selector matching multiple elements«).click({ multiple: true })` – use with caution!
  * `cy.get(»selector matching element which is hidden«).click({ force: true })` – use with caution!
* [**type**](https://docs.cypress.io/api/commands/type.html) & [clear](https://docs.cypress.io/api/commands/clear.html)
  * `cy.get(»input«).type("Brno")`
  * `cy.get(»input«).type("Br{downarrow}{enter}")` – e.g. testing autocomplete
  * `cy.get(»input«).type("Slow typing", { delay: 1000 })` – use only when necessary
  * `cy.get(»input with some text already«).clear().type("New value")`
* [**check**](https://docs.cypress.io/api/commands/check.html) & [**uncheck**](https://docs.cypress.io/api/commands/uncheck.html)
  * `cy.get(»terms&conditions checkbox«).check()`
* [**select**](https://docs.cypress.io/api/commands/select.html)
  * `cy.get(»nationality«).select("cz")`
* [focus](https://docs.cypress.io/api/commands/focus.html) & [blur](https://docs.cypress.io/api/commands/blur.html)
  * `cy.get(»input«).focus().should("have.class", "active")`
  * `cy.get(»input«).type("joe@gmail").blur().should("have.class", "invalid")`
* [submit](https://docs.cypress.io/api/commands/submit.html)
  * `cy.get(»form«).submit()`
  * 🐨 some people prefer clicking on submit button / pressing "Enter" instead

### Viewport

* [**viewport**](https://docs.cypress.io/api/commands/viewport.html)
  * `cy.viewport(1280, 1024)`
  * `cy.viewport("macbook-15")`
  * `cy.viewport("iphone-5", "portrait")`
* [scrollIntoView](https://docs.cypress.io/api/commands/scrollintoview.html)
  * `cy.get("footer").scrollIntoView()`
* [scrollTo](https://docs.cypress.io/api/commands/scrollto.html)
  * `cy.scrollTo(0, 500)` – `x/right`, `y/down`
  * `cy.get(»sidebar«).scrollTo("bottom")`

### Utils

* [**wait**](https://docs.cypress.io/api/commands/wait.html) – milliseconds!
  * `cy.wait(5000)` – use only when necessarily
* [screenshot](https://docs.cypress.io/api/commands/screenshot.html)
  * `cy.screenshot()` – automatic filename from test filename and test suite structure
  * `cy.screenshot(»filename«)`

### Debugging 🛠

* [**log**](https://docs.cypress.io/api/commands/log.html)
  * `cy.log("Message for humans")`
* [debug](https://docs.cypress.io/api/commands/debug.html) & [pause](https://docs.cypress.io/api/commands/pause.html)

### Interaction programmatically 🤖 `TODO: Later`

* [invoke](https://docs.cypress.io/api/commands/invoke.html) - function
* [its](https://docs.cypress.io/api/commands/its.html) - property
* [then](https://docs.cypress.io/api/commands/then.html)
* [trigger](https://docs.cypress.io/api/commands/trigger.html)
* [each](https://docs.cypress.io/api/commands/each.html)

### Environment 🤖 `TODO: Later`

* [location](https://docs.cypress.io/api/commands/location.html)
* [hash](https://docs.cypress.io/api/commands/hash.html)
* [title](https://docs.cypress.io/api/commands/title.html)
* [url](https://docs.cypress.io/api/commands/url.html)

### Mocking 🌍 `TODO: Later`

* [fixture](https://docs.cypress.io/api/commands/fixture.html)
* [server](https://docs.cypress.io/api/commands/server.html)
* [spy](https://docs.cypress.io/api/commands/spy.html)
* [stub](https://docs.cypress.io/api/commands/stub.html)
* [request](https://docs.cypress.io/api/commands/request.html)
* [route](https://docs.cypress.io/api/commands/route.html)

### More selectors 🙈

<details>
<summary>⚠️ Prefer selectors directly inside <code>cy.get(»selector«)</code></summary>

| 😐                                    | 🤩                                |
| ------------------------------------- | --------------------------------- |
| `cy.get("button").first()`            | `cy.get("button:first")`          |
| `cy.get("button").eq(3)`              | `cy.get("button:eq(3)")`          |
| `cy.get("button").not(".unwanted")`   | `cy.get("button:not(.unwanted)")` |
| `cy.get("»modal«").find(»close btn«)` | `cy.get("»modal« »close btn«")`   |
| `cy.get("tr").filter(".odd")`         | `cy.get("tr.odd")`                |

* [first](https://docs.cypress.io/api/commands/first.html) & [last](https://docs.cypress.io/api/commands/last.html) & [eq](https://docs.cypress.io/api/commands/eq.html)
* [filter](https://docs.cypress.io/api/commands/filter.html)
* [not](https://docs.cypress.io/api/commands/not.html)
* [find](https://docs.cypress.io/api/commands/find.html)
* [closest](https://docs.cypress.io/api/commands/closest.html)
* [parent](https://docs.cypress.io/api/commands/parent.html)
* [parents](https://docs.cypress.io/api/commands/parents.html)
* [parentsUntil](https://docs.cypress.io/api/commands/parentsuntil.html)
* [children](https://docs.cypress.io/api/commands/children.html)
* [siblings](https://docs.cypress.io/api/commands/siblings.html)
* [prev](https://docs.cypress.io/api/commands/prev.html)/[prevAll](https://docs.cypress.io/api/commands/prevall.html)/[prevUntil](https://docs.cypress.io/api/commands/prevuntil.html) & [next](https://docs.cypress.io/api/commands/next.html)/[nextAll](https://docs.cypress.io/api/commands/nextall.html)/[nextUntil](https://docs.cypress.io/api/commands/nextuntil.html)

</details>
