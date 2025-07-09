import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@sanity/client'
import formidable from 'formidable'
import fs from 'fs'

// Disable default body parsing so formidable can handle it
export const config = {
  api: { bodyParser: false },
}

// Setup Sanity client
const client = createClient({
  projectId: '5lltl9z6', // your Sanity project ID
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN, // from .env.local
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = formidable({ keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err

      // Get the file (PDF) from the form
      const file = Array.isArray(files.abstractFile)
        ? files.abstractFile[0]
        : files.abstractFile

      if (!file || !file.filepath) {
        throw new Error('No file uploaded.')
      }

      // Upload the file to Sanity
      const fileStream = fs.createReadStream(file.filepath)
      const asset = await client.assets.upload('file', fileStream, {
        filename: file.originalFilename || 'abstract.pdf',
      })

      // Convert all field values from array to plain string
      const normalizedFields: Record<string, string> = {}
      Object.entries(fields).forEach(([key, value]) => {
        normalizedFields[key] = Array.isArray(value) ? value[0] : (value as string)
      })

      // Build the document for Sanity
      const doc = {
        _type: 'abstractSubmission',
        ...normalizedFields,
        abstractFile: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      }

      // Create the document in Sanity
      const submission = await client.create(doc)

      res.status(200).json({ success: true, submission })
    } catch (error: any) {
      console.error('Sanity submission error:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  })
}
