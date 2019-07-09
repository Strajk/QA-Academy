context("QA Academy", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("open all pages and check if there are no errors", () => {
    const selector = ".sidebar-nav > ul > li > a"

    cy.get(selector)
      .each(($el, index) => {
        cy.get(selector + `:eq(${index})`).click()
        cy.wait(1000)
        cy.get(".content h1").should("be.visible")
        cy.screenshot($el.text(), {
          capture: "viewport" // Cypress is really struggling to capture full page - it's total mess
        })
      })
  })
})
