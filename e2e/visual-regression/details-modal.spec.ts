import { test, expect } from "@playwright/test"

function clickMiniAppCard(page: import("@playwright/test").Page, name: string) {
    const card = page
        .locator("div.cursor-pointer")
        .filter({ has: page.locator(`img[alt="${name}"]`) })
        .first()
    return card.click()
}

test.describe("Visual Regression — Details Modal", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await expect(page.getByText("Fedi Mini Apps Catalog")).toBeVisible({
            timeout: 15_000,
        })
    })

    test("details modal structure", async ({ page }) => {
        await clickMiniAppCard(page, "Boltz")

        const dialog = page.getByRole("dialog")
        await expect(dialog).toBeVisible()
        await page.waitForTimeout(500)

        // Mask the icon to avoid external image flakiness
        const icon = dialog.locator("img[alt='Boltz']")
        await expect(dialog).toHaveScreenshot("details-modal-boltz.png", {
            mask: [icon],
        })
    })

    test("QR code view", async ({ page }) => {
        await clickMiniAppCard(page, "Boltz")

        const dialog = page.getByRole("dialog")
        await expect(dialog).toBeVisible()

        // Open QR view
        await dialog.locator(".tabler-icon-qrcode").click()
        await expect(dialog.locator("svg").first()).toBeVisible()
        await page.waitForTimeout(500)

        await expect(dialog).toHaveScreenshot("qr-code-view-boltz.png")
    })

    test("extended description toggle", async ({ page }) => {
        await clickMiniAppCard(page, "bitsimp")

        const dialog = page.getByRole("dialog")
        await expect(dialog).toBeVisible()
        await page.waitForTimeout(500)

        // Mask the icon
        const icon = dialog.locator("img[alt='bitsimp']")

        // Screenshot collapsed state
        await expect(dialog).toHaveScreenshot(
            "details-collapsed-bitsimp.png",
            { mask: [icon] },
        )

        // Expand
        await dialog.getByText("View more").click()
        await page.waitForTimeout(300)

        // Screenshot expanded state
        await expect(dialog).toHaveScreenshot(
            "details-expanded-bitsimp.png",
            { mask: [icon] },
        )
    })
})
