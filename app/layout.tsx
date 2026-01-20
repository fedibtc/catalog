import { FediInjectionProvider, ToastProvider } from "@fedibtc/ui"
import "@fedibtc/ui/dist/index.css"
import type { Metadata } from "next"
import { Albert_Sans } from "next/font/google"
import { ViewportProvider } from "./components/viewport-provider"
import "./globals.css"
import { fediModName } from "./lib/constants"

const albertSans = Albert_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: fediModName,
    description: "Find and install your favorite Fedi Mods",
    icons: ["logo.png"],
}

const env = process.env.NEXT_PUBLIC_ENV

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={albertSans.className}>
                <ToastProvider>
                    <FediInjectionProvider
                        fediModName={fediModName}
                        minSupportedAPIVersion={2}
                        supportedBitcoinNetworks={{
                            signet: env !== "production",
                            bitcoin: env !== "preview",
                        }}
                    >
                        <ViewportProvider>{children}</ViewportProvider>
                    </FediInjectionProvider>
                </ToastProvider>
            </body>
        </html>
    )
}
