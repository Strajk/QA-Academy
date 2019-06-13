describe("Main", () => {
  it("should work", () => {
    cy.visit("https://example.cypress.io")
    cy.log("Data loaded from .env file: " + Cypress.env("SOME_DATA"))
  })
})
