declare global {
  interface Window {
    fediInternal?:
      | {
          version: 0
        }
      | {
          version: 1
        }
      | {
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
  }
}

export {}
