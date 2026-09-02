import { expect, test } from "../fixtures/base"
import { miniAppGroupTestId } from "../helpers/test-ids"

test.describe("Browser Mode - Page Load & Layout", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("page title is visible", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
    })

    test("New section shows new apps", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        const newSection = catalogPage.getMiniAppGroup("New")
        await expect(newSection).toBeVisible()
        await expect(newSection.locator("[data-testid$='-icon']")).toHaveCount(
            6,
        )
    })

    test("all 6 category groups render in correct order", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        const expectedGroups = [
            "New",
            "Spend & Earn Bitcoin",
            "Misc",
            "Cash In & Cash Out",
            "Productivity",
            "Communications",
            "AI & Chatbots",
            "Games",
        ]

        const headings = page.locator("[data-testid$='-heading']")
        const headingTexts: string[] = []
        const count = await headings.count()
        for (let i = 0; i < count; i++) {
            headingTexts.push((await headings.nth(i).textContent()) || "")
        }

        expect(headingTexts.map((t) => t.trim())).toEqual(expectedGroups)
    })

    test("mini app cards show icon, name, description, and copy button", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        const firstCard = page
            .getByTestId(miniAppGroupTestId("New"))
            .locator("[data-testid^='mini-app-']")
            .first()
        await expect(firstCard.locator("[data-testid$='-icon']")).toBeVisible()
        await expect(firstCard.locator("[data-testid$='-copy']")).toBeVisible()
    })

    test("mini apps sorted alphabetically within groups", async ({
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        const spendGroup = catalogPage.getMiniAppGroup("Spend & Earn Bitcoin")

        const names: string[] = []
        const images = spendGroup.locator("[data-testid$='-icon']")
        const count = await images.count()
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute("alt")
            if (alt) names.push(alt)
        }

        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).toEqual(sorted)
    })

    test("no Add buttons visible in browser mode", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        const addButtons = page.getByRole("button", {
            name: "Add",
            exact: true,
        })
        await expect(addButtons).toHaveCount(0)
    })

    test("copy button copies URL and shows toast", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        const firstCopyButton = page.locator("[data-testid$='-copy']").first()
        await firstCopyButton.click()

        await expect(
            page.getByText("Copied to clipboard", { exact: true }),
        ).toBeVisible()
    })
})
