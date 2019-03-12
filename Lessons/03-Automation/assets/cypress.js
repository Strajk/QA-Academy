describe("Slack Robot", () => {
  before(() => {
    cy.visit("»address«")
  })

  it("should login to Slack and post funny message to channel", () => {
    cy.get("»input selector«").type("»value«").should("have.value", "»value«")

    cy.get("»button selector«").click()

    cy.get("»selector").contains("»channel name«").click({ force: true })

    cy.wait("»ms«")

    cy.get("»input selector«").focus().clear().type("»message«{enter}")
  })
})
