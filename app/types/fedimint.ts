interface FediInternalV0 {
    version: 0
}

export interface FediInternalV1 extends Omit<FediInternalV0, "version"> {
    version: 1
}

export interface FediInternalV2 extends Omit<FediInternalV1, "version"> {
    version: 2
    getInstalledMiniApps(): Promise<Array<{ url: string }>>
    installMiniApp(miniApp: {
        id: string
        title: string
        url: string
        imageUrl?: string | null
        description?: string
    }): Promise<void>
}

export type AnyFediInternal = FediInternalV2 | FediInternalV1 | FediInternalV0

declare global {
    interface Window {
        fediInternal?: AnyFediInternal
    }
}
