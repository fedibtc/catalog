"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CategoryCode } from "../lib/categories"
import { CountryCode, RegionCode } from "../lib/countries"

const SEARCH_DEBOUNCE_MS = 500

export type MiniAppsFilterState = {
    search: string
    region: RegionCode | undefined
    countries: Array<CountryCode>
    categories: Array<CategoryCode>
}

export function useMiniAppsFilterURLState() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const urlState: MiniAppsFilterState = useMemo(() => {
        const search = searchParams.get("search") ?? ""
        const region = (searchParams.get("region") as RegionCode) || undefined
        const countriesParam = searchParams.get("countries")
        const categoriesParam = searchParams.get("categories")

        const countries: Array<CountryCode> = countriesParam
            ? (countriesParam.split(",").filter(Boolean) as Array<CountryCode>)
            : []

        const categories: Array<CategoryCode> = categoriesParam
            ? (categoriesParam
                  .split(",")
                  .filter(Boolean) as Array<CategoryCode>)
            : []

        return {
            search,
            region,
            countries,
            categories,
        }
    }, [searchParams])

    // Local state for search input
    const [searchInput, setSearchInput] = useState(urlState.search)
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const setSearch = useCallback(
        (value: string) => {
            setSearchInput(value)

            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }

            debounceTimeoutRef.current = setTimeout(() => {
                const url = new URL(window.location.href)
                if (value.length > 0) {
                    url.searchParams.set("search", value)
                } else {
                    url.searchParams.delete("search")
                }
                router.replace(url.pathname + url.search, { scroll: false })
            }, SEARCH_DEBOUNCE_MS)
        },
        [router],
    )

    const setRegion = useCallback(
        (region: RegionCode | undefined) => {
            const url = new URL(window.location.href)
            if (region) {
                url.searchParams.set("region", region)
            } else {
                url.searchParams.delete("region")
            }
            router.replace(url.pathname + url.search, { scroll: false })
        },
        [router],
    )

    const toggleCountry = useCallback(
        (countryCode: CountryCode, enabled: boolean) => {
            const newCountries = enabled
                ? Array.from(new Set([...urlState.countries, countryCode]))
                : urlState.countries.filter((c) => c !== countryCode)

            const url = new URL(window.location.href)
            if (newCountries.length > 0) {
                url.searchParams.set("countries", newCountries.join(","))
            } else {
                url.searchParams.delete("countries")
            }
            router.replace(url.pathname + url.search, { scroll: false })
        },
        [urlState.countries, router],
    )

    const toggleCategory = useCallback(
        (categoryCode: CategoryCode, enabled: boolean) => {
            const newCategories = enabled
                ? Array.from(new Set([...urlState.categories, categoryCode]))
                : urlState.categories.filter((c) => c !== categoryCode)

            const url = new URL(window.location.href)
            if (newCategories.length > 0) {
                url.searchParams.set("categories", newCategories.join(","))
            } else {
                url.searchParams.delete("categories")
            }
            router.replace(url.pathname + url.search, { scroll: false })
        },
        [urlState.categories, router],
    )

    const resetFilters = useCallback(() => {
        const url = new URL(window.location.href)
        url.searchParams.delete("region")
        url.searchParams.delete("countries")
        url.searchParams.delete("categories")
        // Keep search when resetting filters
        router.replace(url.pathname + url.search, { scroll: false })
    }, [router])

    const resetAll = useCallback(() => {
        setSearchInput("")
        const url = new URL(window.location.href)
        url.searchParams.delete("search")
        url.searchParams.delete("region")
        url.searchParams.delete("countries")
        url.searchParams.delete("categories")
        router.replace(url.pathname + url.search, { scroll: false })
    }, [router])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [])

    const hasActiveFilters =
        urlState.region !== undefined ||
        urlState.countries.length > 0 ||
        urlState.categories.length > 0

    const hasActiveSearch = urlState.search.length > 0

    return {
        // State - use local searchInput for immediate UI updates
        search: searchInput,
        region: urlState.region,
        countries: urlState.countries,
        categories: urlState.categories,
        // Actions
        setSearch,
        setRegion,
        toggleCountry,
        toggleCategory,
        resetFilters,
        resetAll,
        // Computed
        hasActiveFilters,
        hasActiveSearch,
    }
}
