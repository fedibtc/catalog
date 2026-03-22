import { expect, injectFediMock, test } from "../fixtures/base"

test.describe("Fedi Mode - Search", () => {
    test.beforeEach(async ({ page }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("search results show both Add and copy buttons", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()

        await expect(
            page.locator("[data-testid$='-copy']").first(),
        ).toBeVisible()
        await expect(
            page.getByRole("button", { name: "Add", exact: true }).first(),
        ).toBeVisible()
    })

    test("filtering works correctly with Add buttons persisting", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("bitcoin")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()

        const addButtons = page.getByRole("button", {
            name: "Add",
            exact: true,
        })
        expect(await addButtons.count()).toBeGreaterThan(0)
    })

    test("Added state persists in filtered results for pre-installed apps", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page, {
            installedApps: [{ url: "https://boltz.exchange/" }],
        })
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await catalogPage.getSearchInput().fill("Boltz")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()

        const addedButton = page
            .getByRole("button", { name: "Added", exact: true })
            .first()
        await expect(addedButton).toBeVisible()
        await expect(addedButton).toBeDisabled()
    })
})
