import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { 
      globals: globals.browser,
      parser: tsParser  // TypeScript 파서 추가
    },
    plugins: {
      prettier: pluginPrettier,  // Prettier 플러그인 추가
      react: pluginReact  // React 플러그인 추가
    },
    rules: {
      "prettier/prettier": ["error", { singleQuote: true, printWidth: 80 }],
      "react/react-in-jsx-scope": "off"
    }
  },
  pluginJs.configs.recommended,  // JS 기본 설정
  tseslint.configs.recommended,  // TypeScript ESLint 기본 설정
  pluginReact.configs.flat.recommended,  // React Flat Config 설정
  prettierConfig  // Prettier 설정
];
