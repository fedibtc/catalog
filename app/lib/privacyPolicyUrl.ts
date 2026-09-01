import { Mod } from "./schemas"

const privacyPolicyUrl = (mod: Mod): string => {
    if (mod.privacyPolicyUrl !== undefined) {
        return mod.privacyPolicyUrl
    }

    return `${new URL(mod.url).origin}/privacy-policy`
}

export default privacyPolicyUrl
