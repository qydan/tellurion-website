# tellurionai.com

The Tellurion website, built with React, Tailwind CSS, and Motion. It deploys to
GitHub Pages on pushes to `main`.

## Develop

Use Node.js 20.20.2 or newer in WSL. With `nvm` installed in WSL, run
`nvm use` from this directory. The GitHub Pages build uses Node.js 22.

```bash
npm ci
npm run dev
```

The local Vite server serves the home page, research note, and timeline. Create
a production build with `npm run build`; `npm run preview` serves that build.
The header theme toggle follows the system appearance until a visitor chooses a
theme, then remembers that choice in local storage.

## Layout

```
src/App.jsx             React pages and shared components
src/index.css           Tailwind entry and brand-level styles
index.html              Vite document template and metadata
research/index.html     Research route document metadata
timeline/index.html     Timeline route document metadata
assets/brand/           official logo files and BRAND.md (the rules)
assets/img/              research figure and social sharing image
.github/workflows/       GitHub Pages build and deploy
```

The deployment workflow builds `dist/`, copies the public brand and research
assets plus the custom-domain `CNAME`, and emits a GitHub Pages fallback for
client-side routes.

## Rules

- Brand: navy `#0E1B2C` and brass `#CAA24A` only. Use the files in
  `assets/brand/`; don't redraw the logo.
- Every number on the site must match the
  [results fact sheet](https://github.com/tellurionai/tellurion-referee/blob/main/docs/results_fact_sheet.md).
- Public site: no secrets, no internal plans, no investor or employer details.
