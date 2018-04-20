module.exports = {
  extends: "airbnb",
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    // Indent with 4 spaces
    "indent": ["error", 4],

    // Indent JSX with 4 spaces
    "react/jsx-indent": ["error", 4],

    // Indent props with 4 spaces
    "react/jsx-indent-props": ["error", 4],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-underscore-dangle": ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"] }]
  }

};
