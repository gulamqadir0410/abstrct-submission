import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'abstractSubmission',
  title: 'Abstract Submission',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'track', title: 'Track Name', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({
      name: 'abstractFile',
      title: 'Abstract File (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
  ],
  preview: {
    select: { title: 'firstName', subtitle: 'email' },
  },
})
