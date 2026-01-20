import { Icon, Text } from "@fedibtc/ui"
import { useState } from "react"

import Flex from "./flex"

type DropdownProps = {
    children: React.ReactNode
    title: string
}

const Dropdown = (props: DropdownProps) => {
    const { title, children } = props

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleDropdown = () => {
        setIsOpen((prev) => {
            return !prev
        })
    }

    return (
        <Flex col gap={2}>
            <Flex justify="between" onClick={toggleDropdown}>
                <Text className="font-bold">{title}</Text>

                <Icon
                    icon={`${isOpen ? "IconChevronUp" : "IconChevronDown"}`}
                    size="sm"
                />
            </Flex>

            {isOpen && children}
        </Flex>
    )
}

export default Dropdown
