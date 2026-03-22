import { Page } from "@playwright/test"

export async function injectFediMock(
    page: Page,
    options?: {
        installedApps?: Array<{ url: string }>
    },
) {
    await page.addInitScript((apps) => {
        const installed = [...apps]
        ;(window as any).fediInternal = {
            version: 3,
            getInstalledMiniApps: async () => [...installed],
            installMiniApp: async (miniApp: { url: string }) => {
                installed.push({ url: miniApp.url })
            },
        }
    }, options?.installedApps ?? [])
}
