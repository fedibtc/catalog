import { expect, test } from "../fixtures/base"
import { filterOptionTestId } from "../helpers/test-ids"

test.describe("Browser Mode - Filter Modal", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("opens when clicking filter icon", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await expect(page.getByTestId("filter-dialog")).toBeVisible()
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
                page.getByTestId(filterOptionTestId("category", category)),
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

        await page
            .getByTestId(filterOptionTestId("category", "AI & Chatbots"))
            .click()
        await catalogPage.closeFilterModal()

        await expect(catalogPage.getFilterDescription()).toContainText(
            "Category: AI & Chatbots",
        )
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
    })

    test("region dropdown shows region buttons with Global first", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await expect(
            page.getByTestId(filterOptionTestId("region", "Global")),
        ).toBeVisible()
        await expect(
            page.getByTestId(filterOptionTestId("region", "Africa")),
        ).toBeVisible()
        await expect(
            page.getByTestId(filterOptionTestId("region", "Europe")),
        ).toBeVisible()
    })

    test("filtering by region shows filter description", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await page.getByTestId(filterOptionTestId("region", "Global")).click()
        await catalogPage.closeFilterModal()

        await expect(catalogPage.getFilterDescription()).toContainText(
            "Region: Global",
        )
    })

    test("country list shows first 6 and View more", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await expect(page.getByTestId("country-view-more")).toBeVisible()
    })

    test("country search works", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await page.getByTestId("country-search-input").fill("United States")

        await expect(
            page.getByTestId(filterOptionTestId("country", "United States")),
        ).toBeVisible()
    })

    test("Reset clears all filters", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        await page
            .getByTestId(filterOptionTestId("category", "AI & Chatbots"))
            .click()

        await page.getByTestId("filter-reset").click()

        await catalogPage.closeFilterModal()

        await expect(catalogPage.getFilterDescription()).not.toBeVisible()
    })

    test("search and filter combination works", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")
        await page
            .getByTestId(filterOptionTestId("category", "AI & Chatbots"))
            .click()
        await catalogPage.closeFilterModal()

        await catalogPage.getSearchInput().fill("AI")
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
    })

    test("filter indicator dot appears when filters active", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilterIndicator()).not.toBeVisible()

        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")
        await page
            .getByTestId(filterOptionTestId("category", "AI & Chatbots"))
            .click()
        await catalogPage.closeFilterModal()

        await expect(catalogPage.getFilterIndicator()).toBeVisible()
    })
})
