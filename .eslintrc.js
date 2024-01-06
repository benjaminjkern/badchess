module.exports = {
    extends: ["eslint:recommended"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    ignorePatterns: ["**/*.html"],
    rules: {
        "no-unused-vars": "warn",
        "no-warning-comments": "warn",
    },
};
