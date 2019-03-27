describe("Main", () => {
  it("Via expected fail", (done) => {
    cy.visit("https://output.jsbin.com/qekekem/quiet")
    cy.on("fail", err => {
      expect(err.message).to.include("not scrollable")
      done()
      return false // return false to prevent the error from failing this test
    })
    cy.get("#non-scrollable").scrollTo(999, 0, { timeout: 250 })
  })

  it.only("Via attributes", () => {
    cy.visit("https://output.jsbin.com/qekekem/quiet")
    cy.get("#non-scrollable").its("0.clientWidth").then(clientWidth => {
      cy.get("#non-scrollable").its("0.scrollWidth").then(scrollWidth => {
        expect(clientWidth).to.equal(scrollWidth)
      })
    })

    cy.get("#non-scrollable").then($elements => {
      const $element = $elements[0]
      const clientWidth = $element.clientWidth
      const scrollWidth = $element.scrollWidth
      expect(clientWidth).to.equal(scrollWidth)
    })
  })
})
