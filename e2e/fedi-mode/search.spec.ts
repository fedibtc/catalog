import { test, expect, injectFediMock } from "../fixtures/base"

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
        await expect(page.getByText("Filtered")).toBeVisible()

        // Check that the result has both a copy button (round) and an Add button
        await expect(
            page.locator("button[class*='rounded-full']").first(),
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
        await expect(page.getByText("Filtered")).toBeVisible()

        // Add buttons should still be visible in filtered results
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
        // Need to re-inject with pre-installed apps since beforeEach already set up
        await injectFediMock(page, {
            installedApps: [{ url: "https://boltz.exchange/" }],
        })
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await catalogPage.getSearchInput().fill("Boltz")
        await expect(page.getByText("Filtered")).toBeVisible()

        // Boltz appears in both filtered results and category group, so use .first()
        const addedButton = page
            .getByRole("button", { name: "Added", exact: true })
            .first()
        await expect(addedButton).toBeVisible()
        await expect(addedButton).toBeDisabled()
    })
})
