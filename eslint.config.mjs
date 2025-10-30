import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 👇 Adicionamos esta nova seção para a regra
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", // "warn" significa que ele avisa (sublinhado), mas não quebra o app
        {
          argsIgnorePattern: "^_", // Ignora argumentos que começam com _
          varsIgnorePattern: "^_", // Ignora variáveis que começam com _
        },
      ],
    },
  },
];

export default eslintConfig;
