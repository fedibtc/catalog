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
  onCopy,
  onInstall,
  onShowMore,
}: {
  content: Mod
  query: string
  isInstalled: boolean
  targetActionType: "copy" | "install"
  onCopy: () => Promise<void>
  onInstall: () => Promise<void>
  onShowMore: () => void
}) {
  const { isMobile } = useViewport()
  const [isOpen, setIsOpen] = useState(false)
  const [isPerformingAction, setIsPerformingAction] = useState<boolean>(false)

  const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsPerformingAction(true)

    try {
      if (targetActionType === "copy") {
        await onCopy()
      } else if (targetActionType === "install") {
        await onInstall()
      }
    } finally {
      setIsPerformingAction(false)
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
    </Flex>
  )

  return (
    <>
      <Container onClick={onShowMore} className="p-2">
        <Flex grow align="center" gap={2}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.iconUrl}
            width={64}
            height={64}
            alt={content.name}
            className="rounded-lg self-start border border-extraLightGrey w-16 h-16 shrink-0"
          />
          <Flex col gap={1} grow>
            <Text weight="medium">
              <HighlightText content={content.name} query={query} />
            </Text>
            <Text variant="caption">
              <HighlightText content={content.description} query={query} />
            </Text>
          </Flex>

          <div className="flex gap-1 items-center">
            <Button
              className="rounded-full h-4 w-4 p-4"
              variant="secondary"
              onClick={handleAction}
            >
              <Icon icon="IconCopy" className="h-4 max-h-4 w-4 max-w-4" />
            </Button>

            {targetActionType === "install" && (
              <Button
                className="bg-black text-white h-8 p-4"
                disabled={isInstalled}
                loading={isPerformingAction}
                variant="secondary"
                onClick={handleAction}
              >
                {isInstalled ? "Added" : "Add"}
              </Button>
            )}
          </div>
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

const Container = styled("div", {
  base: "flex gap-4 p-4 rounded-lg border border-extraLightGrey basis-0 grow min-w-[320px] cursor-pointer hover:bg-extraLightGrey/25 hover:border-lightGrey border-solid text-left transition-colors",
})
