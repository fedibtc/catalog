import { FediInternalV2 } from "../types/fedimint"

/**
 * Check if `window` has `fediInternal` with version >= 2
 */
export function hasFediInternalV2(
    win: Window,
): win is Window & { fediInternal: FediInternalV2 } {
    return Boolean(win.fediInternal && win.fediInternal.version >= 2)
}
