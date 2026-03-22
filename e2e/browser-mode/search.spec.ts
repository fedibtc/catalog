import { test, expect } from "../fixtures/base"

test.describe("Browser Mode - Search", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("filter by name shows matching app", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(page.getByText(/\d+ Filtered Result/)).toBeVisible()
        await expect(page.locator("img[alt='Boltz']").first()).toBeVisible()
    })

    test("filter by description keyword", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("chatbot")
        await expect(page.getByText(/\d+ Filtered Result/)).toBeVisible()
        // AI Assistant has "chatbot" in description
        await expect(
            page.locator("img[alt='AI Assistant']").first(),
        ).toBeVisible()
    })

    test("filter by app keywords", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("bitcoin explorer")
        await expect(page.getByText(/\d+ Filtered Result/)).toBeVisible()
        // Timechain Calendar has "bitcoin explorer" keyword
        await expect(
            page.locator("img[alt='Timechain Calendar']").first(),
        ).toBeVisible()
    })

    test("shows filtered results count header", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(page.getByText(/\d+ Filtered Result/)).toBeVisible()
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
        // Search for something that returns multiple results
        await catalogPage.getSearchInput().fill("bitcoin")
        const heading = page.locator(".text-h2", { hasText: /Filtered/ })
        await expect(heading).toBeVisible()

        // Get the count from the "X Filtered Results" heading
        const headingText = await heading.textContent()
        const filteredCount = parseInt(
            headingText?.match(/\d+/)?.[0] || "0",
        )
        expect(filteredCount).toBeGreaterThan(1)

        // The filtered results appear first in DOM, so check the first N images
        const names: string[] = []
        const images = page.locator("img[alt]")
        for (let i = 0; i < filteredCount; i++) {
            const alt = await images.nth(i).getAttribute("alt")
            if (alt) names.push(alt)
        }

        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).toEqual(sorted)
    })

    test("clearing search restores full catalog", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")
        await expect(page.getByText(/\d+ Filtered Result/)).toBeVisible()

        await catalogPage.getSearchInput().clear()
        // New section and category groups should reappear (divs with text-h2 class, not h2 tags)
        await expect(
            page.locator(".text-h2").filter({ hasText: "New" }).first(),
        ).toBeVisible()
        await expect(
            page.locator(".text-h2").filter({ hasText: "Spend & Earn Bitcoin" }),
        ).toBeVisible()
    })

    test.fixme(
        "regex special characters do not crash the page",
        async ({ page, catalogPage }) => {
            await catalogPage.waitForCatalogReady()
            // new RegExp(input) is used without escaping - known bug
            await catalogPage.getSearchInput().fill("[invalid(regex")
            // Should not crash, should show no results
            await expect(page.getByText("No results found")).toBeVisible()
        },
    )
})
