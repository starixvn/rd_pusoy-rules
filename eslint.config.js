import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


const config = {
    ignores: ["**/*.test.ts", "dist/**/*"]
}

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    config
]