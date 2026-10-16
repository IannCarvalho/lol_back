import js from '@eslint/js';
import globals from 'globals';

export default [
    { ignores: ['node_modules/**'] },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            // Express exige a assinatura de 4 argumentos (err, req, res, next)
            // para reconhecer um error handler, mesmo quando algum argumento
            // anterior a um usado nao e necessario. Permitimos argumentos nao
            // usados com prefixo '_' e ignoramos os anteriores a um usado.
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                args: 'after-used',
            }],
        },
    },
];
