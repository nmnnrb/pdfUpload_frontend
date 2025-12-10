## File UI

Next.js + Tailwind UI for the backend file service (upload/list/download/delete PDFs).

### Run
- `npm install`
- `npm run dev` (defaults to http://localhost:3000)

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
