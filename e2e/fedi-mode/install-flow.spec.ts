import { expect, injectFediMock, test } from "../fixtures/base"

test.describe("Fedi Mode - Install Flow", () => {
    test("click Add on card changes to Added", async ({
        page,
        catalogPage,
    }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await catalogPage.waitForCatalogReady()

        const boltzCard = catalogPage.getMiniAppCard("Boltz")
        const addButton = boltzCard.getByRole("button", {
            name: "Add",
            exact: true,
        })
        await expect(addButton).toBeVisible()
        await addButton.click()

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

        const boltzCard = catalogPage.getMiniAppCard("Boltz")
        await boltzCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        await catalogPage.clickMiniAppCard("Boltz")

        const dialog = catalogPage.getDetailsDialog()
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

        const boltzCard = catalogPage.getMiniAppCard("Boltz")
        await boltzCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        const aiCard = catalogPage.getMiniAppCard("AI Assistant")
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

        const boltzCard = catalogPage.getMiniAppCard("Boltz")
        await boltzCard
            .getByRole("button", { name: "Add", exact: true })
            .click()
        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        const aiCard = catalogPage.getMiniAppCard("AI Assistant")
        await aiCard.getByRole("button", { name: "Add", exact: true }).click()
        await expect(
            aiCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()

        await expect(
            boltzCard.getByRole("button", { name: "Added", exact: true }),
        ).toBeVisible()
    })
})
