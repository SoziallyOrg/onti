import next from "eslint-config-next";
import tseslint from "typescript-eslint";

/**
 * ESLint flat config.
 *
 * Next.js 16+ ships `eslint-config-next` as a native flat-config array,
 * so we no longer need `FlatCompat`. The shared config already includes
 * sensible TypeScript, React and a11y defaults plus its own ignores.
 *
 * Flat config requires plugins to be declared in the same block as their
 * rule overrides — that's why we re-register `@typescript-eslint` below.
 */
const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "coverage/**",
    ],
  },
  ...next,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
