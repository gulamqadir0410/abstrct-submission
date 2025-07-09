import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: '5lltl9z6',  // From sanity.config.ts
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
})