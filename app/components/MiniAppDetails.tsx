import { Button, Icon, Text, useToast } from "@fedibtc/ui"
import Flex from "./flex"
import { categoriesByCode } from "../lib/categories"
import { Mod } from "../lib/schemas"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { useViewport } from "./viewport-provider"

type MiniAppDetails = {
  isInstalled: boolean
  miniApp: Mod
  targetActionType: "copy" | "install"
  onCopy: () => Promise<void>
  onInstall: () => Promise<void>
}

const MiniAppDetails = (props: MiniAppDetails) => {
  const { isInstalled, miniApp, targetActionType, onCopy, onInstall } = props

  const { isMobile } = useViewport()
  const [viewMoreDescription, setViewMoreDescription] = useState<boolean>(false)
  const [showingQrCode, setShowingQrCode] = useState<boolean>(false)
  const [isInstalling, setIsInstalling] = useState<boolean>(false)

  useEffect(() => {
    setViewMoreDescription(false)
    setShowingQrCode(false)
    setIsInstalling(false)
  }, [miniApp])

  const handleInstallClick = async () => {
    setIsInstalling(true)

    try {
      await onInstall()
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <div className="h-full w-full">
      {showingQrCode ? (
        <Flex
          align="center"
          justify="center"
          height="full"
          width="full"
          className={`${isMobile ? "bg-black" : ""}`}
        >
          <Icon
            onClick={() => setShowingQrCode(false)}
            icon="IconX"
            width={32}
            height={32}
            className={`${isMobile ? "bg-black text-white" : "bg-white text-black"} absolute top-4 right-4 cursor-pointer`}
          />

          <Flex className="bg-white" p={2} justify="center" align="center">
            <QRCode value={miniApp.url} size={256} />
          </Flex>
        </Flex>
      ) : (
        <Flex col gap={2} height="full" width="full" p={8}>
          <Flex col gap={2} className="my-2">
            <Flex justify="center">
              <img
                src={miniApp.iconUrl}
                width={96}
                height={96}
                alt={miniApp.name}
                className="rounded-lg border border-extraLightGrey"
              />
            </Flex>

            <Flex justify="center">
              <Text weight="bold">{miniApp.name}</Text>
            </Flex>

            <Text variant="small">{miniApp.description}</Text>

            <Flex gap={2} justify="center" align="center">
              {targetActionType === "install" && (
                <Button
                  className="bg-black text-white h-8 p-4"
                  disabled={isInstalled}
                  loading={isInstalling}
                  variant="secondary"
                  onClick={handleInstallClick}
                >
                  {isInstalled ? "Added" : "Add"}
                </Button>
              )}

              <Flex
                onClick={() => setShowingQrCode(true)}
                align="center"
                justify="center"
                className="p-2 rounded-full cursor-pointer border border-extraLightGrey border-solid"
              >
                <Icon icon="IconQrcode" width={24} height={24} />
              </Flex>
            </Flex>

            <Flex
              align="center"
              justify="between"
              className="py-1 px-4 rounded-xl border border-extraLightGrey cursor-pointer border-solid"
            >
              <Text variant="caption" className="text-gray-600">
                {miniApp.url}
              </Text>

              <Flex gap={2} align="center" p={2} onClick={onCopy}>
                <Icon icon="IconCopy" />
                <Text weight="medium" variant="caption">
                  Copy
                </Text>
              </Flex>
            </Flex>

            {miniApp.extendedDescription !== undefined && (
              <Flex col gap={2}>
                <Text
                  className={`${viewMoreDescription ? "" : "line-clamp-3"}`}
                >
                  {miniApp.extendedDescription}
                </Text>

                <div
                  onClick={() => setViewMoreDescription(prev => !prev)}
                  className="cursor-pointer"
                >
                  <Text>View {viewMoreDescription ? "less" : "more"}</Text>
                </div>
              </Flex>
            )}
          </Flex>

          <hr />

          <Flex col gap={2} className="my-2">
            <Text weight="medium" className="text-gray-600">
              Category
            </Text>

            <Badge text={categoriesByCode[miniApp.categoryCode].displayName} />
          </Flex>

          <hr />

          <Flex col gap={2} className="my-2">
            <Text weight="medium" className="text-gray-600">
              Keywords
            </Text>

            <Flex gap={2} wrap>
              {miniApp.keywords.map((keyword, index) => (
                <Badge key={`${keyword}_${index}`} text={keyword} />
              ))}
            </Flex>
          </Flex>
        </Flex>
      )}
    </div>
  )
}

type BadgeProps = {
  text: string
}

const Badge = (props: BadgeProps) => {
  const { text } = props

  return (
    <div className="rounded-full py-1 px-2 bg-gray-200 w-fit">
      <Text weight="medium">{text}</Text>
    </div>
  )
}

export default MiniAppDetails
