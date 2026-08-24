# jchattock.com

Personal portfolio at [jchattock.com](https://jchattock.com). React SPA with English/Chinese content and a Supabase-backed admin dashboard for editing projects, the About section, the CV, and the favicon.

## Usage

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # production build to dist/
npm run lint
```

## Architecture

| Piece | Description |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/ui |
| Backend | Supabase (schema `portfolio` on the shared London project), storage bucket `project-files` |
| Hosting | Netlify, deploys from `main`; SPA fallback via `public/_redirects` |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Portfolio (hero, about, projects, contact) |
| `/auth` | Admin sign-in |
| `/admin` | Admin dashboard (requires the `admin` role in `user_roles`) |
| `/html-viewer` | Renders uploaded HTML reports in a sandboxed iframe |

## Content model

| Table | Purpose |
|-------|---------|
| `projects` | Project cards: bilingual title/intro, image URL, link buttons, display order |
| `about_content` | Rows `about`, `experience`, `education` with bilingual JSON content |
| `user_roles` | Grants admin access |

Files (project images, report/HTML uploads, CV plus preview, favicon) live in the `project-files` storage bucket. Visitors only read; all writes happen through `/admin`.

## File structure

```text
src/
├── components/        # Page sections
│   ├── admin/         # Dashboard tabs: projects, about, CV, favicon
│   └── ui/            # shadcn/ui primitives
├── contexts/          # Language, auth/admin, projects
├── hooks/             # useCv (lazy CV fetch), toast
├── integrations/      # Supabase client and generated types
├── lib/               # aboutContent fetch helpers
├── pages/             # Index, Auth, Admin, HTMLViewer (lazy routes)
└── utils/             # Storage uploads, PDF-to-image CV preview, favicon
```
