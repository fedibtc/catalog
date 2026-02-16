import { Text } from "@fedibtc/ui"
import { Mod } from "../lib/schemas"
import Flex from "./flex"

type MiniAppGroupProps = {
    groupName: string
    miniApps: Mod[]
    renderMiniApp: (miniApp: Mod) => React.ReactNode
}

const MiniAppGroup = (props: MiniAppGroupProps) => {
    const { groupName, miniApps, renderMiniApp } = props

    const sortedMiniApps = [...miniApps].sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

    const miniAppElements = sortedMiniApps.map((miniApp) => {
        return renderMiniApp(miniApp)
    })

    return (
        <Flex col gap={4} p={4} width="full" className="max-w-[1200px]">
            <Flex align="center" gap={2}>
                <Text variant="h2" weight="medium">
                    {groupName}
                </Text>
            </Flex>
            <Flex row gap={2} wrap>
                {miniAppElements}
            </Flex>
        </Flex>
    )
}

export default MiniAppGroup
