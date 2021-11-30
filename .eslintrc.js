module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["**/*.js"],
      extends: ["plugin:node/recommended"],
      rules: {
        "node/shebang": 0,
        "node/no-extraneous-require": 0,
      },
    },
    {
      files: ["packages/**/*.ts"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/ban-ts-comment": 0,
        "@typescript-eslint/no-unsafe-return": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/require-await": 0,
      },
    },
    {
      files: ["packages/**/*.spec.ts"],
      env: {
        commonjs: true,
        node: true,
        mocha: true,
      },
      rules: {},
    },
  ],
}
