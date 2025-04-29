import path from "path"
import { Mod, ModGroup, groupSchema } from "./lib/schemas"
import { readFileSync, readdirSync } from "fs"
import PageContent from "./content"

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

            return meta
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

  return <PageContent groups={groups} />
}
