import { defineConfig, devices } from "@playwright/test"

const isCI = !!process.env.CI

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    workers: isCI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3023",
        trace: "on-first-retry",
        navigationTimeout: 15_000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
            testIgnore: [
                "**/image-health/**",
                "**/visual-regression/**",
            ],
        },
        {
            name: "image-health",
            testMatch: "**/image-health/**/*.spec.ts",
            use: { ...devices["Desktop Chrome"] },
            timeout: 60_000,
            retries: 0,
        },
        {
            name: "visual-regression",
            testMatch: "**/visual-regression/**/*.spec.ts",
            use: { ...devices["Desktop Chrome"] },
            timeout: 60_000,
            retries: 1,
            expect: {
                toHaveScreenshot: {
                    maxDiffPixelRatio: 0.01,
                    threshold: 0.2,
                },
            },
        },
    ],
    webServer: {
        command: isCI
            ? "bun run build && bunx next start -p 3023"
            : "bunx next start -p 3023",
        url: "http://localhost:3023",
        reuseExistingServer: !isCI,
        timeout: 120_000,
    },
})
