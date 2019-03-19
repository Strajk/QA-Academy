describe("Search -> Booking -> Manage my booking", () => {
  before(() => {
    cy.setCookie("cookie_consent", "agreed")
    cy.visit("https://www.kiwi.com")
  })

  it("should work", () => {
    // Search
    // ===
    cy.get("[data-test='PictureCard']:eq(1)").click()
    cy.get("[data-test='Journey-toggle']:eq(0)").click()
    cy.get("[data-test='JourneyBookingButton']").click()


    // Booking
    // ===
    // Passenger
    cy.get("[data-test='ReservationPassenger-FirstName'] input").type("Test")
    cy.get("[data-test='ReservationPassenger-LastName'] input").type("Test")
    cy.get("[data-test='ReservationPassenger-nationality']").select("Afghanistan")
    cy.get("[data-test='ReservationPassengerGender'] select").select("Male")
    cy.get("[name='passengers[0].birthDay']").type("3")
    cy.get("[name='passengers[0].birthMonth']").select("May")
    cy.get("[name='passengers[0].birthYear']").type("1991")
    cy.get("[data-test='ReservationPassengerInsurance-content-insurance-type']:last").click()

    // Contact
    cy.get("[name='contact.email']").type("test@kiwi.com")
    cy.get("[name='contact.phone']").type("0000")

    // Payment
    cy.get("[name='payment.cardNumber']").type("0000")
    // TODO: Continue
  })
})
