import { Page } from "@playwright/test"

type IconData = {
    src: string
    alt: string
    naturalWidth: number
    naturalHeight: number
    complete: boolean
}

type ImageLoadResult = {
    loaded: IconData[]
    failed: IconData[]
    timedOut: boolean
}

type IconHealthResult = {
    url: string
    status: number | null
    contentType: string | null
    responseTimeMs: number
    error?: string
}

export async function getAllIconData(page: Page): Promise<IconData[]> {
    return page.$$eval("img[alt]", (imgs) =>
        imgs.map((img) => ({
            src: img.getAttribute("src") || "",
            alt: img.getAttribute("alt") || "",
            naturalWidth: (img as HTMLImageElement).naturalWidth,
            naturalHeight: (img as HTMLImageElement).naturalHeight,
            complete: (img as HTMLImageElement).complete,
        })),
    )
}

export async function waitForAllImages(
    page: Page,
    timeout = 30_000,
): Promise<ImageLoadResult> {
    const deadline = Date.now() + timeout

    while (Date.now() < deadline) {
        const icons = await getAllIconData(page)
        const loaded = icons.filter((i) => i.complete && i.naturalWidth > 0)
        const failed = icons.filter((i) => i.complete && i.naturalWidth === 0)
        const pending = icons.filter((i) => !i.complete)

        if (pending.length === 0) {
            return { loaded, failed, timedOut: false }
        }

        await page.waitForTimeout(500)
    }

    const icons = await getAllIconData(page)
    return {
        loaded: icons.filter((i) => i.complete && i.naturalWidth > 0),
        failed: icons.filter(
            (i) => !i.complete || (i.complete && i.naturalWidth === 0),
        ),
        timedOut: true,
    }
}

export async function fetchIconHealth(
    url: string,
): Promise<IconHealthResult> {
    const start = Date.now()
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10_000),
        })
        const contentType = response.headers.get("content-type")
        return {
            url,
            status: response.status,
            contentType,
            responseTimeMs: Date.now() - start,
        }
    } catch (err) {
        return {
            url,
            status: null,
            contentType: null,
            responseTimeMs: Date.now() - start,
            error: err instanceof Error ? err.message : String(err),
        }
    }
}
