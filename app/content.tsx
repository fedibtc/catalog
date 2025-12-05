"use client"

import {
  Text,
  Input,
  Checkbox,
  Button,
  Dialog,
  useToast,
} from "@fedibtc/ui"
import Flex from "./components/flex"
import CatalogItem from "./components/item"
import { GroupContent } from "./page"
import { useCallback, useEffect, useState } from "react"
import { Mod } from "./lib/schemas"
import { useSearchParams } from "next/navigation"
import {
  countriesByCountryCode,
  CountryCode,
  countryCodes,
} from "./lib/countries"
import { useViewport } from "./components/viewport-provider"

function CountryFilter({
  selectedCountryCodes,
  onCountrySelectedChange,
  onClose,
}: {
  selectedCountryCodes: CountryCode[]
  onCountrySelectedChange: (
    countryCode: CountryCode,
    isChecked: boolean,
  ) => void
  onClose: () => void
}) {
  const [countrySearch, setCountrySearch] = useState<string>("")

  const sortedCountryCodes = [...countryCodes].sort((a, b) => {
    return countriesByCountryCode[a].name.localeCompare(
      countriesByCountryCode[b].name,
    )
  })

  const searchTerm = countrySearch.toLowerCase()
  const countryOptions = sortedCountryCodes
    .filter(countryCode => {
      return (
        countrySearch.length === 0 ||
        countryCode.toLowerCase().includes(searchTerm) ||
        countriesByCountryCode[countryCode].name
          .toLowerCase()
          .includes(searchTerm)
      )
    })
    .map(countryCode => {
      const isSelected = selectedCountryCodes.includes(countryCode)

      return (
        <Flex
          key={countryCode}
          className="p-4 gap-2 cursor-pointer"
          onClick={() => onCountrySelectedChange(countryCode, !isSelected)}
        >
          <Checkbox
            checked={isSelected}
            onChange={isChecked =>
              onCountrySelectedChange(countryCode, isChecked)
            }
          />

          <Text className="text-lg">
            {countriesByCountryCode[countryCode].name}
          </Text>
        </Flex>
      )
    })

  return (
    <Flex col className="h-full w-full gap-2">
      <Flex align="center">
        <Input
          value={countrySearch}
          onChange={e => setCountrySearch(e.target.value)}
          placeholder="Search countries..."
        />
      </Flex>

      <Flex col className="h-full w-full gap-2 overflow-scroll">
        {countryOptions}
      </Flex>

      <Flex width="full">
        <Button variant="outline" width="full" onClick={onClose}>
          Done
        </Button>
      </Flex>
    </Flex>
  )
}

export default function PageContent({
  groups,
}: {
  groups: Array<GroupContent>
}) {
  const searchParams = useSearchParams()
  const action = searchParams.get("action") || "install"
  const [fediApiAvailable, setFediApiAvailable] = useState<boolean>(false)
  const toast = useToast()
  const { isMobile } = useViewport()

  const [search, setSearch] = useState("")
  const [filteredGroups, setFilteredGroups] = useState(groups)

  const [installedMiniApps, setInstalledMiniApps] = useState<{ url: string }[]>(
    [],
  )

  useEffect(() => {
    if (window.fediInternal?.version === 2) {
      setFediApiAvailable(true)
    }
  }, [])

  const updateInstalledMiniapps = useCallback(async () => {
    if (window.fediInternal?.version === 2) {
      const installedMiniapps = await window.fediInternal.getInstalledMiniApps()
      setInstalledMiniApps(installedMiniapps)
    }
  }, [])

  useEffect(() => {
    if (fediApiAvailable) {
      updateInstalledMiniapps()
    }
  }, [fediApiAvailable, updateInstalledMiniapps])

  const [isCountryFilterOpen, setCountryFilterOpen] = useState<boolean>(false)
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<
    Set<CountryCode>
  >(new Set())

  useEffect(() => {
    if (isCountryFilterOpen) {
      setSearch("")
    }
  }, [isCountryFilterOpen])

  useEffect(() => {
    const matchesSelectedCountries = (mod: Mod) => {
      return (
        selectedCountryCodes.size === 0 ||
        mod.supportedCountryCodes.some(supportedCountryCode => {
          return selectedCountryCodes.has(supportedCountryCode)
        })
      )
    }

    const matchesSearch = (mod: Mod) =>
      new RegExp(search, "gi").test(mod.name) ||
      new RegExp(search, "gi").test(mod.description) ||
      mod.keywords.some(keyword => new RegExp(search, "gi").test(keyword))

    const matchesConditions = (mod: Mod) => {
      return matchesSelectedCountries(mod) && matchesSearch(mod)
    }

    setFilteredGroups(
      groups
        .filter(group => group.mods.some(matchesConditions))
        .map(group => ({
          ...group,
          mods: group.mods.filter(matchesConditions),
        })),
    )
  }, [search, groups, selectedCountryCodes])

  const handleCountrySelectedChange = (
    countryCode: CountryCode,
    isSelected: boolean,
  ) => {
    setSelectedCountryCodes(prev => {
      if (isSelected) {
        return new Set([...prev, countryCode])
      } else {
        const updatedSet = new Set([...prev])
        updatedSet.delete(countryCode)

        return updatedSet
      }
    })
  }

  const toggleCountryFilter = () => {
    setCountryFilterOpen(prev => {
      return !prev
    })
  }

  const handleCopyUrl = async (miniApp: Mod) => {
    return navigator.clipboard.writeText(miniApp.url).then(() => {
      toast.show("Copied to clipboard")
    })
  }

  const canInstall = fediApiAvailable

  const miniAppGroupElements = filteredGroups.map((group, groupIndex) => {
    const miniAppItemElements = group.mods.map((miniApp, index) => {
      const isInstalled = installedMiniApps.some(installedMiniApp => {
        return installedMiniApp.url === miniApp.url
      })

      const handleAction = async () => {
        if (
          canInstall &&
          action === "install" &&
          window.fediInternal?.version === 2
        ) {
          await window.fediInternal.installMiniApp({
            id: miniApp.id,
            title: miniApp.name,
            url: miniApp.url,
            imageUrl: miniApp.iconUrl,
            description: miniApp.description,
          })

          await updateInstalledMiniapps()
        } else {
          await handleCopyUrl(miniApp)
        }
      }

      return (
        <CatalogItem
          key={index}
          content={miniApp}
          query={search}
          onAction={handleAction}
          isInstalled={isInstalled}
          targetActionType={
            canInstall && action === "install" ? "install" : "copy"
          }
        />
      )
    })

    return (
      <Flex
        key={groupIndex}
        col
        gap={4}
        p={4}
        width="full"
        className="max-w-[1200px]"
      >
        <Flex align="center" gap={2}>
          {group.meta.title === "New" && (
            <div className="rounded-full p-1.5 bg-red-500" />
          )}
          <Text variant="h2" weight="medium">
            {group.meta.title}
          </Text>
        </Flex>
        <Flex row gap={2} wrap key={groupIndex}>
          {miniAppItemElements}
        </Flex>
      </Flex>
    )
  })

  return (
    <Flex col className="w-full items-center" gap={8}>
      <Flex col gap={4} center p={4} width="full" className="max-w-[480px]">
        <Text variant="h1" weight="medium">
          Fedi Mini Apps Catalog
        </Text>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
        />

        <Flex gap={2}>
          <Button
            variant={selectedCountryCodes.size === 0 ? "outline" : "secondary"}
            className={`${
              selectedCountryCodes.size === 0 ? "" : "bg-black text-white"
            }`}
            onClick={toggleCountryFilter}
          >
            <Text>
              {selectedCountryCodes.size === 0
                ? "Filter by country..."
                : `${selectedCountryCodes.size} ${
                    selectedCountryCodes.size === 1 ? "country" : "countries"
                  } selected`}
            </Text>
          </Button>

          {selectedCountryCodes.size > 0 && (
            <Button
              variant="outline"
              className="max-w-0"
              onClick={() => setSelectedCountryCodes(new Set())}
            >
              Clear
            </Button>
          )}
        </Flex>
      </Flex>

      {miniAppGroupElements}

      <Dialog open={isCountryFilterOpen} onOpenChange={setCountryFilterOpen}>
        <div className={`${isMobile ? "" : "h-[500px]"} overflow-scroll mt-6`}>
          <CountryFilter
            selectedCountryCodes={[...selectedCountryCodes]}
            onCountrySelectedChange={handleCountrySelectedChange}
            onClose={() => setCountryFilterOpen(false)}
          />
        </div>
      </Dialog>
    </Flex>
  )
}
