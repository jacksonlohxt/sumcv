# SumCV

SumCV is Pang Le Xin's portfolio MVP: a responsive, resume-backed presentation of UI/UX, immersive-media, 3D and marketing work.

## Included

- Home, work index, deep-linkable case studies, about and contact views
- Resume-backed projects, experience, education, skills, metrics and contact details
- Filterable work grid, compact grid toggle and accessible case-study tabs
- Image-slot placeholders for future project media instead of invented work imagery
- Responsive navigation with skip link, keyboard focus states, semantic landmarks and reduced-motion support

## Local development

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The development server runs on the Vite default port, `http://localhost:5173`.

## Checks

```bash
npm run lint
npm test
npm run build
```

## Deployment

The project is a Vite SPA and includes `vercel.json` rewrites so direct links such as `/work/zookeepers` resolve correctly on Vercel. Connect the repository to Vercel, select the `main` production branch, and use the default Vite build settings (`npm run build`, output `dist`). Feature branches can be preview deployments before the production branch is selected.

The supplied resume is available as `public/Pang-Le-Xin-Resume.pdf` and is linked from the navigation.

## Contact form behavior

The contact form is intentionally honest about its MVP state. It validates the fields locally and displays an informational status, but it does not send or store data because no backend is configured. Visitors can use the direct email link instead.

## Known placeholders

Project, hero and portrait media are labeled image slots awaiting real screenshots, renders or photography. No stock imagery or unsupported portfolio claims are used.
