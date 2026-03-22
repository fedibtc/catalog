import { test, expect } from "../fixtures/base"

test.describe("Browser Mode - Filter Modal", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("opens when clicking filter icon", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await expect(
            page.getByRole("dialog").getByText("Filter"),
        ).toBeVisible()
    })

    test("closes on Apply click", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.closeFilterModal()
        await expect(page.getByRole("dialog")).not.toBeVisible()
    })

    test("category dropdown shows 6 categories", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        const categories = [
            "Spend and Earn Bitcoin",
            "Cash in and cash out",
            "Productivity",
            "Communication",
            "AI & Chatbots",
            "Misc",
        ]

        for (const category of categories) {
            await expect(
                page.getByRole("dialog").getByText(category, { exact: true }),
            ).toBeVisible()
        }
    })

    test("filtering by category shows correct results", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        // Select "AI & Chatbots"
        await page
            .getByRole("dialog")
            .getByText("AI & Chatbots", { exact: true })
            .click()
        await catalogPage.closeFilterModal()

        // Should show filter description in italics
        await expect(page.getByText("Category: AI & Chatbots")).toBeVisible()
        // Should show filtered results
        await expect(page.getByText("Filtered")).toBeVisible()
    })

    test("region dropdown shows region buttons with Global first", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        // Global should be visible
        await expect(
            page.getByRole("dialog").getByText("Global", { exact: true }),
        ).toBeVisible()
        // Other regions
        await expect(
            page.getByRole("dialog").getByText("Africa", { exact: true }),
        ).toBeVisible()
        await expect(
            page.getByRole("dialog").getByText("Europe", { exact: true }),
        ).toBeVisible()
    })

    test("filtering by region shows filter description", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await page
            .getByRole("dialog")
            .getByRole("button", { name: "Global" })
            .click()
        await catalogPage.closeFilterModal()

        await expect(page.getByText("Region: Global")).toBeVisible()
    })

    test("country list shows first 6 and View more", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        // Should show "View more" since there are more than 6 countries
        await expect(
            page.getByRole("dialog").getByText("View more"),
        ).toBeVisible()
    })

    test("country search works", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await page
            .getByRole("dialog")
            .getByPlaceholder("Search countries")
            .fill("United States")

        await expect(
            page.getByRole("dialog").getByText("United States", { exact: true }),
        ).toBeVisible()
    })

    test("Reset clears all filters", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        // Select a category
        await page
            .getByRole("dialog")
            .getByText("AI & Chatbots", { exact: true })
            .click()

        // Click Reset
        await page.getByRole("dialog").getByText("Reset").click()

        await catalogPage.closeFilterModal()

        // Filter description should not be visible
        await expect(page.getByText("Category:")).not.toBeVisible()
    })

    test("search and filter combination works", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        // First apply a category filter
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")
        await page
            .getByRole("dialog")
            .getByText("AI & Chatbots", { exact: true })
            .click()
        await catalogPage.closeFilterModal()

        // Then search within the filtered results
        await catalogPage.getSearchInput().fill("AI")
        await expect(page.getByText("Filtered")).toBeVisible()
    })

    test("filter indicator dot appears when filters active", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        // No indicator initially (the circle icon has className override, so it gets text-red class)
        await expect(
            page.locator("svg[class*='text-red']"),
        ).not.toBeVisible()

        // Apply a filter
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")
        await page
            .getByRole("dialog")
            .getByText("AI & Chatbots", { exact: true })
            .click()
        await catalogPage.closeFilterModal()

        // Red indicator should appear
        await expect(
            page.locator("svg[class*='text-red']"),
        ).toBeVisible()
    })
})
