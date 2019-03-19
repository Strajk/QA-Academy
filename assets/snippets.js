/// [conditional-interaction]
cy.get("…")
  .then($el => {
    if ($el.is(":visible")) {
      cy.wrap($el).click() // TODO: Verify
    }
  })
/// [conditional-interaction]


/// [local-storage]
Cypress.Commands.add("logout", () => {
  return cy
    .window()
    .its("localStorage")
    .invoke("removeItem", "token")
})
/// [local-storage]


/// [checking-dimensions]
cy.get("…").invoke("width").should("be.greaterThan", 100) // TODO: Verify
cy.get("…").its("clientWidth").should("be.greaterThan", 100)
/// [checking-dimensions]


/// [loader-gone]
cy.visit("")
cy.get(".Loader").should("not.exist", { timeout: 15 * 1000 })
/// [loader-gone]
