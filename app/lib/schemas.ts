import { z } from "zod"
import { countryCodes } from "./countries"
import { categoryCodes } from "./categories"

export const groupSchema = z.object({
  title: z.string(),
  order: z.number(),
})

export type ModGroup = z.infer<typeof groupSchema>

export const modSchema = z.object({
  name: z.string(),
  id: z.string(),
  url: z.string(),
  iconUrl: z.string(),
  description: z.string(),
  categoryCode: z.enum(categoryCodes),
  supportedCountryCodes: z.array(z.enum(countryCodes)).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
})

export type Mod = z.infer<typeof modSchema>
