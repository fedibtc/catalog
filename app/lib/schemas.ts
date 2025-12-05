import { z } from "zod"
import { countryCodes } from "./countries"

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
  supportedCountryCodes: z.array(z.enum(countryCodes)).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
})

export type Mod = z.infer<typeof modSchema>
