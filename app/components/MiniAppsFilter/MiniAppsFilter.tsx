import { Input } from "@fedibtc/ui"
import { useCallback, useEffect, useState } from "react"
import { Mod } from "../../lib/schemas"
import Flex from "../flex"

type MiniAppsFilterProps = {
    allMiniApps: Mod[]
    onFilteredListChange: (filteredMiniApps: Mod[] | null) => void
    onFilterSearchChange: (search: string) => void
}

const MiniAppsFilter = (props: MiniAppsFilterProps) => {
    const { allMiniApps, onFilteredListChange, onFilterSearchChange } = props

    const [miniAppSearch, setMiniAppSearch] = useState<string>("")

    const matchesSearch = useCallback(
        (miniApp: Mod) => {
            const matchesName = new RegExp(miniAppSearch, "gi").test(
                miniApp.name,
            )
            const matchesDescription = new RegExp(miniAppSearch, "gi").test(
                miniApp.description,
            )
            const matchesKeyword = miniApp.keywords.some((keyword) =>
                new RegExp(miniAppSearch, "gi").test(keyword),
            )

            return (
                miniAppSearch.length === 0 ||
                matchesName ||
                matchesDescription ||
                matchesKeyword
            )
        },
        [miniAppSearch],
    )

    useEffect(() => {
        onFilterSearchChange(miniAppSearch)
        onFilteredListChange(allMiniApps.filter(matchesSearch))
    }, [
        miniAppSearch,
        onFilterSearchChange,
        onFilteredListChange,
        allMiniApps,
        matchesSearch,
    ])

    return (
        <Flex col width="full">
            <Flex align="center" width="full" gap={2}>
                <Input
                    width="full"
                    value={miniAppSearch}
                    onChange={(e) => setMiniAppSearch(e.currentTarget.value)}
                    placeholder="Search Mini Apps or keywords"
                />
            </Flex>
        </Flex>
    )
}

export default MiniAppsFilter
