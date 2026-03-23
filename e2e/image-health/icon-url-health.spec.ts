import { test, expect } from "@playwright/test"
import {
    fetchIconHealth,
    getAllIconData,
    waitForAllImages,
} from "../fixtures/image-helpers"

test.describe("Image Health — Icon URL Validation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" })
        await expect(page.getByText("Fedi Mini Apps Catalog")).toBeVisible({
            timeout: 15_000,
        })
    })

    test("all icon URLs return valid images", async ({ page }) => {
        const icons = await getAllIconData(page)
        expect(icons.length).toBeGreaterThan(0)

        // Deduplicate URLs (same icon may appear in New + category)
        const uniqueUrls = [
            ...new Set(
                icons
                    .map((i) => i.src)
                    .filter((src) => src.startsWith("http")),
            ),
        ]

        const slowUrls: string[] = []
        const results = await Promise.all(
            uniqueUrls.map((url) => fetchIconHealth(url)),
        )

        for (const result of results) {
            expect
                .soft(result.status, `${result.url} — HTTP status`)
                .toBe(200)

            expect
                .soft(
                    result.contentType?.startsWith("image/"),
                    `${result.url} — content-type: ${result.contentType}`,
                )
                .toBe(true)

            if (result.responseTimeMs > 5000) {
                slowUrls.push(
                    `${result.url} (${result.responseTimeMs}ms)`,
                )
            }

            if (result.error) {
                expect
                    .soft(result.error, `${result.url} — fetch error`)
                    .toBeUndefined()
            }
        }

        if (slowUrls.length > 0) {
            console.warn("Slow icon URLs (>5s):\n" + slowUrls.join("\n"))
        }

        // Hard assertion: no broken URLs
        const broken = results.filter(
            (r) =>
                r.status !== 200 ||
                !r.contentType?.startsWith("image/") ||
                r.error,
        )
        expect(
            broken.length,
            `Broken icon URLs:\n${broken.map((b) => `  ${b.url} — status=${b.status}, type=${b.contentType}, error=${b.error}`).join("\n")}`,
        ).toBe(0)
    })

    test("no broken images in the browser", async ({ page }) => {
        const result = await waitForAllImages(page, 30_000)

        if (result.failed.length > 0) {
            const failedDetails = result.failed
                .map((i) => `  ${i.alt}: ${i.src}`)
                .join("\n")
            expect(
                result.failed.length,
                `Broken images in browser:\n${failedDetails}`,
            ).toBe(0)
        }

        if (result.timedOut) {
            // If timed out, some images may still be loading — report but don't fail
            // unless there are confirmed failures
            console.warn(
                "Image loading timed out — some images may still be loading",
            )
        }

        expect(result.loaded.length).toBeGreaterThan(0)
    })

    test("relative iconUrl paths resolve correctly", async ({ page }) => {
        // Wait for all images to load before checking
        await waitForAllImages(page, 30_000)

        // Get icon data including resolved src (browser resolves relative to absolute)
        const icons = await page.$$eval("img[alt]", (imgs) => {
            const origin = window.location.origin
            return imgs.map((img) => ({
                src: img.getAttribute("src") || "",
                resolvedSrc: (img as HTMLImageElement).src,
                alt: img.getAttribute("alt") || "",
                naturalWidth: (img as HTMLImageElement).naturalWidth,
                naturalHeight: (img as HTMLImageElement).naturalHeight,
                complete: (img as HTMLImageElement).complete,
                isRelative:
                    !(img.getAttribute("src") || "").startsWith("http") &&
                    (img as HTMLImageElement).src.startsWith(origin),
            }))
        })

        // Find images with relative paths in the source attribute
        const relativeIcons = icons.filter((i) => i.isRelative)

        expect(
            relativeIcons.length,
            "Expected at least one relative icon path",
        ).toBeGreaterThan(0)

        for (const icon of relativeIcons) {
            expect
                .soft(
                    icon.complete,
                    `${icon.alt} (${icon.src}) — not loaded`,
                )
                .toBe(true)
            expect
                .soft(
                    icon.naturalWidth,
                    `${icon.alt} (${icon.src}) — naturalWidth is 0`,
                )
                .toBeGreaterThan(0)
        }

        const broken = relativeIcons.filter(
            (i) => !i.complete || i.naturalWidth === 0,
        )
        expect(
            broken.length,
            `Broken relative icons:\n${broken.map((i) => `  ${i.alt}: ${i.src}`).join("\n")}`,
        ).toBe(0)
    })
})
