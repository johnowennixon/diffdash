import path from "node:path"
import {fileURLToPath} from "node:url"

import {FlatCompat} from "@eslint/eslintrc"
import eslint_js from "@eslint/js"
import plugin_typescript from "@typescript-eslint/eslint-plugin"
import parser_typescript from "@typescript-eslint/parser"
import plugin_import_x from "eslint-plugin-import-x"
import globals from "globals"
import typescript_eslint from "typescript-eslint"

const module_filename = fileURLToPath(import.meta.url)
const module_dirname = path.dirname(module_filename)

const compat = new FlatCompat({
  baseDirectory: module_dirname,
  recommendedConfig: eslint_js.configs.recommended,
  allConfig: eslint_js.configs.all,
})

const rules_eslint = {
  ...eslint_js.configs.recommended.rules,

  "curly": "error",
  "default-case": "error",
  "eqeqeq": "error",
  "guard-for-in": "error",
  "no-bitwise": "error",
  "no-caller": "error",
  "no-console": "off",
  "no-constant-binary-expression": "error",
  "no-eval": "error",
  "no-implicit-coercion": "error",
  "no-invalid-this": "error",
  "no-labels": "error",
  "no-lone-blocks": "error",
  "no-lonely-if": "error",
  "no-loop-func": "error",
  "no-multi-str": "error",
  "no-new-func": "error",
  "no-new-wrappers": "error",
  "no-object-constructor": "error",
  "no-promise-executor-return": "error",
  "no-restricted-imports": "error",
  "no-self-assign": "error",
  "no-sequences": "error",
  "no-shadow": "error",
  "no-template-curly-in-string": "error",
  "no-undef-init": "off",
  "no-underscore-dangle": "error",
  "no-unmodified-loop-condition": "error",
  "no-unneeded-ternary": "error",
  "no-unreachable-loop": "error",
  "no-unsafe-finally": "error",
  "no-unused-expressions": "error",
  "no-unused-vars": "off",
  "object-shorthand": "error",
  "one-var": ["error", "never"],
  "prefer-object-has-own": "error",
  "prefer-object-spread": "error",
  "radix": "error",
  "require-atomic-updates": "error",
  "symbol-description": "error",
}

const rules_import_x = {
  ...plugin_import_x.configs.errors.rules,
  ...plugin_import_x.configs.warnings.rules,

  "import-x/default": "error",
  "import-x/named": "off",
  "import-x/namespace": "error",
  "import-x/no-anonymous-default-export": "off",
  "import-x/no-cycle": "error",
  "import-x/no-deprecated": "error",
  "import-x/no-duplicates": "error",
  "import-x/no-extraneous-dependencies": "error",
  "import-x/no-named-as-default": "error",
  "import-x/no-named-as-default-member": "off",
  "import-x/no-rename-default": "off",
  "import-x/no-self-import": "error",
  "import-x/no-unassigned-import": "error",
  "import-x/no-unresolved": "error",
  "import-x/no-useless-path-segments": "error",
  "import-x/order": [
    "error",
    {
      "alphabetize": {
        order: "asc",
      },
      "newlines-between": "always",
    },
  ],
}

const rules_typescript = {
  "@typescript-eslint/array-type": [
    "error",
    {
      default: "generic",
    },
  ],
  "@typescript-eslint/await-thenable": "error",
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/consistent-type-assertions": "error",
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
    },
  ],
  "@typescript-eslint/dot-notation": "error",
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/naming-convention": [
    "error",
    {
      format: ["PascalCase"],
      selector: "typeLike",
    },
    {
      format: ["snake_case", "UPPER_CASE"],
      leadingUnderscore: "allow",
      selector: "variableLike",
    },
  ],
  "@typescript-eslint/no-extraneous-class": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-restricted-types": "error",
  "@typescript-eslint/no-this-alias": "error",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      ignoreRestSiblings: true,
      vars: "all",
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-unsafe-function-type": "error",
  "@typescript-eslint/no-use-before-define": "error",
  "@typescript-eslint/no-require-imports": "error",
  "@typescript-eslint/no-wrapper-object-types": "error",
  "@typescript-eslint/prefer-for-of": "error",
  "@typescript-eslint/prefer-function-type": "error",
  "@typescript-eslint/require-await": "off",
  "@typescript-eslint/restrict-plus-operands": "error",
  "@typescript-eslint/restrict-template-expressions": "error",
  "@typescript-eslint/strict-boolean-expressions": [
    "error",
    {
      allowNullableBoolean: true,
      allowNullableString: true,
    },
  ],
  "@typescript-eslint/triple-slash-reference": "error",
  "@typescript-eslint/unbound-method": "off",
  "@typescript-eslint/unified-signatures": "error",
}

const configs = [
  {
    name: "local/ignores",
    ignores: ["**/dist"],
  },

  ...typescript_eslint.configs.recommendedTypeChecked,

  {
    name: "local/custom_typescript",

    plugins: {
      "import-x": plugin_import_x,
      "@typescript-eslint": plugin_typescript,
    },

    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
        ...globals.es2023,
      },
      parser: parser_typescript,
      parserOptions: {
        project: true,
      },
      sourceType: "module",
    },

    settings: {
      ...plugin_import_x.configs.typescript.settings,
    },

    rules: {
      ...rules_eslint,
      ...rules_import_x,
      ...rules_typescript,
    },
  },

  ...compat.extends("plugin:@typescript-eslint/disable-type-checked").map((config) => ({
    name: "local/custom_javascript",
    ...config,
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
  })),
]

export default configs
