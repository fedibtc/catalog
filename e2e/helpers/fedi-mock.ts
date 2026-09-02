import { Page } from "@playwright/test"

export type InstallMiniAppCall = {
    id: string
    title: string
    url: string
    imageUrl: string
    description: string
}

type FediInternalMock = {
    version: number
    getInstalledMiniApps: () => Promise<Array<{ url: string }>>
    installMiniApp: (miniApp: InstallMiniAppCall) => Promise<void>
}

type MockWindow = Window & {
    fediInternal?: FediInternalMock
    fediInstallCalls?: InstallMiniAppCall[]
}

export async function injectFediMock(
    page: Page,
    options?: {
        installedApps?: Array<{ url: string }>
    },
) {
    await page.addInitScript((apps) => {
        const installed = [...apps]
        const mockWindow = window as MockWindow
        mockWindow.fediInstallCalls = []
        mockWindow.fediInternal = {
            version: 2,
            getInstalledMiniApps: async () => [...installed],
            installMiniApp: async (miniApp: InstallMiniAppCall) => {
                installed.push({ url: miniApp.url })
                mockWindow.fediInstallCalls?.push(miniApp)
            },
        }
    }, options?.installedApps ?? [])
}

export const getInstallCalls = (page: Page) =>
    page.evaluate(() => (window as MockWindow).fediInstallCalls ?? [])
