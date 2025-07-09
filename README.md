Here’s a clean and simple `README.md` for your abstract submission system built with **Next.js** and **Sanity**, listing all setup, changes, and custom files added:

---

### 📄 `README.md`

```markdown
# 📝 Abstract Submission Platform

This is a full-stack abstract submission platform built with:

- **Frontend:** Next.js + Tailwind CSS
- **Backend CMS:** Sanity.io (2 linked projects – one for event data, another for form submissions)
- **Features:** Multi-step form, PDF upload, Sanity integration

---

## 📁 Project Structure

```

abstrct-submission/
├── form-frontend/        # Frontend built with Next.js
│   ├── pages/
│   │   ├── index.tsx                 # Home or landing (optional)
│   │   └── submit-abstract.tsx      # Main form page
│   ├── lib/
│   │   ├── sanityClient.ts          # Connects to event Sanity project
│   │   └── sanityTrackClient.ts     # Connects to abstract submission project
│   ├── public/
│   ├── styles/
│   ├── .env.local                   # Contains SANITY\_WRITE\_TOKEN (not committed)
│   └── ...
│
├── sanity-formdata/      # Sanity Studio for abstract submissions
│   ├── schemas/
│   │   └── abstractSubmission.ts    # Schema for abstract form data
│   └── sanity.config.ts             # Main Sanity config
│
└── README.md             # This file

````

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/gulamqadir0410/abstrct-submission.git
cd abstrct-submission
````

---

### 2. Install Dependencies

#### For Frontend:

```bash
cd form-frontend
npm install
```

#### For Sanity Backend:

```bash
cd sanity-formdata
npm install
```

---

### 3. Configure Environment

In `form-frontend/.env.local`, add:

```env
NEXT_PUBLIC_SANITY_WRITE_TOKEN=your_sanity_write_token
```

---

## 🧾 Custom Files Created

### 🔹 `form-frontend/lib/sanityClient.ts`

For reading data from your **event** Sanity project.

### 🔹 `form-frontend/lib/sanityTrackClient.ts`

For submitting abstracts to **abstract-data** project.

---

### 🔹 `form-frontend/pages/api/submit-abstract.ts`

Handles:

* File upload with **formidable**
* Uploading PDFs to Sanity
* Creating a submission document

---

### 🔹 `form-frontend/pages/submit-abstract.tsx`

* Two-step form
* Shows loader & success messages
* Clears form on submission
* Uploads `.pdf` file with user inputs

---

### 🔹 `sanity-formdata/schemas/abstractSubmission.ts`

Defines form fields in Sanity:

```ts
{
  _type: 'abstractSubmission',
  fields: ['firstName', 'lastName', ..., 'abstractFile']
}
```

Register it in:

```ts
// sanity.config.ts
import { abstractSubmission } from './schemas/abstractSubmission'
export const schemaTypes = [abstractSubmission]
```

---

## 🚀 Running Locally

### Frontend:

```bash
cd form-frontend
npm run dev
```

### Sanity Studio:

```bash
cd sanity-formdata
npm run dev
```

---

## 📎 Notes

* The file upload uses `formidable` and streams the file to Sanity.
* Only PDFs are allowed in the form.
* Form handles multi-step navigation, loading, and reset on success.

---

## 📤 Deployment Tips

You can host:

* **Frontend** on **Vercel** or **Netlify**
* **Sanity Studio** on **Sanity.io (Managed Studio)** or **self-hosted**

---

## ✅ To-Do (Optional)

* Add authentication for editors
* Connect frontend event dropdown to event Sanity project
* Add better UI/UX for status feedback

---

Made with ❤️ using Next.js & Sanity


