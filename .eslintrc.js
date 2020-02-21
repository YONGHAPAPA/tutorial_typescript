module.exports = {
   env: {
      browser: true,
      es6: true,
      node: true
   },
   extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'airbnb'
   ],
   globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
   },
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaFeatures: {
         jsx: true
      },
      ecmaVersion: 2018,
      sourceType: 'module'
   },
   plugins: ['react', '@typescript-eslint'],
   rules: {
      indent: ['error', 4],
      semi: ['error', 'always'],
      'no-trailing-spaces': 0,
      'keyword-spacing': 0,
      'no-unused-vars': 1,
      'no-multiple-empty-lines': 0,
      'space-before-function-paren': 0,
      'eol-last': 0,

      'linebreak-style': 0,
      'max-len': 0,
      'import/no-unresolved': 0,
      'import/order': 0,
      'no-else-return': 0,
      'consistent-return': 0,
      'class-methods-use-this': 0,
      'prefer-destructuring': 0,
      'nonblock-statement-body-position': 0,
      'no-shadow': 0,
      'no-underscore-dangle': 0,
      'spaced-comment': 0,
      'padded-blocks': 0,
      'comma-dangle': 0,
      'no-undef': 0
   }
};
