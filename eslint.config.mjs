import globals from "./globals/globals.json" assert { type: "json" };
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
        __dirname: "readonly",
      },
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react": pluginReact,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      "@typescript-eslint/no-unused-expressions": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
      "quotes": "off",
      "semi": "off",
      "comma-dangle": "off",
      "indent": "off",
      "linebreak-style": "off",
      "no-empty-function": "off",
      "no-multiple-empty-lines": "off",
      "eol-last": "off",
      "no-namespace": "off",
      "no-prototype": "off"
    },
  },
];