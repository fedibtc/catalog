import { Icon, Text } from "@fedibtc/ui"
import pluralize from "../lib/pluralize"
import { Mod } from "../lib/schemas"
import Flex from "./flex"

type FilteredMiniAppsListProps = {
    miniApps: Mod[]
    renderMiniApp: (miniApp: Mod) => React.ReactNode
}

const FilteredMiniAppsList = (props: FilteredMiniAppsListProps) => {
    const { miniApps, renderMiniApp } = props

    const sortedMiniApps = [
        ...miniApps.sort((a, b) => {
            return a.name.localeCompare(b.name)
        }),
    ]

    const miniAppElements = sortedMiniApps.map((miniApp) =>
        renderMiniApp(miniApp),
    )

    if (miniAppElements.length === 0) {
        return (
            <Flex col align="center" gap={1}>
                <Icon icon="IconBan" size="md" className="text-gray-500" />
                <Text weight="bold" className="text-gray-500">
                    No results found
                </Text>
                <Text className="text-gray-500 text-xs">
                    There are no mini apps available for the selected filter
                </Text>
            </Flex>
        )
    } else {
        return (
            <Flex col gap={4} p={4} width="full" className="max-w-[1200px]">
                <Text variant="h2" weight="medium">
                    {miniAppElements.length} Filtered{" "}
                    {pluralize(miniAppElements.length, "Result")}
                </Text>

                {miniAppElements}
            </Flex>
        )
    }
}

export default FilteredMiniAppsList
