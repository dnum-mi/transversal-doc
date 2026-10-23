// Used by the lint-commits workflow (see .github/workflows/ci.yml).
// It has to be a .cjs file: the workflow generates a CommonJS commitlint.config.js otherwise, which fails
// as soon as package.json declares "type": "module".
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
