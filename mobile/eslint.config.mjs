import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  // Globalne ignorowane katalogi
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "android/",
      "ios/",
      "build/",
      "dist/",
      "coverage/",
      "_backup_SlowSpotWatchWidgets/",
      "*.js",
      "*.d.ts",
    ],
  },

  // Bazowe reguly ESLint
  eslint.configs.recommended,

  // TypeScript - strict rules
  ...tseslint.configs.strict,

  // Konfiguracja TypeScript i React Hooks
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
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

      // Zakaz any - raportowanie, bez auto-fix
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
