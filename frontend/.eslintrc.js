module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        // 'plugin:vue/vue3-essential',
        'standard',
        'plugin:prettier/recommended',
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['unused-imports', 'simple-import-sort'],
    rules: {
        'vue/multi-word-component-names': 'off',
        camelcase: 'off',
        eqeqeq: 'off',
        'no-mixed-operators': 'off',
        'prefer-promise-reject-errors': 'off',
        'prefer-const': 'off',
        'vue/no-deprecated-v-on-native-modifier': 'off',
        'vue/no-side-effects-in-computed-properties': 'off',
        'array-callback-return': 'off',
        'vue/no-deprecated-slot-attribute': 'off',
        'no-return-assign': 'off',
        'no-async-promise-executor': 'off',
        'prefer-regex-literals': 'off',
        'no-template-curly-in-string': 'off',
        'no-prototype-builtins': 'off',
        'no-throw-literal': 'off',
        'vue/no-v-for-template-key-on-child': 'off',
        'no-var': 'off',
        'vue/require-prop-type-constructor': 'off',
        'no-unused-expressions': 'off',
        'no-sequences': 'off',
        'no-array-constructor': 'off',
        'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
    },
}
