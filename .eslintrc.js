module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: ['prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: 0,
    'import/no-unresolved': 'off',
    'no-new': 0,
    indent: ['error', 2],
    'import/extensions': 'off',
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        endOfLine: 'lf',
        trailingComma: 'es5',
        bracketSpacing: true,
        printWidth: 120,
        jsxBracketSameLine: false,
        jsxSingleQuote: false,
        quoteProps: 'as-needed',
        arrowParens: 'always',
        vueIndentScriptAndStyle: false,
      },
    ],
  },
};
