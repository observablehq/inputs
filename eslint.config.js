import js from "@eslint/js";
import globals from "globals";
import {defineConfig} from "eslint/config";

export default defineConfig([
  {ignores: ["dist/"]},
  {files: ["**/*.{js,ts}"], plugins: {js}, extends: ["js/recommended"]},
  {files: ["{src,test}/**/*.{js,ts}"], languageOptions: {globals: globals.browser}},
  {files: ["{bin,test}/**/*.{js,ts}"], languageOptions: {globals: globals.node}},
  {files: ["test/**/*.{js,ts}"], languageOptions: {globals: globals.mocha}},
  {languageOptions: {ecmaVersion: 2020, sourceType: "module"}},
  {rules: {"no-cond-assign": 0}},
  {files: ["bin/**/*.{js,ts}", "rollup.config.js"], languageOptions: {ecmaVersion: 2026}}
]);
