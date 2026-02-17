import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  // Globalne ignorowane katalogi
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "dist/",
      "coverage/",
      "test-results/",
      "*.js",
      "*.d.ts",
    ],
  },

  // Bazowe reguly ESLint
  eslint.configs.recommended,

  // TypeScript - strict rules
  ...tseslint.configs.strict,

  // Konfiguracja TypeScript, React Hooks i Next.js
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js - wszystkie zalecane reguly
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Zakaz any
      "@typescript-eslint/no-explicit-any": "error",

      // Uzyteczne reguly TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  }
);
