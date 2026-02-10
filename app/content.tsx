"use client"

import { Dialog, Icon, Text, useToast } from "@fedibtc/ui"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import FilteredMiniAppsList from "./components/FilteredMiniAppsList"
import MiniAppDetails from "./components/MiniAppDetails"
import MiniAppsFilter from "./components/MiniAppsFilter/MiniAppsFilter"
import Flex from "./components/flex"
import CatalogItem from "./components/item"
import MiniAppGroup from "./components/miniAppGroup"
import { useViewport } from "./components/viewport-provider"
import { Mod } from "./lib/schemas"
import { GroupContent } from "./page"

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
    const { isMobile } = useViewport()

    const [fediApiAvailable, setFediApiAvailable] = useState<boolean>(false)
    const [installedMiniApps, setInstalledMiniApps] = useState<
        { url: string }[]
    >([])
    const [filterSearch, setFilterSearch] = useState<string>("")
    const [filteredMiniApps, setFilteredMiniApps] = useState<Mod[] | null>(null)
    const [moreDetailsApp, setMoreDetailsApp] = useState<Mod | undefined>(
        undefined,
    )

    const canInstall =
        window?.fediInternal?.version === 2 &&
        "installMiniApp" in window.fediInternal

    const refreshInstalledMiniApps = useCallback(async () => {
        if (window.fediInternal?.version === 2) {
            const installedMiniapps =
                await window.fediInternal.getInstalledMiniApps()
            setInstalledMiniApps(installedMiniapps)
        }
    }, [])

    const copyMiniAppUrl = (miniApp: Mod) => {
        return navigator.clipboard
            .writeText(miniApp.url)
            .then(() => {
                toast.show("Copied to clipboard")
            })
            .catch(() => {
                toast.show(
                    "Failed to copy to clipboard, please check that your browser has the correct permissions",
                )
            })
    }

    const installMiniApp = async (miniApp: Mod) => {
        if (canInstall && window.fediInternal?.version === 2) {
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

    const allMiniAppsById: { [id: string]: Mod } = groups.reduce(
        (acc, group) => {
            const updated: { [id: string]: Mod } = {
                ...acc,
            }

            for (const mod of group.mods) {
                updated[mod.id] = mod
            }

            return updated
        },
        {},
    )

    useEffect(() => {
        if (window.fediInternal?.version >= 2) {
            // eslint-disable-next-line
            setFediApiAvailable(true)
        }
    }, [])

    useEffect(() => {
        if (fediApiAvailable) {
            // eslint-disable-next-line
            refreshInstalledMiniApps()
        }
    }, [fediApiAvailable, refreshInstalledMiniApps])

    const isMiniAppInstalled = (miniApp: Mod): boolean => {
        return installedMiniApps.some((installedMiniApp) => {
            return installedMiniApp.url === miniApp.url
        })
    }

    const targetActionType =
        canInstall && action === "install" ? "install" : "copy"

    const renderMiniApp = (miniApp: Mod) => {
        return (
            <CatalogItem
                key={`${miniApp.id}_${miniApp.categoryCode}`} // the same mini app may be in multiple categories
                content={miniApp}
                query={filterSearch}
                isInstalled={isMiniAppInstalled(miniApp)}
                targetActionType={targetActionType}
                onShowMore={() => setMoreDetailsApp(miniApp)}
                onCopy={() => copyMiniAppUrl(miniApp)}
                onInstall={() => installMiniApp(miniApp)}
            />
        )
    }

    const newMiniApps = Object.values(allMiniAppsById).filter((miniApp) => {
        return newMiniAppIds.includes(miniApp.id)
    })

    const miniAppGroups = groups.map((group) => {
        return (
            <MiniAppGroup
                key={group.meta.title}
                groupName={group.meta.title}
                miniApps={group.mods}
                renderMiniApp={renderMiniApp}
            />
        )
    })

    return (
        <Flex col className="w-full items-center">
            <Flex
                col
                gap={2}
                center
                p={4}
                width="full"
                className="max-w-[480px]"
            >
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

            {moreDetailsApp !== undefined && (
                <Dialog
                    open={moreDetailsApp !== undefined}
                    onOpenChange={() => setMoreDetailsApp(undefined)}
                    className="p-0"
                    disableClose
                >
                    <div
                        className={`${isMobile ? "h-full" : "h-[700px]"} overflow-scroll p-0!`}
                    >
                        <Icon
                            onClick={() => setMoreDetailsApp(undefined)}
                            icon="IconX"
                            width={24}
                            height={24}
                            className="absolute top-4 right-4 cursor-pointer"
                        />

                        <MiniAppDetails
                            miniApp={moreDetailsApp}
                            isInstalled={isMiniAppInstalled(moreDetailsApp)}
                            onCopy={() => copyMiniAppUrl(moreDetailsApp)}
                            onInstall={() => installMiniApp(moreDetailsApp)}
                            targetActionType={targetActionType}
                        />
                    </div>
                </Dialog>
            )}
        </Flex>
    )
}
