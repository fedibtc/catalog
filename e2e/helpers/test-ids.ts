const sanitizeForTestId = (value: string) => {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export const miniAppTestId = (name: string) => {
    return `mini-app-${sanitizeForTestId(name)}`
}

export const miniAppGroupTestId = (groupName: string) => {
    return `catalog-group-${sanitizeForTestId(groupName)}`
}

export const dropdownTestId = (title: string) => {
    return `dropdown-${sanitizeForTestId(title)}`
}

export const filterOptionTestId = (
    kind: "category" | "country" | "region",
    label: string,
) => {
    return `${kind}-option-${sanitizeForTestId(label)}`
}
