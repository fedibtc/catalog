import { test, expect, injectFediMock } from "../fixtures/base"

test.describe("Fedi Mode - Install Flow", () => {
    test("click Add on card changes to Added", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Find the Boltz card and click its Add button
        const boltzCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='Boltz']") })
            .first()
        const addButton = boltzCard.getByRole("button", {
            name: "Add",
            exact: true,
        })
        await expect(addButton).toBeVisible()
        await addButton.click()

        // Should change to "Added" and be disabled
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeDisabled()
    })

    test("after installing, app shows Added in details modal", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Install Boltz from card
        const boltzCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='Boltz']") })
            .first()
        await boltzCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        // Open details modal
        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = page.getByRole("dialog")
        await expect(
            dialog.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()
        await expect(
            dialog.getByRole("button", { name: "Added", exact: true }),
        ).toBeDisabled()
    })

    test("installing one app does not affect other apps", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Install Boltz
        const boltzCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='Boltz']") })
            .first()
        await boltzCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        // Another app should still have "Add" (not "Added")
        const aiCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='AI Assistant']") })
            .first()
        await expect(
            aiCard.getByRole("button", { name: "Add", exact: true }),
        ).toBeVisible()
    })

    test("multiple apps can be installed in sequence", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        // Install Boltz
        const boltzCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='Boltz']") })
            .first()
        await boltzCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        // Install AI Assistant
        const aiCard = page
            .locator("div.cursor-pointer")
            .filter({ has: page.locator("img[alt='AI Assistant']") })
            .first()
        await aiCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            aiCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        // Both should still show "Added"
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()
    })
})
