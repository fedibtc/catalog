import { Page } from "@playwright/test"

type FediInternalMock = {
    version: number
    getInstalledMiniApps: () => Promise<Array<{ url: string }>>
    installMiniApp: (miniApp: { url: string }) => Promise<void>
}

export async function injectFediMock(
    page: Page,
    options?: {
        installedApps?: Array<{ url: string }>
    },
) {
    await page.addInitScript((apps) => {
        const installed = [...apps]
        ;(window as Window & { fediInternal?: FediInternalMock }).fediInternal =
            {
                version: 2,
                getInstalledMiniApps: async () => [...installed],
                installMiniApp: async (miniApp: { url: string }) => {
                    installed.push({ url: miniApp.url })
                },
            }
    }, options?.installedApps ?? [])
}
