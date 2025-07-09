import { createClient } from '@sanity/client'

export const sanityTrackClient = createClient({
  projectId: 'your_main_events_project_id', // From main Sanity project
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
})
