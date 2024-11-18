import globals from "globals";
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
        exports: "readonly", // Adiciona exports como global
        require: "readonly", // Adiciona require como global
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
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", 
      "import/no-unresolved": "off", 
      "@typescript-eslint/explicit-module-boundary-types": "off", 
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];