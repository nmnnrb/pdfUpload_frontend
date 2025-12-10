## File UI

Next.js + Tailwind UI for the backend file service (upload/list/download/delete PDFs).

### Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/nmnnrb/pdfUpload_frontend.git
   cd pdfUpload_frontend/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Opens on http://localhost:3000 by default.

### Backend API base
- Defaults to `http://localhost:3000`.
- Override with `NEXT_PUBLIC_API_BASE`, e.g. `NEXT_PUBLIC_API_BASE=http://localhost:4000 npm run dev`.

### Page
- `app/page.tsx` is a client component with:
	- Upload form (`POST /files` with `file` field, PDF-only)
	- List of files (`GET /files`)
	- Download links (`GET /files/:id/download`)
	- Delete buttons (`DELETE /files/:id`)

### Styling
- Tailwind CSS (v4) with dark slate theme and Geist font.
