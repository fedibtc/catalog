import { test, expect, injectFediMock } from "../fixtures/base"

test.describe("Fedi Mode - Page Load with Fedi API", () => {
    test("page loads with fedi mock injected", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
    })

    test("Add buttons visible on mini app cards", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        const addButtons = page.getByRole("button", {
            name: "Add",
            exact: true,
        })
        // Should have Add buttons (at least one)
        expect(await addButtons.count()).toBeGreaterThan(0)
    })

    test("Added (disabled) for pre-installed apps", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page, {
            installedApps: [{ url: "https://boltz.exchange/" }],
        })
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Find the Boltz card by its img alt
        const boltzCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='Boltz']") })
            .first()
        const addedButton = boltzCard.getByRole("button", {
            name: "Added",
            exact: true,
        })
        await expect(addedButton).toBeVisible()
        await expect(addedButton).toBeDisabled()
    })

    test("all 6 category groups render with fedi mode", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        const expectedGroups = [
            "Spend & Earn Bitcoin",
            "Misc",
            "Cash In & Cash Out",
            "Productivity",
            "Communications",
            "AI & Chatbots",
        ]

        for (const group of expectedGroups) {
            await expect(
                page.locator(".text-h2").filter({ hasText: group }),
            ).toBeVisible()
        }
    })

    test("copy button still works in fedi mode", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Click a copy button (round button with svg icon on card)
        const firstCopyButton = page
            .locator("button[class*='rounded-full']")
            .first()
        await firstCopyButton.click()
        await expect(page.getByText("Copied to clipboard", { exact: true })).toBeVisible()
    })
})
