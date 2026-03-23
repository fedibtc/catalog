import { test, expect } from "@playwright/test"
import { injectFediMock } from "../helpers/fedi-mock"

test.describe("Visual Regression — Catalog Layout", () => {
    test("full catalog layout", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await expect(page.getByText("Fedi Mini Apps Catalog")).toBeVisible({
            timeout: 15_000,
        })

        // Wait for page to settle
        await page.waitForTimeout(1000)

        // Mask all icons to avoid external image flakiness
        const icons = page.locator("img[alt]")
        const iconCount = await icons.count()
        const maskElements = []
        for (let i = 0; i < iconCount; i++) {
            maskElements.push(icons.nth(i))
        }

        await expect(page).toHaveScreenshot("full-catalog.png", {
            fullPage: true,
            mask: maskElements,
        })
    })

    test("per-category sections", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await expect(page.getByText("Fedi Mini Apps Catalog")).toBeVisible({
            timeout: 15_000,
        })

        await page.waitForTimeout(1000)

        const headings = page.locator(".text-h2")
        const count = await headings.count()

        for (let i = 0; i < count; i++) {
            const heading = headings.nth(i)
            const text = (await heading.textContent())?.trim() || `section-${i}`

            // The section is the grandparent of the heading
            const section = heading.locator("..").locator("..")
            await section.scrollIntoViewIfNeeded()
            await page.waitForTimeout(300)

            // Mask icons within this section
            const sectionIcons = section.locator("img[alt]")
            const sectionIconCount = await sectionIcons.count()
            const maskElements = []
            for (let j = 0; j < sectionIconCount; j++) {
                maskElements.push(sectionIcons.nth(j))
            }

            const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            await expect(section).toHaveScreenshot(
                `section-${slug}.png`,
                { mask: maskElements },
            )
        }
    })

    test("card layout with Add button in fedi mode", async ({ page }) => {
        await injectFediMock(page)
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await expect(page.getByText("Fedi Mini Apps Catalog")).toBeVisible({
            timeout: 15_000,
        })

        await page.waitForTimeout(1000)

        // Find a card that has an Add button
        const card = page
            .locator("div.cursor-pointer")
            .filter({
                has: page.getByRole("button", { name: "Add", exact: true }),
            })
            .first()
        await expect(card).toBeVisible()

        // Mask the icon in this card
        const cardIcon = card.locator("img[alt]")
        await expect(card).toHaveScreenshot("card-with-add-button.png", {
            mask: [cardIcon],
        })
    })
})
