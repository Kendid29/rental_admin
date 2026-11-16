import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintConfigESLint from "eslint-config-eslint";
import eslintConfigESLintFormatting from "eslint-config-eslint/formatting";
import * as reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        '*.config.mjs',
        '*.config.js',
    ]),
    eslintConfigESLint,
    eslintConfigESLintFormatting,
    {
        settings: {
            react: {
                version: "detect"
            },
            next: {
                rootDir: "."
            }
        },
        extends: compat.extends(
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:prettier/recommended",
            "eslint:recommended",
            // "plugin:@next/next/recommended",
            // "plugin:@next/next/core-web-vitals"
        ),

        plugins: {
            react,
            "simple-import-sort": simpleImportSort,
            'react-hooks': reactHooks,
            '@tanstack/query': pluginQuery,
            '@next/next': nextPlugin,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "no-plusplus": "off",
            "strict": "off",

            "react/jsx-filename-extension": [1, {
                extensions: [".tsx", ".jsx"],
            }],

            "react/state-in-constructor": "off",
            "react/no-array-index-key": "off",
            "simple-import-sort/exports": "error",

            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^\\u0000", "^@public"],
                        ["^react"],
                        ["^next"],
                        ["^@mui"],
                        ["^@?\\w", "^react-", "^react-icons"],
                        ["^@shared", "^@components", "^@constants", "^@lib", "^@/"] // Custom groups
                    ]
                }
            ],

            "react-hooks/exhaustive-deps": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-props-no-spreading": "off",
            "react/display-name": "off",
            "react/require-default-props": "off",

            "import/no-extraneous-dependencies": ["off", {
                devDependencies: false,
                optionalDependencies: false,
                peerDependencies: false,
            }],

            "import/prefer-default-export": "off",
            "import/no-cycle": "off",

            "react/function-component-definition": [2, {
                namedComponents: "arrow-function",
            }],

            "react/jsx-one-expression-per-line": "off",

            "prettier/prettier": ["error", {
                endOfLine: "auto",
            }],

            "object-curly-newline": "off",
            "linebreak-style": "off",
            "implicit-arrow-linebreak": "off",
            "no-unused-vars": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "import/extensions": "off",
            "jsx-a11y/anchor-is-valid": "off",
            "object-curly-spacing": ["error", "always"],
            "react/jsx-no-undef": ['error', { "allowGlobals": true }],
            "no-undef": "off",
            "func-style": ["error", "expression"],
            "camelcase": "off",
            "react/self-closing-comp": ["error", {
                "component": true,
                "html": true
            }],
            "no-undefined": "off",
            "no-console": "warn",
            "@eslint-community/eslint-comments/require-description": ["error", {"ignore": [
                "eslint",
                "eslint-disable",
                "eslint-disable-next-line",
                "eslint-disable-line",
                "eslint-enable",
            ]}]
        },
    },
]);