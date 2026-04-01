import { expect, test } from "../fixtures/base"
import { miniAppTestId } from "../helpers/test-ids"

test.describe("Browser Mode - Details Modal", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
    })

    test("opens on card click with name, description, icon, and URL", async ({
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()

        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await expect(dialog).toBeVisible()
        await expect(dialog.getByText("Boltz", { exact: true })).toBeVisible()
        await expect(
            dialog.getByText("Swap between different Bitcoin layers"),
        ).toBeVisible()
        await expect(dialog.locator("img[alt='Boltz']")).toBeVisible()
        await expect(dialog.locator("img[width='96']")).toBeVisible()
        await expect(dialog.getByText("https://boltz.exchange/")).toBeVisible()
    })

    test("QR code button shows QR view", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-qr-open`)
            .click()

        await expect(
            dialog.getByTestId(`${miniAppTestId("Boltz")}-details-qr-view`),
        ).toBeVisible()
    })

    test("close QR returns to details", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-qr-open`)
            .click()

        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-qr-close`)
            .click()

        await expect(dialog.getByText("https://boltz.exchange/")).toBeVisible()
    })

    test("category badge displayed", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await expect(dialog.getByText("Category")).toBeVisible()
        await expect(dialog.getByText("Cash in and cash out")).toBeVisible()
    })

    test("keyword badges displayed", async ({ catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Timechain Calendar")

        const dialog = catalogPage.getDetailsDialog()
        await expect(dialog.getByText("Keywords")).toBeVisible()
        await expect(dialog.getByText("bitcoin explorer")).toBeVisible()
    })

    test("View more/View less toggles extended description", async ({
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("bitsimp")

        const dialog = catalogPage.getDetailsDialog()
        await expect(dialog.getByText("View more")).toBeVisible()

        await dialog.getByText("View more").click()
        await expect(dialog.getByText("View less")).toBeVisible()

        await dialog.getByText("View less").click()
        await expect(dialog.getByText("View more")).toBeVisible()
    })

    test("X button closes the dialog", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await expect(dialog).toBeVisible()

        await page.getByTestId("mini-app-details-dialog-close").click()
        await expect(dialog).not.toBeVisible()
    })

    test("copy URL in details shows toast", async ({ page, catalogPage }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-copy`)
            .click()

        await expect(
            page.getByText("Copied to clipboard", { exact: true }),
        ).toBeVisible()
    })

    test("no Add button in details modal in browser mode", async ({
        catalogPage,
    }) => {
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await expect(
            dialog.getByRole("button", { name: "Add", exact: true }),
        ).not.toBeVisible()
    })
})
