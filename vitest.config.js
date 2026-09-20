import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Native ESM project ("type": "module"), so no transform config is needed.
        environment: 'node',
        globals: false,
        include: ['tests/**/*.test.js'],
    },
});
