# Cheatsheet: Selectors

<small>ℹ️ Knowing these will be enough for 99% of use cases</small>

1. `#container` → everything with (attribute) id `container`
1. `.blue` → everything with (attribute) class `blue`
1. `.blue.big` → everything with (attribute) class `blue` and `big`
1. `button.primary` → `button`s with (attribute) class `primary`
1. `.sidebar button` → inside `.sidebar`, `button`s
1. `input[type=text]` → `input`s with attribute `type` of value `text`
1. `input[type=text]:first` → above, but just first
1. `input[type=text]:eq(0)` → same as above
1. `input[required]` → `input`s with attribute `required` (of any value)
1. `a[href^="https"]` → `a`s with attribute `href` starting with `https`
1. `a[href*="kiwi.com"]` → `a`s with attribute `href` containing `kiwi.com`
1. `img[src$=".gif"]` → `img`s with attribute `src` ending with `.gif`
1. `input:not(.touched)` → `input`s except those with (attribute) class `touched`
1. `input:not([required])` → `input`s except those with attribute `required` (of any value)
