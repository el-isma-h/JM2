import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Le domaine reste pur : aucune dépendance à Next, React, la base ou le système de fichiers.
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: ["next/*", "react", "@/db", "@/db/*", "@/server/*", "@/content", "@/content/*", "node:fs", "fs"] },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "dist/**", "drizzle/**", "next-env.d.ts"]),
]);

export default eslintConfig;
