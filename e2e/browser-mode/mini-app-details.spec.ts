import { test, expect } from "../fixtures/base"

test.describe("Browser Mode - Details Modal", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("opens on card click with name, description, icon, and URL", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        // Click on Boltz card
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        await expect(dialog).toBeVisible()
        await expect(
            dialog.getByText("Boltz", { exact: true }),
        ).toBeVisible()
        await expect(
            dialog.getByText("Swap between different Bitcoin layers"),
        ).toBeVisible()
        await expect(dialog.locator("img[alt='Boltz']")).toBeVisible()
        // 96x96 icon
        await expect(dialog.locator("img[width='96']")).toBeVisible()
        await expect(
            dialog.getByText("https://boltz.exchange/"),
        ).toBeVisible()
    })

    test("QR code button shows QR view", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        // Click QR code icon (has tabler-icon class since no className override)
        await dialog.locator(".tabler-icon-qrcode").click()

        // QR code SVG should be visible (rendered by react-qr-code)
        await expect(dialog.locator("svg").first()).toBeVisible()
    })

    test("close QR returns to details", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        await dialog.locator(".tabler-icon-qrcode").click()

        // Close QR view via X button - the QR view's X has width="32" while the dialog's X has width="24"
        await dialog.locator("svg[width='32'][class*='cursor-pointer']").click()

        // Should see details again
        await expect(
            dialog.getByText("https://boltz.exchange/"),
        ).toBeVisible()
    })

    test("category badge displayed", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        await expect(dialog.getByText("Category")).toBeVisible()
        await expect(
            dialog.getByText("Cash in and cash out"),
        ).toBeVisible()
    })

    test("keyword badges displayed", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        // Timechain Calendar has keywords
        await catalogPage.clickMiniAppCard("Timechain Calendar")

        const dialog = page.getByRole("dialog")
        await expect(dialog.getByText("Keywords")).toBeVisible()
        await expect(dialog.getByText("bitcoin explorer")).toBeVisible()
    })

    test("View more/View less toggles extended description", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        // bitsimp has a long extendedDescription
        await catalogPage.clickMiniAppCard("bitsimp")

        const dialog = page.getByRole("dialog")
        await expect(dialog.getByText("View more")).toBeVisible()

        await dialog.getByText("View more").click()
        await expect(dialog.getByText("View less")).toBeVisible()

        await dialog.getByText("View less").click()
        await expect(dialog.getByText("View more")).toBeVisible()
    })

    test("X button closes the dialog", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        await expect(dialog).toBeVisible()

        // Click the X button (width=24 dialog close, with absolute positioning)
        await dialog.locator("svg[width='24'][class*='absolute'][class*='cursor-pointer']").click()
        await expect(dialog).not.toBeVisible()
    })

    test("copy URL in details shows toast", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        // Click copy in the URL section of details
        await dialog.getByText("Copy").click()

        await expect(page.getByText("Copied to clipboard", { exact: true })).toBeVisible()
    })

    test("no Add button in details modal in browser mode", async ({
        page,
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        await expect(
            dialog.getByRole("button", { name: "Add", exact: true }),
        ).not.toBeVisible()
    })
})
