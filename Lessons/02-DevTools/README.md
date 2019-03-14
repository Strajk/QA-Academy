# DevTools

## Prerequisites

* Curious mind
  * https://www.goodreads.com/book/show/35167685-surely-you-re-joking-mr-feynman  

## Motivation

**Edit Instagram followers**

![](assets/instagram.png)  

**Download "protected" photo from Instagram**

![](assets/instagram-download.png)
  
**Get around Pinterest Sign-up modal**

![](assets/pinterest.gif)

**Inspect image titles on Facebook**

![](assets/facebook.png)

**Inspect & adjust Network requests, avoid client side validation**

![](assets/kiwi.png)

**XSS Story**

Cannot be published online :troll:

## Workshop

### HTML, CSS

* [htmlreference.io](https://htmlreference.io/)
* [cssreference.io](https://cssreference.io/)

Playground https://codepen.io/Strajk/pen/VRpzMp?editors=1100

Play https://flukeout.github.io/

### DevTools

* Explore Cypress homepage through DevTools
* Explore Kiwi.com homepage, explain complexity
* Explore Google Flights, explain complexity
* Quickly show DevTools in other browsers

#### Resources
* [Get Started With Viewing And Changing The DOM](https://developers.google.com/web/tools/chrome-devtools/dom/#appendix) by Google Developers


### Play

[Stylish](https://chrome.google.com/webstore/detail/stylish-custom-themes-for/fjnbnpbmkenffdnngjfgmeleoegfcffe) -> Kiwi.com rotate logo    
  

## Follow up

Use DevTools to fake something and paste screenshot to our Slack channel.

**Be creative**


## Cheatsheet

### Examples
<small>ℹ️ Knowing these will be enough for 99% of use cases</small>

`#container` → everything with id `container`
`.blue` → everything with class containing `blue`
`.blue.big` → everything with class containing `blue` and `big`
`button.primary` → `button`s with class containing `primary`
`.sidebar button` → inside `.sidebar`, `button`s 
`input[type=text]` → `input`s with attribute `type` of value `text`
`input[type=text]:first` → above, but just first
`input[type=text]:eq(0)` → same as above
`input[required]` → `input`s with attribute `required` (of any value)
`a[href^="https"]` → `a`s with attribute `href` starting with `https`
`a[href*="kiwi.com"]` → `a`s with attribute `href` containing `kiwi.com`
`img[src$=".gif"]` → `img`s with attribute `src` ending with `.gif`
`input:not(.touched)` → `input`s except those with class containing `touched`
`input:not([required])` → `input`s except those with attribute `required` (of any value)

### Theory
[W3schools CSS Selectors reference](https://www.w3schools.com/cssref/css_selectors.asp)

---

## CSS for rotating logo

```
[data-test="Logo"] {
    animation: spin 1s linear infinite;
}

@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
``` 
