import path from "path"
import { Mod, ModGroup, groupSchema, modSchema } from "./lib/schemas"
import { readFileSync, readdirSync } from "fs"
import PageContent from "./content"
import { Suspense } from "react"

export interface GroupContent {
  meta: ModGroup
  mods: Array<Mod>
}

export default async function Index() {
  const groups = readdirSync("mods")
    .map(dir => {
      try {
        const meta = JSON.parse(
          readFileSync(path.join("mods", dir, "meta.json"), "utf8"),
        )

        const mods = readdirSync(path.join("mods", dir)).map(mod => {
          try {
            const meta = JSON.parse(
              readFileSync(path.join("mods", dir, mod, "meta.json"), "utf8"),
            )

            return modSchema.parse({
              ...meta,
              categoryCode: dir,
            })
            // return meta
          } catch (e) {
            return null
          }
        })

        return {
          meta: groupSchema.parse(meta),
          mods: mods.filter(Boolean) as Array<Mod>,
        }
      } catch (e) {
        return null
      }
    })
    .filter(Boolean) as Array<GroupContent>

  groups.sort((a, b) => a.meta.order - b.meta.order)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent groups={groups} />
    </Suspense>
  )
}
