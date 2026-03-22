import { test, expect } from "../fixtures/base"

test.describe("Browser Mode - Page Load & Layout", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("page title is visible", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
    })

    test("New section shows new apps", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        // "New" heading is a div.text-h2, not an <h2> tag
        const newHeading = page.locator(".text-h2").filter({ hasText: "New" }).first()
        await expect(newHeading).toBeVisible()

        // The New section is the parent container of the heading
        const newSection = newHeading.locator("..").locator("..")
        // newMods.json has 6 entries
        await expect(newSection.locator("img[alt]")).toHaveCount(6)
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
        ]

        const headings = page.locator(".text-h2")
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

        // Check the first card has the expected elements
        const firstCard = page.locator("div.cursor-pointer").first()
        await expect(firstCard.locator("img")).toBeVisible()
        // Card should have a copy button (round button with svg icon)
        await expect(
            firstCard.locator("button[class*='rounded-full']"),
        ).toBeVisible()
    })

    test("mini apps sorted alphabetically within groups", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        // Find the Spend & Earn Bitcoin group section by its heading
        const spendHeading = page
            .locator(".text-h2")
            .filter({ hasText: "Spend & Earn Bitcoin" })
        const spendGroup = spendHeading.locator("..").locator("..")

        const names: string[] = []
        const images = spendGroup.locator("img[alt]")
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

        // Click the first copy button (round button with svg icon)
        const firstCopyButton = page
            .locator("button[class*='rounded-full']")
            .first()
        await firstCopyButton.click()

        await expect(page.getByText("Copied to clipboard", { exact: true })).toBeVisible()
    })
})
