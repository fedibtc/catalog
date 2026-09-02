import { chromium, Page } from "@playwright/test"
import { readdirSync, readFileSync, statSync } from "fs"
import path from "path"

const OTHER_ORIGIN = "https://example.com/"
const CATALOG_URL = process.env.CATALOG_URL ?? "https://fedi-catalog.vercel.app"
const ATTEMPTS = 2

const modFiles = () =>
    readdirSync("mods")
        .map((group) => path.join("mods", group))
        .filter((group) => statSync(group).isDirectory())
        .flatMap((group) =>
            readdirSync(group)
                .map((mod) => path.join(group, mod))
                .filter((mod) => statSync(mod).isDirectory())
                .map((mod) => path.join(mod, "meta.json")),
        )

const loadInBrowser = (page: Page, url: string) =>
    page.evaluate(
        (src) =>
            new Promise<string>((resolve) => {
                const image = new Image()
                image.onload = () =>
                    resolve(
                        image.naturalWidth > 0 ? "ok" : "loaded with no pixels",
                    )
                image.onerror = () => resolve("did not load")
                setTimeout(() => resolve("timed out after 30s"), 30_000)
                image.src = src
            }),
        url,
    )

async function main() {
    const args = process.argv.slice(2)
    const files = args[0] === "--all" ? modFiles() : args

    if (files.length === 0) {
        console.log("No mods to check")
        return
    }

    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(OTHER_ORIGIN)

    const failures: string[] = []
    for (const file of files) {
        const { name, iconUrl } = JSON.parse(readFileSync(file, "utf8"))
        const url = new URL(iconUrl, CATALOG_URL).href
        let result = "did not load"
        for (
            let attempt = 0;
            attempt < ATTEMPTS && result !== "ok";
            attempt++
        ) {
            result = await loadInBrowser(page, url)
        }
        console.log(`${result === "ok" ? "ok  " : "FAIL"} ${name} ${url}`)
        if (result !== "ok") failures.push(`${name}: ${url} ${result}`)
    }

    await browser.close()

    if (failures.length > 0) {
        console.error(
            [
                "",
                "BROKEN ICONS",
                ...failures.map((failure) => `  ${failure}`),
                "",
                "Point each one at a url its own site serves to everyone, a favicon or apple",
                "touch icon usually works. A host that sends cross-origin-resource-policy",
                "answers curl fine and still shows a blank card, so check a Vercel preview.",
            ].join("\n"),
        )
        process.exit(1)
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
