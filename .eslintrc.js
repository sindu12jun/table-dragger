module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  env: {
    'browser': true,
    'node': true
  },
  plugins: [
    'html'
  ],
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'no-use-before-define': ["error", { "functions": false, "classes": false }],
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    "space-before-function-paren": 0,
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
