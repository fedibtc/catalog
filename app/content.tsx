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
  const toast = useToast()

  const [search, setSearch] = useState("")
  const [filteredGroups, setFilteredGroups] = useState(groups)

  const [injectionsApi, setInjectionsApi] = useState<
    typeof window.fediInternal | undefined
  >(undefined)
  const [installedFediMods, setInstalledFediMods] = useState<{ url: string }[]>(
    [],
  )

  useEffect(() => {
    if (injectionsApi === undefined && window?.fediInternal !== undefined) {
      setInjectionsApi(window.fediInternal)
    }
  }, [injectionsApi])

  const updateInstalledMods = useCallback(
    () => async () => {
      if (
        injectionsApi !== undefined &&
        "getInstalledMiniApps" in injectionsApi
      ) {
        const installedMods = await injectionsApi.getInstalledMiniApps()
        setInstalledFediMods(installedMods)
      }
    },
    [injectionsApi],
  )

  useEffect(() => {
    if (injectionsApi !== undefined) {
      updateInstalledMods()
    }
  }, [injectionsApi, updateInstalledMods])

  useEffect(() => {
    const condition = (mod: Mod) =>
      new RegExp(search, "gi").test(mod.name) ||
      new RegExp(search, "gi").test(mod.description)

    setFilteredGroups(
      groups
        .filter(group => group.mods.some(condition))
        .map(group => ({
          ...group,
          mods: group.mods.filter(condition),
        })),
    )
  }, [search, groups])

  const handleCopyUrl = async (mod: Mod) => {
    return navigator.clipboard.writeText(mod.url).then(() => {
      toast.show("Copied to clipboard")
    })
  }

  const canInstall =
    injectionsApi !== undefined && "installMiniApp" in injectionsApi

  const modGroupElements = filteredGroups.map((group, groupIndex) => {
    const modItemElements = group.mods.map((mod, modIndex) => {
      const isInstalled = installedFediMods.some(installedMod => {
        return installedMod.url === mod.url
      })

      const handleAction = async () => {
        if (canInstall && action === "install") {
          await injectionsApi.installMiniApp({
            id: mod.id,
            title: mod.name,
            url: mod.url,
            iconUrl: mod.iconUrl,
            description: mod.description,
          })

          await updateInstalledMods()
        } else {
          await handleCopyUrl(mod)
        }
      }

      return (
        <CatalogItem
          key={modIndex}
          content={mod}
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
          {modItemElements}
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

      {modGroupElements}
    </Flex>
  )
}
