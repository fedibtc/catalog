import { Text } from "@fedibtc/ui"
import Flex from "./components/flex"
import path from "path"
import { Mod, ModGroup, groupSchema } from "./lib/schemas"
import { readFileSync, readdirSync } from "fs"
import CatalogItem from "./components/item"

export interface ModContent {
  meta: Mod
  readme: string | null
}

export interface GroupContent {
  meta: ModGroup
  mods: Array<ModContent>
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
            let readme: null | string = null

            try {
              readme = readFileSync(
                path.join("mods", dir, mod, "README.md"),
                "utf8",
              )
            } catch {}

            return {
              meta,
              readme,
            }
          } catch (e) {
            return null
          }
        })

        return {
          meta: groupSchema.parse(meta),
          mods: mods.filter(Boolean) as Array<ModContent>,
        }
      } catch (e) {
        return null
      }
    })
    .filter(Boolean) as Array<GroupContent>

  return (
    <Flex col className="w-full items-center" gap={8}>
      <Flex center p={4}>
        <Text variant="h1" weight="medium">
          Fedi Mods Catalog
        </Text>
      </Flex>

      {groups.map((group, i) => (
        <Flex key={i} col gap={4} p={4} width="full" className="max-w-[1200px]">
          <Text variant="h2" weight="medium">
            {group.meta.title}
          </Text>
          <Flex row gap={2} wrap key={i}>
            {group.mods.map((mod, j) => (
              <CatalogItem key={j} content={mod} />
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
