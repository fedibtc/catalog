"use client"

import { Text, Input } from "@fedibtc/ui"
import Flex from "./components/flex"
import CatalogItem from "./components/item"
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

    return (
        <Flex col className="w-full items-center" gap={8}>
            <Flex col gap={4} center p={4} width="full" className="max-w-[480px]">
                <Text variant="h1" weight="medium">
                    Fedi Mods Catalog
                </Text>
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search"
                />
            </Flex>

            {filteredGroups.map((group, i) => (
                <Flex key={i} col gap={4} p={4} width="full" className="max-w-[1200px]">
                    <Text variant="h2" weight="medium">
                        {group.meta.title}
                    </Text>
                    <Flex row gap={2} wrap key={i}>
                        {group.mods.map((mod, j) => (
                            <CatalogItem key={j} content={mod} query={search} />
                        ))}
                    </Flex>
                </Flex>
            ))}
        </Flex>
    )
}
