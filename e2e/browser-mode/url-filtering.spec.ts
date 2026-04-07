import { expect, test } from "../fixtures/base"
import { filterOptionTestId } from "../helpers/test-ids"

test.describe("Browser Mode - URL-based Filtering", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("search updates URL with search param after debounce", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.getSearchInput().fill("Boltz")

        // Wait for the 500ms debounce to update the URL
        await page.waitForURL(/[?&]search=Boltz/, { timeout: 15_000 })
        expect(page.url()).toContain("search=Boltz")
    })

    test("category filter updates URL", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        await page
            .getByTestId(filterOptionTestId("category", "AI & Chatbots"))
            .click()
        await catalogPage.closeFilterModal()

        await expect(page).toHaveURL(/[?&]categories=ai/)
    })

    test("region filter updates URL", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Region & Country")

        await page.getByTestId(filterOptionTestId("region", "Global")).click()
        await catalogPage.closeFilterModal()

        await expect(page).toHaveURL(/[?&]region=GLOBAL/)
    })

    test("navigating to URL with search param shows filtered results", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?search=Boltz", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(catalogPage.getSearchInput()).toHaveValue("Boltz")
    })

    test("navigating to URL with category param shows filtered results", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?categories=ai", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilterDescription()).toContainText(
            "Category: AI & Chatbots",
        )
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(catalogPage.getFilterIndicator()).toBeVisible()
    })

    test("navigating to URL with region param shows filtered results", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?region=GLOBAL", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilterDescription()).toContainText(
            "Region: Global",
        )
        await expect(catalogPage.getFilterIndicator()).toBeVisible()
    })

    test("navigating to URL with combined params", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?search=bitcoin&categories=ai", {
            waitUntil: "domcontentloaded",
        })
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(catalogPage.getFilterDescription()).toContainText(
            "Category: AI & Chatbots",
        )
        await expect(catalogPage.getSearchInput()).toHaveValue("bitcoin")
    })

    test("filters persist across page reload", async ({
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

        await expect(page).toHaveURL(/[?&]categories=ai/)

        // Reload the page
        await page.reload({ waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Filter should still be applied
        await expect(catalogPage.getFilterDescription()).toContainText(
            "Category: AI & Chatbots",
        )
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(catalogPage.getFilterIndicator()).toBeVisible()
    })

    test("reset clears filter URL params", async ({ page, catalogPage }) => {
        await page.goto("/?categories=ai&region=GLOBAL", {
            waitUntil: "domcontentloaded",
        })
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilterIndicator()).toBeVisible()

        await catalogPage.openFilterModal()
        await page.getByTestId("filter-reset").click()
        await catalogPage.closeFilterModal()

        // URL should no longer have filter params
        await expect(page).not.toHaveURL(/categories=/)
        await expect(page).not.toHaveURL(/region=/)
        await expect(catalogPage.getFilterIndicator()).not.toBeVisible()
    })

    test("clearing search removes search param from URL", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?search=Boltz", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await catalogPage.getSearchInput().fill("")

        // Wait for debounce to clear the URL param
        await page.waitForURL((url) => !url.searchParams.has("search"), {
            timeout: 15_000,
        })
        expect(page.url()).not.toContain("search=")
    })

    test("reset keeps search param when only clearing modal filters", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?search=bitcoin&categories=ai", {
            waitUntil: "domcontentloaded",
        })
        await catalogPage.waitForCatalogReady()

        await catalogPage.openFilterModal()
        await page.getByTestId("filter-reset").click()
        await catalogPage.closeFilterModal()

        // Search should still be in URL, category should be gone
        expect(page.url()).toContain("search=bitcoin")
        expect(page.url()).not.toContain("categories=")
    })

    test("multiple categories in URL are comma-separated", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        await page
            .getByTestId(filterOptionTestId("category", "AI & Chatbots"))
            .click()
        await page.getByTestId(filterOptionTestId("category", "Misc")).click()
        await catalogPage.closeFilterModal()

        // Comma may be URL-encoded as %2C
        await expect(page).toHaveURL(/categories=ai(%2C|,)misc/)
        await expect(catalogPage.getFilterDescription()).toContainText(
            "AI & Chatbots",
        )
        await expect(catalogPage.getFilterDescription()).toContainText("Misc")
    })

    test("country filter updates URL and shows filtered results", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?countries=IN", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await expect(catalogPage.getFilterDescription()).toContainText(
            "Country: India",
        )
        await expect(catalogPage.getFilteredResultsHeading()).toBeVisible()
        await expect(catalogPage.getFilterIndicator()).toBeVisible()
    })

    test("modal checkboxes reflect URL filter state", async ({
        page,
        catalogPage,
    }) => {
        await page.goto("/?categories=ai", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        await catalogPage.openFilterModal()
        await catalogPage.openDropdown("Category")

        // AI & Chatbots checkbox should be checked
        const aiOption = page.getByTestId(
            filterOptionTestId("category", "AI & Chatbots"),
        )
        await expect(
            aiOption.getByRole("checkbox", { checked: true }),
        ).toBeVisible()

        // Misc checkbox should NOT be checked
        const miscOption = page.getByTestId(
            filterOptionTestId("category", "Misc"),
        )
        await expect(
            miscOption.getByRole("checkbox", { checked: false }),
        ).toBeVisible()
    })
})
