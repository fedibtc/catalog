import { expect, injectFediMock, test } from "../fixtures/base"

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

        const boltzCard = catalogPage.getMiniAppCard("Boltz")
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

        const firstCopyButton = page.locator("[data-testid$='-copy']").first()
        await firstCopyButton.click()
        await expect(
            page.getByText("Copied to clipboard", { exact: true }),
        ).toBeVisible()
    })
})
