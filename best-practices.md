# Best practices & Common Code reviews

#### ⚠️ Always set cookies before visit

```js
cy.setCookie("cookie_consent", "agreed")
cy.visit("…")
```


#### Don't use generated classes for selecting
```js
// Bad
cy.get("[class='LanguageCurrent__Container-sc-1qu37au-0 ewtsmp']").click()

// Better
cy.get("[class=^'LanguageCurrent']").click()
```

#### Prefer `.get` with longer timeout over `.wait`

```js
cy.visit("»some slow page«")

// Suboptimal
cy.wait(10 * 1000)
cy.get("…").click()

// Good
cy.get("…", { timeout: 14 * 1000 }).click()

// Also good
// Change defaultCommandTimeout in configuration to 14000
cy.get("…").click() 
```
 
#### Prefer using values over text content for translation independent tests

```html
<select name="gender">
  <option value="mr">Hombre</option>
  <option value="ms">Mujer</option>
</select>

<select name="birthMonth">
  <option value="01">Leden</option>
  <option value="02">Únor</option>
  <!-- ... -->
</select>
```

```js
// Suboptimal
cy.get("select[name='gender']").select("Hombre")
cy.get("select[name='birthMonth']").select("Leden")

// Good
cy.get("select[name='gender']").select("mr")
cy.get("select[name='birthMonth']").select("01")
```

#### Use self descriptive selectors

```js
cy.get('[data-tkey="booking.global.agreement.text_new2"]').check() // 😐
cy.get('.ReservationAgreement checkbox') // 🙏
```

#### Use comments to clarify selectors

```js
// Suboptimal
cy.get(".InsuranceOption:last").click()

// Good
cy.get(".InsuranceOption:last").click() // Select "Premium insurance"
```

#### Use comments to clarify actions

```js
// Suboptimal
cy.get("button").contains("Continue").click()
cy.get("button").contains("Continue").click()
cy.get("button").contains("Continue").click()

// Good
cy.get("button").contains("Continue").click() // Continue to "Shipping"
cy.get("button").contains("Continue").click() // Continue to "Overview"
cy.get("button").contains("Continue").click() // Continue to "Payment"
```

```js
// Suboptimal
cy.get("button").click().click()

// Good
cy.get("button").click().click() // Add two items
```

#### Always comment force usage

```
cy.get("[name='cardExpirationYear']").type('20', { force: true }) // it's weirdly covered by ...
```

#### Be consistent when possible

```js
// Suboptimal
cy.get("[type=email]").type("test@example.com")
cy.get("[name='contact.phone']").type("123456789")

// Good
cy.get("[name='contact.email']").type("test@example.com")
cy.get("[name='contact.phone']").type("123456789")
```
