"use client"

import QRCode from "react-qr-code"
import { Button, Dialog, Text, useToast } from "@fedibtc/ui"
import { ModContent } from "../page"
import Flex from "./flex"
import { useViewport } from "./viewport-provider"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import * as Tabs from "@radix-ui/react-tabs"
import sanitizeHtml from "sanitize-html"
import { marked } from "marked"

const clean = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: [
      "em",
      "strong",
      "a",
      "code",
      "br",
      "s",
      "strike",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "ul",
      "ol",
      "li",
      "p",
      "pre",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target"],
    },
  })

export default function CatalogItem({ content }: { content: ModContent }) {
  const [isOpen, setIsOpen] = useState(false)

  const { isMobile } = useViewport()
  const toast = useToast()

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(content.meta.url).then(() => {
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
        <QRCode value={content.meta.url} size={256} />
      </Flex>
      <Button onClick={handleCopyUrl}>Copy URL</Button>
    </Flex>
  )

  const readmeContent = content.readme ? (
    <Flex grow>
      <Text
        className="markdown"
        dangerouslySetInnerHTML={{
          __html: clean(marked(content.readme) as string),
        }}
      ></Text>
    </Flex>
  ) : null

  return (
    <>
      <Container onClick={() => setIsOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.meta.iconUrl}
          width={64}
          height={64}
          alt={content.meta.name}
          className="rounded-lg border border-extraLightGrey w-16 h-16"
        />
        <Flex col gap={2}>
          <Text weight="medium">{content.meta.name}</Text>
          <Text variant="caption">{content.meta.description}</Text>
        </Flex>
      </Container>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={content.meta.name}
        description={content.meta.description}
        className="w-screen max-w-[1000px]"
      >
        {content.readme && isMobile ? (
          <Tabs.Root defaultValue="readme">
            <Tabs.List className="flex gap-2 mb-4">
              <Tabs.Trigger
                value="readme"
                className="grow p-2 flex items-center justify-center text-grey data-[state='active']:text-black data-[state='active']:border-black data-[state='active']:border-solid data-[state='active']:border-0 data-[state='active']:!border-b-2"
              >
                About
              </Tabs.Trigger>
              <Tabs.Trigger
                value="install"
                className="grow p-2 flex items-center justify-center text-grey data-[state='active']:text-black data-[state='active']:border-black data-[state='active']:border-solid data-[state='active']:border-0 data-[state='active']:!border-b-2"
              >
                Install
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="readme">{readmeContent}</Tabs.Content>
            <Tabs.Content value="install">{installContent}</Tabs.Content>
          </Tabs.Root>
        ) : content.readme && !isMobile ? (
          <Flex row gap={4} align="start">
            {readmeContent}
            {installContent}
          </Flex>
        ) : (
          installContent
        )}
      </Dialog>
    </>
  )
}

const Container = styled("button", {
  base: "flex gap-4 p-4 rounded-lg border border-extraLightGrey basis-0 grow max-w-[480px] min-w-[320px] cursor-pointer hover:bg-extraLightGrey/25 hover:border-lightGrey border-solid text-left transition-colors",
})
