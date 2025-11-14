"use client"

import QRCode from "react-qr-code"
import { Button, Dialog, Text, useToast } from "@fedibtc/ui"
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
  fediApiAvailable,
  onInstall,
  isInstalled,
}: {
  content: Mod
  query: string
  fediApiAvailable: boolean
  onInstall: (mod: Mod) => Promise<void>
  isInstalled: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isInstalling, setIsInstalling] = useState<boolean>(false)

  const { isMobile } = useViewport()
  const toast = useToast()

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(content.url).then(() => {
      toast.show("Copied to clipboard")
    })
  }

  const handleInstallClick = async () => {
    setIsInstalling(true)

    try {
      await onInstall(content)
    } catch (err) {
      console.error("error installing mini-app", err)
    } finally {
      setIsInstalling(false)
    }
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

  const renderInstallButton = () => {
    if (!fediApiAvailable) {
      return null
    }

    const isDisabled = isInstalled || isInstalling
    const buttonText = isInstalled ? "Added" : "Add"

    return (
      <Button
        className="w-8 px-10 bg-black text-white"
        disabled={isDisabled}
        loading={isInstalling}
        variant="secondary"
        onClick={handleInstallClick}
      >
        {buttonText}
      </Button>
    )
  }

  return (
    <>
      <Container
        onClick={async () => {
          if (!fediApiAvailable) {
            if (isMobile) {
              await navigator.clipboard.writeText(content.url)
              toast.show("Copied URL to clipboard")

              return
            }

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

          {renderInstallButton()}
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
