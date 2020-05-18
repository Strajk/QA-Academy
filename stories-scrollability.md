# Checking element scroll-ability

🤔 How to check if element is scrollable?

#### Solution A: Expecting fail on scrollTo

Cypress has [`scrollTo`](https://docs.cypress.io/api/commands/scrollto.html) command, which will fail if called on non-scrollable element.

```js
it("Foo should not be scrollable", (done) => {
  cy.viewport("640", "320")
  cy.visit("…")
  cy.on("fail", err => {
    expect(err.message).to.include("not scrollable")
    done()
    return false // return false to prevent the error from failing this test
  })
  
  cy.get(".Foo").scrollTo(999, 0, { timeout: 250 })
  // 999 is arbitrary number
  // Timeout 250 is there to override defaultCommandTimeout, otherwise test would take much longer
})
```

#### Solution B: Comparing element dimension attributes

Elements have
[`clientWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth) and
[`scrollWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth) properties.
When both are equal, it should mean that element has no reason be scrollable.

```js
it("Foo should not be scrollable", () => {
  cy.viewport("640", "320")
  cy.visit("…")
  
  // Solution B1
  cy.get(".Foo").its("0.clientWidth").then(clientWidth => {
    cy.get(".Foo").its("0.scrollWidth").then(scrollWidth => {
      expect(clientWidth).to.equal(scrollWidth)
    })
  })
  
  // Solution B2
  cy.get("#non-scrollable").then($elements => {
    const $element = $elements[0]
    const clientWidth = $element.clientWidth
    const scrollWidth = $element.scrollWidth
    expect(clientWidth).to.equal(scrollWidth)
  })
})
```

#### Solution C, D, E

Cypress is just JavaScript, there's infinite amount of solutions. Propose yours!

---

**Solutions can be examined and run [here](https://github.com/Strajk/QA-Academy/tree/master/assets/stories/scrollability)**
