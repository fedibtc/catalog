import { RegionCode, regionCodes, regionsByRegionCode } from "@/app/lib/countries"
import { Button, Text } from "@fedibtc/ui"
import Flex from "../flex"

type FilterRegionOptionsProps = {
  selectedRegionCode: RegionCode | undefined
  onRegionCodeSelectedChange: (regionCode: RegionCode | undefined) => void
}

const FilterRegionOptions = (props: FilterRegionOptionsProps) => {
  const {
    selectedRegionCode,
    onRegionCodeSelectedChange,
  } = props

  const handleRegionCodeClick = (regionCode: RegionCode) => {
    if (regionCode === selectedRegionCode) {
      onRegionCodeSelectedChange(undefined)
    } else {
      onRegionCodeSelectedChange(regionCode)
    }
  }

  const sortedRegionCodes = [...regionCodes].sort((a, b) => {
    // global should be first
    if (a === 'GLOBAL') {
      return -1
    } else if (b === 'GLOBAL') {
      return 1
    }

    return regionsByRegionCode[a].displayName.localeCompare(
      regionsByRegionCode[b].displayName,
    )
  })

  const regionOptions = sortedRegionCodes.map((regionCode) => {
    const isSelected = regionCode === selectedRegionCode
    const regionName = regionsByRegionCode[regionCode].displayName

    return (
      <Button
        key={regionCode}
        variant="outline"
        size="sm"
        className={`${isSelected ? 'bg-gray-500 text-white' : 'bg-gray-100'}`}
        onClick={() => handleRegionCodeClick(regionCode)}
      >
        <Text className="text-nowrap font-bold">
          {regionName}
        </Text>
      </Button>
    )
  })

  return (
    <Flex gap={2} className="overflow-x-scroll overflow-y-visible">
      {regionOptions}
    </Flex>
  )
}

export default FilterRegionOptions
