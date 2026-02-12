import { Button, Dialog, Icon, Input, Text } from "@fedibtc/ui"
import { useCallback, useEffect, useState } from "react"
import { categoriesByCode, CategoryCode } from "../../lib/categories"
import {
    countriesByCountryCode,
    CountryCode,
    isCountryInRegion,
    RegionCode,
    regionsByRegionCode,
} from "../../lib/countries"
import { Mod } from "../../lib/schemas"
import Dropdown from "../dropdown"
import Flex from "../flex"
import { useViewport } from "../viewport-provider"
import FilterCategoryOptions from "./FilterCategoryOptions"
import FilterCountryOptions from "./FilterCountryOptions"
import FilterRegionOptions from "./FilterRegionOptions"

type MiniAppsFilterProps = {
    allMiniApps: Mod[]
    onFilteredListChange: (filteredMiniApps: Mod[] | null) => void
    onFilterSearchChange: (search: string) => void
}

const MiniAppsFilter = (props: MiniAppsFilterProps) => {
    const { allMiniApps, onFilteredListChange, onFilterSearchChange } = props

    const { isMobile } = useViewport()

    const [miniAppSearch, setMiniAppSearch] = useState<string>("")
    const [isModalOpen, setModalOpen] = useState<boolean>(false)
    const [selectedRegionCode, setSelectedRegionCode] = useState<
        RegionCode | undefined
    >(undefined)
    const [selectedCountryCodes, setSelectedCountryCodes] = useState<
        Partial<Record<CountryCode, boolean>>
    >({})
    const [selectedCategoryCodes, setSelectedCategoryCodes] = useState<
        Partial<Record<CategoryCode, boolean>>
    >({})

    const [countrySearch, setCountrySearch] = useState<string>("")

    const hasRegionFilter = selectedRegionCode !== undefined
    const hasCountryFilter = Object.values(selectedCountryCodes).some(
        (isEnabled) => isEnabled,
    )
    const hasCategoryFilter = Object.values(selectedCategoryCodes).some(
        (isEnabled) => isEnabled,
    )

    const matchesSelectedRegion = useCallback(
        (miniApp: Mod) => {
            const matchesGlobal =
                selectedRegionCode === "GLOBAL" &&
                miniApp.supportedCountryCodes.length === 0

            const isInRegion =
                selectedRegionCode !== undefined &&
                miniApp.supportedCountryCodes.some((countryCode) => {
                    isCountryInRegion(countryCode, selectedRegionCode)
                })

            return !hasRegionFilter || matchesGlobal || isInRegion
        },
        [hasRegionFilter, selectedRegionCode],
    )

    const matchesSelectedCountries = useCallback(
        (miniApp: Mod) => {
            const matchesCountry = miniApp.supportedCountryCodes.some(
                (countryCode) => {
                    return selectedCountryCodes[countryCode] === true
                },
            )

            return !hasCountryFilter || matchesCountry
        },
        [hasCountryFilter, selectedCountryCodes],
    )

    const matchesSelectedCategories = useCallback(
        (miniApp: Mod) => {
            const matchesCategory =
                selectedCategoryCodes[miniApp.categoryCode] === true

            return !hasCategoryFilter || matchesCategory
        },
        [hasCategoryFilter, selectedCategoryCodes],
    )

    const matchesSearch = useCallback(
        (miniApp: Mod) => {
            const matchesName = new RegExp(miniAppSearch, "gi").test(
                miniApp.name,
            )
            const matchesDescription = new RegExp(miniAppSearch, "gi").test(
                miniApp.description,
            )
            const matchesKeyword = miniApp.keywords.some((keyword) =>
                new RegExp(miniAppSearch, "gi").test(keyword),
            )

            return (
                miniAppSearch.length === 0 ||
                matchesName ||
                matchesDescription ||
                matchesKeyword
            )
        },
        [miniAppSearch],
    )

    const hasModalFiltersApplied =
        hasRegionFilter || hasCountryFilter || hasCategoryFilter

    const filterDescriptions = []
    if (hasRegionFilter) {
        filterDescriptions.push(
            `Region: ${regionsByRegionCode[selectedRegionCode].displayName}`,
        )
    }

    if (hasCountryFilter) {
        const countries = []

        for (const entry of Object.entries(selectedCountryCodes)) {
            const [countryCode, isEnabled] = entry as [CountryCode, boolean]
            if (isEnabled) {
                countries.push(countriesByCountryCode[countryCode].displayName)
            }
        }

        filterDescriptions.push(`Country: ${countries.join(", ")}`)
    }

    if (hasCategoryFilter) {
        const categories = []

        for (const entry of Object.entries(selectedCategoryCodes)) {
            const [categoryCode, isEnabled] = entry as [CategoryCode, boolean]
            if (isEnabled) {
                categories.push(categoriesByCode[categoryCode].displayName)
            }
        }

        filterDescriptions.push(`Category: ${categories.join(", ")}`)
    }

    const filterDescriptionText = filterDescriptions.join("; ")

    const resetModalFilters = () => {
        setCountrySearch("")
        setSelectedRegionCode(undefined)
        setSelectedCountryCodes({})
        setSelectedCategoryCodes({})
    }

    const setCountryCodeSelected = (
        countryCode: CountryCode,
        isSelected: boolean,
    ) => {
        setSelectedCountryCodes((prev) => {
            return {
                ...prev,
                [countryCode]: isSelected,
            }
        })
    }

    const setCategoryCodeSelected = (
        categoryCode: CategoryCode,
        isSelected: boolean,
    ) => {
        setSelectedCategoryCodes((prev) => {
            return {
                ...prev,
                [categoryCode]: isSelected,
            }
        })
    }

    useEffect(() => {
        const hasFiltersApplied =
            hasModalFiltersApplied || miniAppSearch.length > 0

        if (hasFiltersApplied) {
            const filteredMiniApps: Mod[] = Object.values(allMiniApps).filter(
                (miniApp) => {
                    return (
                        matchesSelectedRegion(miniApp) &&
                        matchesSelectedCountries(miniApp) &&
                        matchesSelectedCategories(miniApp) &&
                        matchesSearch(miniApp)
                    )
                },
            )

            onFilteredListChange(filteredMiniApps)
        } else {
            onFilteredListChange(null)
        }
        // Do NOT add `onFilterSearchChange` or `allMiniApps` as dependencies
        // or you will get an infinite useEffect loop
        // eslint-disable-next-line
    }, [
        hasModalFiltersApplied,
        miniAppSearch,
        matchesSelectedRegion,
        matchesSelectedCountries,
        matchesSelectedCategories,
        matchesSearch,
    ])

    useEffect(() => {
        onFilterSearchChange(miniAppSearch)
        // Do NOT add `onFilterSearchChange` as dependency
        // eslint-disable-next-line
    }, [miniAppSearch])

    return (
        <Flex col width="full">
            <Flex align="center" width="full" gap={2}>
                <Input
                    width="full"
                    value={miniAppSearch}
                    onChange={(e) => setMiniAppSearch(e.currentTarget.value)}
                    placeholder="Search Mini Apps or keywords"
                />

                <div className="relative" onClick={() => setModalOpen(true)}>
                    <Icon icon="IconFilter" size="sm" />

                    {hasModalFiltersApplied && (
                        <Icon
                            icon="IconCircleFilled"
                            size="xxs"
                            className="text-red absolute top-[-2px] right-[-4px]"
                        />
                    )}
                </div>
            </Flex>

            {filterDescriptionText.length > 0 && (
                <Flex p={1}>
                    <Text className="italic">{filterDescriptionText}</Text>
                </Flex>
            )}

            <Dialog
                open={isModalOpen}
                onOpenChange={setModalOpen}
                disableClose
                className="p-0"
            >
                <div
                    className={`${isMobile ? "h-full" : "h-[500px]"} overflow-scroll`}
                >
                    <Flex col className="h-full w-full" justify="between">
                        <Flex col gap={2} grow className="overflow-scroll p-4">
                            <Flex align="center" justify="between">
                                <Text variant="h2" className="font-bold">
                                    Filter
                                </Text>

                                {hasModalFiltersApplied && (
                                    <Text
                                        className="text-blue"
                                        onClick={resetModalFilters}
                                    >
                                        Reset
                                    </Text>
                                )}
                            </Flex>

                            <Dropdown title="Region & Country">
                                <Flex col gap={4}>
                                    <Input
                                        value={countrySearch}
                                        onChange={(e) =>
                                            setCountrySearch(e.target.value)
                                        }
                                        placeholder="Search countries"
                                    />

                                    <FilterRegionOptions
                                        selectedRegionCode={selectedRegionCode}
                                        onRegionCodeSelectedChange={
                                            setSelectedRegionCode
                                        }
                                    />

                                    <FilterCountryOptions
                                        searchQuery={countrySearch}
                                        selectedCountryCodes={
                                            selectedCountryCodes
                                        }
                                        selectedRegionCode={selectedRegionCode}
                                        onCountryCodeSelectedChange={
                                            setCountryCodeSelected
                                        }
                                    />
                                </Flex>
                            </Dropdown>

                            <hr />

                            <Dropdown title="Category">
                                <FilterCategoryOptions
                                    selectedCategoryCodes={
                                        selectedCategoryCodes
                                    }
                                    onCategoryCodeSelectedChange={
                                        setCategoryCodeSelected
                                    }
                                />
                            </Dropdown>
                        </Flex>

                        <Flex
                            align="center"
                            shrink
                            justify="center"
                            className="p-4"
                        >
                            <Button
                                variant="outline"
                                width="full"
                                onClick={() => setModalOpen(false)}
                                className="bg-black text-white"
                            >
                                Apply
                            </Button>
                        </Flex>
                    </Flex>
                </div>
            </Dialog>
        </Flex>
    )
}

export default MiniAppsFilter
