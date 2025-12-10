"use client"

import { Text, useToast } from "@fedibtc/ui"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import CatalogItem from "./components/item"
import Flex from "./components/flex"
import { Mod } from "./lib/schemas"
import { GroupContent } from "./page"
import FilteredMiniAppsList from "./components/FilteredMiniAppsList"
import MiniAppsFilter from "./components/MiniAppsFilter/MiniAppsFilter"
import MiniAppGroup from "./components/miniAppGroup"

export default function PageContent({
  groups,
  newMiniAppIds,
}: {
  groups: Array<GroupContent>
  newMiniAppIds: Array<string>
}) {
  const searchParams = useSearchParams()
  const action = searchParams.get("action") || "install"
  const toast = useToast()

  const [fediApiAvailable, setFediApiAvailable] = useState<boolean>(false)
  const [installedMiniApps, setInstalledMiniApps] = useState<{ url: string }[]>(
    [],
  )
  const [filterSearch, setFilterSearch] = useState<string>("")
  const [filteredMiniApps, setFilteredMiniApps] = useState<Mod[] | null>(null)

  const canInstall =
    window?.fediInternal?.version === 2 &&
    "installMiniApp" in window.fediInternal

  const refreshInstalledMiniApps = useCallback(async () => {
    if (window.fediInternal?.version === 2) {
      const installedMiniapps = await window.fediInternal.getInstalledMiniApps()
      setInstalledMiniApps(installedMiniapps)
    }
  }, [])

  const copyMiniAppUrl = (miniApp: Mod) => {
    return navigator.clipboard.writeText(miniApp.url).then(() => {
      toast.show("Copied to clipboard")
    })
  }

  const installMiniApp = async (miniApp: Mod) => {
    if (canInstall) {
      await window.fediInternal?.installMiniApp({
        id: miniApp.id,
        title: miniApp.name,
        url: miniApp.url,
        imageUrl: miniApp.iconUrl,
        description: miniApp.description,
      })

      await refreshInstalledMiniApps()
    }
  }

  const allMiniAppsById: { [id: string]: Mod } = groups.reduce((acc, group) => {
    const updated: { [id: string]: Mod } = {
      ...acc,
    }

    for (const mod of group.mods) {
      updated[mod.id] = mod
    }

    return updated
  }, {})

  useEffect(() => {
    if (window.fediInternal?.version === 2) {
      setFediApiAvailable(true)
    }
  }, [])

  useEffect(() => {
    if (fediApiAvailable) {
      refreshInstalledMiniApps()
    }
  }, [fediApiAvailable, refreshInstalledMiniApps])

  const renderMiniApp = (miniApp: Mod) => {
    const isInstalled = installedMiniApps.some(installedMiniApp => {
      return installedMiniApp.url === miniApp.url
    })

    const targetActionType =
      canInstall && action === "install" ? "install" : "copy"

    return (
      <CatalogItem
        key={`${miniApp.id}_${miniApp.categoryCode}`} // the same mini app may be in multiple categories
        content={miniApp}
        query={filterSearch}
        isInstalled={isInstalled}
        targetActionType={targetActionType}
        onCopy={copyMiniAppUrl}
        onInstall={installMiniApp}
      />
    )
  }

  const newMiniApps = Object.values(allMiniAppsById).filter(miniApp => {
    return newMiniAppIds.includes(miniApp.id)
  })

  const miniAppGroups = groups.map(group => {
    return (
      <MiniAppGroup
        groupName={group.meta.title}
        miniApps={group.mods}
        renderMiniApp={renderMiniApp}
      />
    )
  })

  return (
    <Flex col className="w-full items-center">
      <Flex col gap={2} center p={4} width="full" className="max-w-[480px]">
        <Text variant="h1" weight="medium">
          Fedi Mini Apps Catalog
        </Text>

        <MiniAppsFilter
          allMiniApps={Object.values(allMiniAppsById)}
          onFilteredListChange={setFilteredMiniApps}
          onFilterSearchChange={setFilterSearch}
        />
      </Flex>

      {filteredMiniApps !== null && (
        <FilteredMiniAppsList
          miniApps={filteredMiniApps}
          renderMiniApp={renderMiniApp}
        />
      )}

      <MiniAppGroup
        groupName="New"
        miniApps={newMiniApps}
        renderMiniApp={renderMiniApp}
      />

      {miniAppGroups}
    </Flex>
  )
}
