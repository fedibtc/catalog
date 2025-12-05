"use client"

import QRCode from "react-qr-code"
import { Button, Dialog, Icon, Text } from "@fedibtc/ui"
import Flex from "./flex"
import { useViewport } from "./viewport-provider"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { Mod } from "../lib/schemas"

export type InstallFediModFn = () => Promise<void>

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
  isInstalled,
  targetActionType,
  onAction,
}: {
  content: Mod
  query: string
  isInstalled: boolean
  targetActionType: "copy" | "install"
  onAction: () => Promise<void>
}) {
  const { isMobile } = useViewport()
  const [isOpen, setIsOpen] = useState(false)
  const [isPerformingAction, setIsPerformingAction] = useState<boolean>(false)

  const handleAction = async () => {
    setIsPerformingAction(true)
    await onAction()
    setIsPerformingAction(false)
  }

  const renderActionButton = () => {
    if (targetActionType === 'install') {
      const installButtonText = isInstalled ? "Added" : "Add"

      return (
        <Button
          className="w-8 px-10 bg-black text-white"
          disabled={isInstalled}
          loading={isPerformingAction}
          variant="secondary"
          onClick={handleAction}
        >
          {installButtonText}
        </Button>
      )
    } else {
      return (
        <Button
          className="rounded-full p-3"
          variant="secondary"
          onClick={handleAction}
        >
          <Icon icon="IconCopy" className="h-6 max-h-6 w-6 max-w-6" />
        </Button>
      )
    }
  }

  const modalContent = (
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

      {renderActionButton()}
    </Flex>
  )

  return (
    <>
      <Container
        onClick={async () => {
          if (!isMobile) {
            await onAction()
            setIsOpen(true)
          }
        }}
      >
        <Flex grow gap={2}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.iconUrl}
            width={64}
            height={64}
            alt={content.name}
            className="rounded-lg border border-extraLightGrey w-16 h-16 shrink-0"
          />
          <Flex col gap={2} grow>
            <Text weight="medium">
              <HighlightText content={content.name} query={query} />
            </Text>
            <Text variant="caption">
              <HighlightText content={content.description} query={query} />
            </Text>
          </Flex>

          {renderActionButton()}
        </Flex>
      </Container>
      {!isMobile && (
        <Dialog
          open={isOpen}
          onOpenChange={setIsOpen}
          title={content.name}
          description={content.description}
        >
          {modalContent}
        </Dialog>
      )}
    </>
  )
}

const Container = styled("button", {
  base: "flex gap-4 p-4 rounded-lg border border-extraLightGrey basis-0 grow min-w-[320px] cursor-pointer hover:bg-extraLightGrey/25 hover:border-lightGrey border-solid text-left transition-colors",
})
