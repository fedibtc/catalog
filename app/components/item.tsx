"use client"

import QRCode from "react-qr-code"
import { Button, Dialog, Text, useToast } from "@fedibtc/ui"
import Flex from "./flex"
import { useViewport } from "./viewport-provider"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { Mod } from "../lib/schemas"

const HighlightText = ({
    content,
    query,
}: {
    content: string
    query: string
}) => {
    if (!query) return <>{content}</>

    const parts = content.split(new RegExp(`(${query})`, "gi"))

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <strong key={index}>{part}</strong>
                ) : (
                    part
                ),
            )}
        </>
    )
}

export default function CatalogItem({
    content,
    query,
}: {
    content: Mod
    query: string
}) {
    const [isOpen, setIsOpen] = useState(false)

    const { isMobile } = useViewport()
    const toast = useToast()

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(content.url).then(() => {
            toast.show("Copied to clipboard")
        })
    }

    const installContent = (
        <Flex col gap={2} className="min-w-[320px] shrink-0">
            <Flex
                col
                gap={2}
                align="center"
                p={4}
                className="border border-extraLightGrey rounded-lg"
            >
                <QRCode value={content.url} size={256} />
            </Flex>
            <Button onClick={handleCopyUrl}>Copy URL</Button>
        </Flex>
    )

    return (
        <>
            <Container
                onClick={async () => {
                    if (isMobile) {
                        await navigator.clipboard.writeText(content.url)
                        toast.show("Copied URL to clipboard")

                        return
                    }

                    setIsOpen(true)
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={content.iconUrl}
                    width={64}
                    height={64}
                    alt={content.name}
                    className="rounded-lg border border-extraLightGrey w-16 h-16"
                />
                <Flex col gap={2}>
                    <Text weight="medium">
                        <HighlightText content={content.name} query={query} />
                    </Text>
                    <Text variant="caption">
                        <HighlightText content={content.description} query={query} />
                    </Text>
                </Flex>
            </Container>
            {isMobile ? null : (
                <Dialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={content.name}
                    description={content.description}
                >
                    {installContent}
                </Dialog>
            )}
        </>
    )
}

const Container = styled("button", {
    base: "flex gap-4 p-4 rounded-lg border border-extraLightGrey basis-0 grow min-w-[320px] cursor-pointer hover:bg-extraLightGrey/25 hover:border-lightGrey border-solid text-left transition-colors",
})
