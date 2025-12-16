import {
  countriesByCountryCode,
  CountryCode,
  countryCodes,
  RegionCode,
} from "@/app/lib/countries"
import Flex from "../flex"
import { useState } from "react"
import { Checkbox, Text } from "@fedibtc/ui"

const REDUCED_COUNTRY_LIST_LENGTH = 6

type FilterCountryOptionsProps = {
  searchQuery: string
  selectedCountryCodes: Partial<Record<CountryCode, boolean>>
  selectedRegionCode: RegionCode | undefined
  onCountryCodeSelectedChange: (
    countryCode: CountryCode,
    isSelected: boolean,
  ) => void
}

const FilterCountryOptions = (props: FilterCountryOptionsProps) => {
  const {
    searchQuery,
    selectedCountryCodes,
    selectedRegionCode,
    onCountryCodeSelectedChange,
  } = props

  const searchTerm = searchQuery.toLowerCase()
  const [showingAllCountries, setShowingAllCountries] = useState<boolean>()

  const sortedCountryCodes = [...countryCodes].sort((a, b) => {
    return countriesByCountryCode[a].displayName.localeCompare(
      countriesByCountryCode[b].displayName,
    )
  })

  const filteredCountryCodes = sortedCountryCodes.filter(countryCode => {
    const countryInfo = countriesByCountryCode[countryCode]

    const matchesSelectedRegion =
      selectedRegionCode === undefined ||
      selectedRegionCode === "GLOBAL" || // shows all countries
      countryInfo.regionCode === selectedRegionCode

    const matchesSearch =
      searchTerm.length === 0 ||
      countryCode.toLowerCase().includes(searchTerm) ||
      countryInfo.displayName.toLowerCase().includes(searchTerm)

    return matchesSelectedRegion && matchesSearch
  })

  const visibleCountryCodes = showingAllCountries
    ? [...filteredCountryCodes]
    : filteredCountryCodes.slice(0, REDUCED_COUNTRY_LIST_LENGTH)

  const countryOptions = visibleCountryCodes.map(countryCode => {
    const isSelected = selectedCountryCodes[countryCode] === true
    const countryName = countriesByCountryCode[countryCode].displayName

    return (
      <Flex
        key={countryCode}
        className="gap-4 cursor-pointer"
        onClick={() => onCountryCodeSelectedChange(countryCode, !isSelected)}
      >
        <Checkbox checked={isSelected} />

        <Text className="text-lg">{countryName}</Text>
      </Flex>
    )
  })

  const canViewMoreCountries =
    !showingAllCountries &&
    visibleCountryCodes.length < filteredCountryCodes.length

  if (countryOptions.length === 0) {
    return (
      <Text className="italic text-center p-2">
        No countries found. Try changing your search or selected region.
      </Text>
    )
  } else {
    return (
      <Flex col gap={4}>
        {countryOptions}

        {canViewMoreCountries && (
          <Text
            className="font-bold"
            onClick={() => setShowingAllCountries(true)}
          >
            View more
          </Text>
        )}
      </Flex>
    )
  }
}

export default FilterCountryOptions
