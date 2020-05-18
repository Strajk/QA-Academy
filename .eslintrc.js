module.exports = {
  extends: "eslint:recommended",
  plugins: ["markdown"],
  env: {
    es6: true,
    mocha: true
  },
  parserOptions: {
    sourceType: "module" // https://github.com/AtomLinter/linter-eslint/issues/462#issuecomment-190770417
  },
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "no-undef": "off",
    "no-unused-vars": "off"
  },
  globals: {
    cy: false,
    Cypress: false
  }
}
