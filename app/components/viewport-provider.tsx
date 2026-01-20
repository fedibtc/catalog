"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface ViewportContextType {
    width: number
    isMobile: boolean
}

const ViewportContext = createContext<ViewportContextType | null>(null)

export function ViewportProvider({ children }: { children: React.ReactNode }) {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <ViewportContext.Provider value={{ width, isMobile: width < 768 }}>
            {children}
        </ViewportContext.Provider>
    )
}

export function useViewport() {
    const context = useContext(ViewportContext)

    if (!context) {
        throw new Error("useViewport must be used within a ViewportProvider")
    }

    return context
}
