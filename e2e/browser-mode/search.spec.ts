import { expect, test } from "../fixtures/base"

test.describe("Browser Mode - Search", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("filter by name shows matching app", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(page.locator("img[alt='Boltz']").first()).toBeVisible()
    })

    test("filter by description keyword", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("chatbot")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(
            page.locator("img[alt='AI Assistant']").first(),
        ).toBeVisible()
    })

    test("filter by app keywords", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("bitcoin explorer")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(
            page.locator("img[alt='Timechain Calendar']").first(),
        ).toBeVisible()
    })

    test("shows filtered results count header", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
    })

    test("no results found for non-matching search", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("zzzznonexistent")
        await expect(page.getByText("No results found")).toBeVisible()
    })

    test("results sorted alphabetically", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("bitcoin")
        const heading = catalogPage.getFilteredResultsHeading()
        await expect(heading).toBeVisible()

        const headingText = await heading.textContent()
        const filteredCount = parseInt(headingText?.match(/\d+/)?.[0] || "0")
        expect(filteredCount).toBeGreaterThan(1)

        const names: string[] = []
        const images = page.locator("img[alt]")
        for (let i = 0; i < filteredCount; i++) {
            const alt = await images.nth(i).getAttribute("alt")
            if (alt) names.push(alt)
        }

        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).toEqual(sorted)
    })

    test("clearing search restores full catalog", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()

        await catalogPage.getSearchInput().clear()
        await expect(catalogPage.getMiniAppGroup("New")).toBeVisible()
        await expect(
            catalogPage.getMiniAppGroup("Spend & Earn Bitcoin"),
        ).toBeVisible()
    })

    test.fixme("regex special characters do not crash the page", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("[invalid(regex")
        await expect(page.getByText("No results found")).toBeVisible()
    })
})
