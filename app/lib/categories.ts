export const categoryCodes = [
    "ai",
    "cash-in-cash-out",
    "communications",
    "misc",
    "productivities",
    "spend-earn-bitcoin",
] as const

export type CategoryCode = (typeof categoryCodes)[number]

type CategoryInfo = {
    displayName: string
}

export const categoriesByCode: Record<CategoryCode, CategoryInfo> = {
    ai: {
        displayName: "AI & Chatbots",
    },
    "cash-in-cash-out": {
        displayName: "Cash in and cash out",
    },
    communications: {
        displayName: "Communication",
    },
    misc: {
        displayName: "Misc",
    },
    productivities: {
        displayName: "Productivity",
    },
    "spend-earn-bitcoin": {
        displayName: "Spend and Earn Bitcoin",
    },
}
