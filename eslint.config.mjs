import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Flatten and filter configs
const eslintConfig = [
  {
    ignores: ["node_modules/", ".next/", "dist/"],
  },
  ...compat.extends("next/core-web-vitals").map(cfg => ({
    ...cfg,
    parser: typeof cfg.parser === "function" ? "@typescript-eslint/parser" : cfg.parser,
  })),
];

export default eslintConfig;
