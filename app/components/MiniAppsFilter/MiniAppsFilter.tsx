import { Button, Dialog, Icon, Input, Text } from "@fedibtc/ui"
import { useCallback, useEffect, useState } from "react"
import { useMiniAppsFilterURLState } from "../../hooks/useMiniAppsFilterURLState"
import { categoriesByCode, CategoryCode } from "../../lib/categories"
import {
    countriesByCountryCode,
    CountryCode,
    isCountryInRegion,
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
}

const MiniAppsFilter = (props: MiniAppsFilterProps) => {
    const { allMiniApps, onFilteredListChange } = props
    const { isMobile } = useViewport()

    const {
        search: miniAppSearch,
        setSearch: setMiniAppSearch,
        region: selectedRegionCode,
        setRegion: setSelectedRegionCode,
        countries: selectedCountryCodes,
        toggleCountry: toggleCountryCode,
        categories: selectedCategoryCodes,
        toggleCategory: toggleCategoryCode,
        resetFilters,
        hasActiveFilters,
    } = useMiniAppsFilterURLState()

    const [isModalOpen, setModalOpen] = useState<boolean>(false)
    const [countrySearch, setCountrySearch] = useState<string>("")

    const hasCountryFilter = selectedCountryCodes.length > 0
    const hasCategoryFilter = selectedCategoryCodes.length > 0

    const matchesSelectedRegion = useCallback(
        (miniApp: Mod) => {
            const hasRegionFilter = selectedRegionCode !== undefined
            const matchesGlobal =
                selectedRegionCode === "GLOBAL" &&
                miniApp.supportedCountryCodes.length === 0

            const isInRegion =
                selectedRegionCode !== undefined &&
                miniApp.supportedCountryCodes.some((countryCode) => {
                    return isCountryInRegion(countryCode, selectedRegionCode)
                })

            return !hasRegionFilter || matchesGlobal || isInRegion
        },
        [selectedRegionCode],
    )

    const matchesSelectedCountries = useCallback(
        (miniApp: Mod) => {
            const matchesCountry = miniApp.supportedCountryCodes.some(
                (countryCode) => {
                    return selectedCountryCodes.includes(countryCode)
                },
            )

            return !hasCountryFilter || matchesCountry
        },
        [hasCountryFilter, selectedCountryCodes],
    )

    const matchesSelectedCategories = useCallback(
        (miniApp: Mod) => {
            const matchesCategory = selectedCategoryCodes.includes(
                miniApp.categoryCode,
            )

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

    const filterDescriptions = []
    if (selectedRegionCode) {
        filterDescriptions.push(
            `Region: ${regionsByRegionCode[selectedRegionCode].displayName}`,
        )
    }

    if (hasCountryFilter) {
        const countries = selectedCountryCodes.map(
            (countryCode) => countriesByCountryCode[countryCode].displayName,
        )
        filterDescriptions.push(`Country: ${countries.join(", ")}`)
    }

    if (hasCategoryFilter) {
        const categories = selectedCategoryCodes.map(
            (categoryCode) => categoriesByCode[categoryCode].displayName,
        )
        filterDescriptions.push(`Category: ${categories.join(", ")}`)
    }

    const filterDescriptionText = filterDescriptions.join("; ")

    const setCountryCodeSelected = (
        countryCode: CountryCode,
        isSelected: boolean,
    ) => {
        toggleCountryCode(countryCode, isSelected)
    }

    const setCategoryCodeSelected = (
        categoryCode: CategoryCode,
        isSelected: boolean,
    ) => {
        toggleCategoryCode(categoryCode, isSelected)
    }

    useEffect(() => {
        const hasFiltersApplied = hasActiveFilters || miniAppSearch.length > 0

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
        // Do NOT add `allMiniApps` as dependency
        // or you will get an infinite useEffect loop
        // eslint-disable-next-line
    }, [
        hasActiveFilters,
        miniAppSearch,
        matchesSelectedRegion,
        matchesSelectedCountries,
        matchesSelectedCategories,
        matchesSearch,
    ])

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

                    {hasActiveFilters && (
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

                                {hasActiveFilters && (
                                    <Text
                                        className="text-blue"
                                        onClick={resetFilters}
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
