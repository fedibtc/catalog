import { Icon, Text } from "@fedibtc/ui"
import { useState } from "react"
import { dropdownTestId } from "../../e2e/helpers/test-ids"

import Flex from "./flex"

type DropdownProps = {
    children: React.ReactNode
    title: string
}

const Dropdown = (props: DropdownProps) => {
    const { title, children } = props

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const testId = dropdownTestId(title)

    const toggleDropdown = () => {
        setIsOpen((prev) => {
            return !prev
        })
    }

    return (
        <Flex col gap={2}>
            <Flex
                justify="between"
                onClick={toggleDropdown}
                data-testid={`${testId}-trigger`}
            >
                <Text className="font-bold">{title}</Text>

                <Icon
                    icon={`${isOpen ? "IconChevronUp" : "IconChevronDown"}`}
                    size="sm"
                />
            </Flex>

            {isOpen && <div data-testid={`${testId}-content`}>{children}</div>}
        </Flex>
    )
}

export default Dropdown
