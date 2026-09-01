import { test as base, expect, Locator, Page } from "@playwright/test"
import { injectFediMock } from "../helpers/fedi-mock"
import {
    dropdownTestId,
    miniAppGroupTestId,
    miniAppTestId,
} from "../helpers/test-ids"

type CatalogPage = {
    waitForCatalogReady: () => Promise<void>
    getSearchInput: () => Locator
    getFilterTrigger: () => Locator
    getFilterIndicator: () => Locator
    getFilterDescription: () => Locator
    getFilteredResultsHeading: () => Locator
    getMiniAppCard: (name: string) => Locator
    getMiniAppGroup: (name: string) => Locator
    getDetailsDialog: () => Locator
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
    catalogPage: async ({ page }, applyCatalogPage) => {
        await page
            .context()
            .grantPermissions(["clipboard-read", "clipboard-write"])

        const helpers = createCatalogHelpers(page)
        await applyCatalogPage(helpers)
    },

    fediCatalogPage: async ({ page }, applyFediCatalogPage) => {
        await page
            .context()
            .grantPermissions(["clipboard-read", "clipboard-write"])

        const helpers = createCatalogHelpers(page)

        const fediHelpers: FediCatalogPage = {
            ...helpers,
            getAddButton: (name: string) => {
                const card = helpers.getMiniAppCard(name)
                return card.getByRole("button", { name: "Add", exact: true })
            },
            getAddedButton: (name: string) => {
                const card = helpers.getMiniAppCard(name)
                return card.getByRole("button", { name: "Added", exact: true })
            },
        }

        await applyFediCatalogPage(fediHelpers)
    },
})

function createCatalogHelpers(page: Page): CatalogPage {
    return {
        waitForCatalogReady: async () => {
            await expect(page.getByText("Fedi Mini Apps Catalog")).toBeVisible({
                timeout: 15_000,
            })
        },
        getSearchInput: () => {
            return page.getByTestId("catalog-search-input")
        },
        getFilterTrigger: () => {
            return page.getByTestId("filter-trigger")
        },
        getFilterIndicator: () => {
            return page.getByTestId("filter-active-indicator")
        },
        getFilterDescription: () => {
            return page.getByTestId("filter-description")
        },
        getFilteredResultsHeading: () => {
            return page.getByTestId("filtered-results-heading")
        },
        getMiniAppCard: (name: string) => {
            return page.getByTestId(miniAppTestId(name)).first()
        },
        getMiniAppGroup: (name: string) => {
            return page.getByTestId(miniAppGroupTestId(name))
        },
        getDetailsDialog: () => {
            return page.getByTestId("mini-app-details-dialog")
        },
        openFilterModal: async () => {
            await page.getByTestId("filter-trigger").click()
            await expect(page.getByTestId("filter-dialog")).toBeVisible()
        },
        closeFilterModal: async () => {
            await page.getByTestId("filter-apply").click()
            await expect(page.getByTestId("filter-dialog")).not.toBeVisible()
        },
        openDropdown: async (title: string) => {
            await page.getByTestId(`${dropdownTestId(title)}-trigger`).click()
            await expect(
                page.getByTestId(`${dropdownTestId(title)}-content`),
            ).toBeVisible()
        },
        clickMiniAppCard: async (name: string) => {
            await page.getByTestId(miniAppTestId(name)).first().click()
        },
    }
}

export { expect, injectFediMock }
