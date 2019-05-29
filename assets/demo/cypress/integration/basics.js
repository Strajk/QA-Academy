describe("Cypress", () => {
  it("Basics", () => {
    cy.visit("https://example.cypress.io/commands/actions")

    cy.url().should("contain", "TODO")
    cy.title().should("include", "Kitchen Sink")
    cy.window().should("not.have.property", "__DEV__")

    // TODO: Should
    cy.get(".action-email").type("fake@email.com").type("{shift}{enter}")
    // TODO: Should

    cy.get(".action-email").clear()
    cy.get(".action-email").type("slow.typing@email.com", { delay: 100 })
    // cy.get(".action-disabled").type("disabled error checking") // will fail
    cy.get(".action-disabled").type("disabled error checking", { force: true })

    cy.get(".action-focus").focus()
      .should("have.class", "focus")
      .prev().should("have.attr", "style", "color: orange;")

    cy.get(".action-blur")
      .type("About to blur").blur()
      .should("have.class", "error")
      .prev().should("have.attr", "style", "color: red;")

    cy.get("button").contains("Submit").click()
    cy.get(".action-labels>.label").click({ multiple: true })

    cy.get(".action-checkboxes [type='checkbox']").not("[disabled]")
      .check()

    cy.screenshot("my-image", {
      blackout: [".sensitive"],
      capture: "viewport"
    })

    cy.get(".action-radios [type='radio']")
      .check("radio1").should("be.checked")

    cy.get(".action-select").select("apples")
  })

  it("Browser", () => {
    cy.visit("https://example.cypress.io/commands/aliasing")

    cy.get("#scroll-horizontal button").should("not.be.visible")
    cy.get("#scroll-horizontal button").scrollIntoView().should("be.visible")

    cy.scrollTo("bottom")

    cy.reload()

    cy.get("#scrollable-both").scrollTo("75%", "25%")

    cy.clock(new Date(Date.UTC(2017, 2, 14)).getTime())
    cy.visit("https://example.cypress.io/commands/spies-stubs-clocks")
    cy.get("#clock-div").click().should("have.text", "1489449600")

    cy.viewport("iphone-6")
    cy.screenshot("iphone-6")

    cy.viewport("ipad-mini", "landscape")
    cy.screenshot("ipad-mini")

  })

  it("Aliasing elements", () => {
    cy.visit("https://example.cypress.io/commands/aliasing")

    cy.get(".as-table").find("tbody>tr")
      .first().find("td").first()
      .find("button").as("firstBtn")

    // when we reference the alias, we place an
    // @ in front of its name
    cy.get("@firstBtn").click()

    cy.get("@firstBtn")
      .should("have.class", "btn-success")
  })

  it("Deep", () => {
    // cy.setCookie("foo", "bar")
    // cy.getCookie("foo").should("have.property", "value", "bar")

    cy.get(".trigger-input-range")
      .invoke("val", 25)
      .trigger("change")

    // Cypress.$
    // Cypress._
    // Cypress.moment
  })


  it("Network", () => {
    cy.visit("https://example.cypress.io/commands/aliasing")
    cy.server()
    cy.route("GET", "comments/*").as("getComment")

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get(".network-btn").click()

    // https://on.cypress.io/wait
    cy.wait("@getComment").its("status").should("eq", 200)

    cy.visit("https://example.cypress.io/commands/network-requests")

    cy.request("https://jsonplaceholder.cypress.io/comments")
      .its("body")
      .should("be.an", "array")
      .and("have.length", 1)
      .its("0") // yields first element of the array
      .should("contain", {
        postId: 1,
        id: 3,
      })


    // TODO: More from network requests
  })

})
