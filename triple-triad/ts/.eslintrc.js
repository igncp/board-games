module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:jest/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended"
  ],
  env: {
    node: true
  },
  parserOptions: {
    project: "./tsconfig.json"
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/array-type": 2,
    "@typescript-eslint/brace-style": 2,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-floating-promises": 2,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 2,

    eqeqeq: 2,
    "newline-before-return": 2,
    "no-console": 2,
    "no-shadow": 2,
    "no-useless-return": 2,
    "prefer-template": 2,
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "if" },
      { blankLine: "always", prev: "*", next: "multiline-expression" },
      { blankLine: "always", prev: "*", next: "block-like" }
    ],
    "require-atomic-updates": 0,
    semi: 2,
    "sort-keys": 2
  },

  overrides: [
    {
      files: ["**/simulations/**"],
      rules: {
        "no-console": 0
      }
    }
  ]
};
