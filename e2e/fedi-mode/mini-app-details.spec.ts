import { test, expect, injectFediMock } from "../fixtures/base"

test.describe("Fedi Mode - Details Modal", () => {
    test("Add button visible in details modal", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
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

        const dialog = page.getByRole("dialog")
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

        const dialog = page.getByRole("dialog")

        // Add button visible
        await expect(
            dialog.getByRole("button", { name: "Add", exact: true }),
        ).toBeVisible()

        // QR code works
        await dialog.locator(".tabler-icon-qrcode").click()
        await expect(dialog.locator("svg").first()).toBeVisible()
        // QR view's X has width="32", dialog's X has width="24"
        await dialog.locator("svg[width='32'][class*='cursor-pointer']").click()

        // Copy works
        await dialog.getByText("Copy").click()
        await expect(page.getByText("Copied to clipboard", { exact: true })).toBeVisible()
    })

    test("all detail fields display correctly with fedi mode", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()
        await catalogPage.clickMiniAppCard("Timechain Calendar")

        const dialog = page.getByRole("dialog")
        // Category
        await expect(dialog.getByText("Category")).toBeVisible()
        await expect(dialog.getByText("Misc")).toBeVisible()
        // Keywords
        await expect(dialog.getByText("Keywords")).toBeVisible()
        await expect(dialog.getByText("bitcoin explorer")).toBeVisible()
        // Extended description
        await expect(dialog.getByText("View more")).toBeVisible()
    })
})
