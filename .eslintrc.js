export default {
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  ignorePatterns: ["android/app/build/**", ".gitignore"],
};
