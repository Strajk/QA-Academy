describe("Actions", () => {
  before(() => {
    cy.visit("https://kiwi-gifts.skypicker.com/gifts")
  })

  it("happy path", () => {
    cy.get(".shop-button").click()
    cy.get(".right > .voucher-image").click({ force:true })

    // Checkout
    // ===
    cy.get("[type=number]:eq(0)").clear().type("100")
    cy.get("[type=email]:eq(0)").type("test@kiwi.com")
    // TODO: Consider placeholder
    cy.get("[type=text]:eq(0)").type("Evzen")
    cy.get("[type=text]:eq(1)").type("Savojsky")
    cy.get(".terms-and-conditions").click() // link to T&C, not checkbox
    cy.url().should("include", "/gifts/terms")
    cy.go("back")

    // TODO: Consider filing bug report that we have to re-check checkbox
    cy.get(".checkbox-text:first").click()

    // Payment form
    // ===
    cy.get("kiwi-card[heading=Payment] [type=number]:eq(1)").type("4111 1111 1111 1111")
    cy.get("kiwi-card[heading=Payment] [type=number]:eq(2)").type("01")
    cy.get("kiwi-card[heading=Payment] [type=number]:eq(3)").type("20")
    cy.get("kiwi-card[heading=Payment] [type=number]:eq(4)").type("123")
    cy.get("kiwi-card[heading=Payment] [type=text]").type("TEST")

    // Delivery
    // ===
    cy.get("[type=email]:eq(1)").type("evzen@kiwi.com")
    cy.get(".purchase-button").click()
  })
})
