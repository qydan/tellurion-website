# tellurionai.com

The Tellurion website. Plain HTML and CSS: no build step, no framework.

## Layout

```
index.html            home
research/index.html   research note 01: Tellurion Referee
404.html              not-found page
assets/site.css       all styles (colour and type tokens at the top)
assets/img/           figures and the social sharing image (og.png)
assets/brand/         official logo files and BRAND.md (the rules)
favicon.*, icon-512.png, apple-touch-icon.png
CNAME                 custom domain for GitHub Pages
```

## Edit and preview

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Change a page, open a pull request, and the site redeploys when it merges to `main`
(`.github/workflows/pages.yml`).

## Rules

- Brand: navy `#0E1B2C` and brass `#CAA24A` only. Use the files in `assets/brand/`; don't redraw the logo.
- Every number on the site must match the
  [results fact sheet](https://github.com/tellurionai/tellurion-referee/blob/main/docs/results_fact_sheet.md).
- Public site: no secrets, no internal plans, no investor or employer details.
