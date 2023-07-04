import { defineConfig } from 'vitest/config'

const config = defineConfig({
    test: {
        /**
         * By default, vitest search test files in all packages.
         * For e2e tests have sense search only is project root tests folder
         */
        include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

        /**
         * A default timeout of 5000ms is sometimes not enough for playwright.
         */
        testTimeout: 30_000,
        hookTimeout: 30_000,

        environment: 'jsdom'
    }
})

export default config
