"use client"

import { Text, Input, useToast } from "@fedibtc/ui"
import Flex from "./components/flex"
import CatalogItem from "./components/item"
import { GroupContent } from "./page"
import { useCallback, useEffect, useState } from "react"
import { Mod } from "./lib/schemas"
import { useSearchParams } from "next/navigation"

export default function PageContent({
  groups,
}: {
  groups: Array<GroupContent>
}) {
  const searchParams = useSearchParams()
  const action = searchParams.get("action") || "install"
  const [fediApiAvailable, setFediApiAvailable] = useState<boolean>(false)
  const toast = useToast()

  const [search, setSearch] = useState("")
  const [filteredGroups, setFilteredGroups] = useState(groups)

  const [installedMiniApps, setInstalledMiniApps] = useState<{ url: string }[]>(
    [],
  )

  useEffect(() => {
    if (window.fediInternal?.version === 2) {
      setFediApiAvailable(true)
    }
  }, [])

  const updateInstalledMiniapps = useCallback(async () => {
    if (window.fediInternal?.version === 2) {
      const installedMiniapps = await window.fediInternal.getInstalledMiniApps()
      setInstalledMiniApps(installedMiniapps)
    }
  }, [])

  useEffect(() => {
    if (fediApiAvailable) {
      updateInstalledMiniapps()
    }
  }, [fediApiAvailable, updateInstalledMiniapps])

  useEffect(() => {
    const condition = (miniApp: Mod) =>
      new RegExp(search, "gi").test(miniApp.name) ||
      new RegExp(search, "gi").test(miniApp.description)

    setFilteredGroups(
      groups
        .filter(group => group.mods.some(condition))
        .map(group => ({
          ...group,
          mods: group.mods.filter(condition),
        })),
    )
  }, [search, groups])

  const handleCopyUrl = async (miniApp: Mod) => {
    return navigator.clipboard.writeText(miniApp.url).then(() => {
      toast.show("Copied to clipboard")
    })
  }

  const canInstall = fediApiAvailable

  const miniAppGroupElements = filteredGroups.map((group, groupIndex) => {
    const miniAppItemElements = group.mods.map((miniApp, index) => {
      const isInstalled = installedMiniApps.some(installedMiniApp => {
        return installedMiniApp.url === miniApp.url
      })

      const handleAction = async () => {
        if (
          canInstall &&
          action === "install" &&
          window.fediInternal?.version === 2
        ) {
          await window.fediInternal.installMiniApp({
            id: miniApp.id,
            title: miniApp.name,
            url: miniApp.url,
            imageUrl: miniApp.iconUrl,
            description: miniApp.description,
          })

          await updateInstalledMiniapps()
        } else {
          await handleCopyUrl(miniApp)
        }
      }

      return (
        <CatalogItem
          key={index}
          content={miniApp}
          query={search}
          onAction={handleAction}
          isInstalled={isInstalled}
          targetActionType={
            canInstall && action === "install" ? "install" : "copy"
          }
        />
      )
    })

    return (
      <Flex
        key={groupIndex}
        col
        gap={4}
        p={4}
        width="full"
        className="max-w-[1200px]"
      >
        <Flex align="center" gap={2}>
          {group.meta.title === "New" && (
            <div className="rounded-full p-1.5 bg-red-500" />
          )}
          <Text variant="h2" weight="medium">
            {group.meta.title}
          </Text>
        </Flex>
        <Flex row gap={2} wrap key={groupIndex}>
          {miniAppItemElements}
        </Flex>
      </Flex>
    )
  })

  return (
    <Flex col className="w-full items-center" gap={8}>
      <Flex col gap={4} center p={4} width="full" className="max-w-[480px]">
        <Text variant="h1" weight="medium">
          Fedi Mini Apps Catalog
        </Text>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
        />
      </Flex>

      {miniAppGroupElements}
    </Flex>
  )
}
