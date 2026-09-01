import { expect, injectFediMock, test } from "../fixtures/base"
import { miniAppTestId } from "../helpers/test-ids"

test.describe("Fedi Mode - Details Modal", () => {
    test("Add button visible in details modal", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await expect(
            dialog.getByRole("button", { name: "Add", exact: true }),
        ).toBeVisible()
    })

    test("Added (disabled) in details for pre-installed apps", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page, {
            installedApps: [{ url: "https://boltz.exchange/" }],
        })
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        const addedButton = dialog.getByRole("button", {
            name: "Added",
            exact: true,
        })
        await expect(addedButton).toBeVisible()
        await expect(addedButton).toBeDisabled()
    })

    test("QR code and copy URL still work alongside Add button", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
        await expect(
            dialog.getByRole("button", { name: "Add", exact: true }),
        ).toBeVisible()

        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-qr-open`)
            .click()
        await expect(
            dialog.getByTestId(`${miniAppTestId("Boltz")}-details-qr-view`),
        ).toBeVisible()
        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-qr-close`)
            .click()

        await dialog
            .getByTestId(`${miniAppTestId("Boltz")}-details-copy`)
            .click()
        await expect(
            page.getByText("Copied to clipboard", { exact: true }),
        ).toBeVisible()
    })

    test("all detail fields display correctly with fedi mode", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Timechain Calendar")

        const dialog = catalogPage.getDetailsDialog()
        await expect(dialog.getByText("Category")).toBeVisible()
        await expect(dialog.getByText("Misc")).toBeVisible()
        await expect(dialog.getByText("Keywords")).toBeVisible()
        await expect(dialog.getByText("bitcoin explorer")).toBeVisible()
        await expect(dialog.getByText("View more")).toBeVisible()
    })
})
