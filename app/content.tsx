"use client"

import { Text, Input, useFediInjection, useToast } from "@fedibtc/ui"
import Flex from "./components/flex"
import CatalogItem, { InstallFediModFn } from "./components/item"
import { GroupContent } from "./page"
import { useEffect, useState } from "react"
import { Mod } from "./lib/schemas"

export default function PageContent({
  groups,
}: {
  groups: Array<GroupContent>
}) {
  const [search, setSearch] = useState("")
  const [filteredGroups, setFilteredGroups] = useState(groups)
  const [fediApiAvailable, setFediApiAvailable] = useState<boolean>(false)
  const [installedFediMods, setInstalledFediMods] = useState<{ id: string }[]>(
    [],
  )
  const toast = useToast()

  useEffect(() => {
    setFediApiAvailable(typeof window?.fediInternal !== undefined)
  }, [])

  const getInstalledMods = async () => {
    const installedMods = await window.fediInternal?.getInstalledFediMods?.()

    if (installedMods) {
      setInstalledFediMods(installedMods)
    }
  }

  useEffect(() => {
    if (fediApiAvailable) {
      getInstalledMods()
    }
  }, [fediApiAvailable])

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

  const installFediMod = async (mod: Mod) => {
    if (fediApiAvailable) {
      await window.fediInternal?.installFediMod?.({
        id: mod.id,
        title: mod.name,
        url: mod.url,
        iconUrl: mod.iconUrl,
        description: mod.description,
      })
      getInstalledMods()
    }
  }

  const modGroupElements = filteredGroups.map((group, groupIndex) => {
    const modItemElements = group.mods.map((mod, modIndex) => {
      const isInstalled = installedFediMods.some(installedMod => {
        return installedMod.id === mod.id
      })

      return (
        <CatalogItem
          key={modIndex}
          content={mod}
          query={search}
          fediApiAvailable={fediApiAvailable}
          onInstall={installFediMod}
          isInstalled={isInstalled}
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
