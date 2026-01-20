import { categoriesByCode, CategoryCode } from "@/app/lib/categories"
import { Checkbox, Text } from "@fedibtc/ui"
import Flex from "../flex"

const SORTED_CATEGORY_CODES: CategoryCode[] = [
    "spend-earn-bitcoin",
    "cash-in-cash-out",
    "productivities",
    "communications",
    "ai",
    "misc",
]

type FilterCategoryOptionsProps = {
    selectedCategoryCodes: Partial<Record<CategoryCode, boolean>>
    onCategoryCodeSelectedChange: (
        categoryCode: CategoryCode,
        isSelected: boolean,
    ) => void
}

const FilterCategoryOptions = (props: FilterCategoryOptionsProps) => {
    const { selectedCategoryCodes, onCategoryCodeSelectedChange } = props

    const categoryOptions = SORTED_CATEGORY_CODES.map((categoryCode) => {
        const isSelected = selectedCategoryCodes[categoryCode] === true
        const categoryName = categoriesByCode[categoryCode].displayName

        return (
            <Flex
                key={categoryCode}
                className="gap-4 cursor-pointer"
                onClick={() =>
                    onCategoryCodeSelectedChange(categoryCode, !isSelected)
                }
            >
                <Checkbox checked={isSelected} />

                <Text className="text-lg">{categoryName}</Text>
            </Flex>
        )
    })

    return (
        <Flex col gap={4}>
            {categoryOptions}
        </Flex>
    )
}

export default FilterCategoryOptions
