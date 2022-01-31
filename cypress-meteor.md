# Cheatsheets: Cypress: Meteor

## Check Meteor.call

```js
// Create spy
cy.window().then((win) => cy.spy(win.Meteor, 'call').as('meteorCall'));

// … do something that calls Meteor.call()

cy.get('@meteorCall').should(
  'be.calledWith',
  'someMethodName',
  Cypress.sinon.match({
    userId: Cypress.sinon.string,
    amount: 14,
    status: 'PAID',
    createdAt: new Date('2022-01-06T00:00:00.000Z'),
    billingInfo: {
      fullName: 'Joe Doe',
    },
  }),
)

// Reset spy
// I haven't found a way to make it work with cy.get('@meteorCall').invoke('resetHistory')
cy.window().then((win) => cy.spy(win.Meteor, 'call').as('meteorCall'));

// … do something else

cy.get('@meteorCall').should(
  'be.calledWith',
  'someMethodName',
  { /* ... */}
)
```
