import { Page } from "@playwright/test"

export const brokenIcons = (page: Page) =>
    page.locator("[data-testid$='-icon']").evaluateAll((elements) =>
        elements
            .filter(
                (element): element is HTMLImageElement =>
                    element instanceof HTMLImageElement,
            )
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map(
                (img) =>
                    `${img.alt}: ${img.getAttribute("src")} ${img.complete ? "did not decode" : "never finished loading"}`,
            ),
    )
