import { test as base, expect, Locator, Page } from "@playwright/test"
import { injectFediMock } from "../helpers/fedi-mock"

type CatalogPage = {
    waitForCatalogReady: () => Promise<void>
    getSearchInput: () => Locator
    openFilterModal: () => Promise<void>
    closeFilterModal: () => Promise<void>
    openDropdown: (title: string) => Promise<void>
    clickMiniAppCard: (name: string) => Promise<void>
}

type FediCatalogPage = CatalogPage & {
    getAddButton: (name: string) => Locator
    getAddedButton: (name: string) => Locator
}

export const test = base.extend<{
    catalogPage: CatalogPage
    fediCatalogPage: FediCatalogPage
}>({
    catalogPage: async ({ page }, use) => {
        await page.context().grantPermissions([
            "clipboard-read",
            "clipboard-write",
        ])

        const helpers = createCatalogHelpers(page)
        await use(helpers)
    },

    fediCatalogPage: async ({ page }, use) => {
        await page.context().grantPermissions([
            "clipboard-read",
            "clipboard-write",
        ])

        const helpers = createCatalogHelpers(page)

        const fediHelpers: FediCatalogPage = {
            ...helpers,
            getAddButton: (name: string) => {
                const card = page.locator(`div`).filter({ hasText: name }).first()
                return card.getByRole("button", { name: "Add", exact: true })
            },
            getAddedButton: (name: string) => {
                const card = page.locator(`div`).filter({ hasText: name }).first()
                return card.getByRole("button", { name: "Added", exact: true })
            },
        }

        await use(fediHelpers)
    },
})

function createCatalogHelpers(page: Page): CatalogPage {
    return {
        waitForCatalogReady: async () => {
            await expect(
                page.getByText("Fedi Mini Apps Catalog"),
            ).toBeVisible({ timeout: 15_000 })
        },
        getSearchInput: () => {
            return page.getByPlaceholder("Search Mini Apps or keywords")
        },
        openFilterModal: async () => {
            await page.locator(".tabler-icon-filter").click()
            await expect(
                page.getByRole("dialog").getByText("Filter"),
            ).toBeVisible()
        },
        closeFilterModal: async () => {
            await page.getByRole("dialog").getByRole("button", { name: "Apply" }).click()
            await expect(
                page.getByRole("dialog").getByText("Filter"),
            ).not.toBeVisible()
        },
        openDropdown: async (title: string) => {
            await page
                .getByRole("dialog")
                .getByText(title, { exact: true })
                .click()
        },
        clickMiniAppCard: async (name: string) => {
            // Find the card container by its img alt text
            const card = page
                .locator("div.cursor-pointer")
                .filter({ has: page.locator(`img[alt="${name}"]`) })
                .first()
            await card.click()
        },
    }
}

export { expect, injectFediMock }
