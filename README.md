# INM — Physical Book Studio

An independent, interactive 3D edition of **Informal Notes on Mathematics** by Runnel Zhang.

- One complete book, defaulting to the **1,248-page** current `inm.pdf`.
- Physically parameterized pages, paper caliper, hardcover/paperback and trim size.
- Original clothbound ivory/blue cover artwork generated in Canvas 2D from the supplied visual reference; no generative image model involved.
- Free orbit, zoom, front/spine/page preset viewpoints.
- Hinged cover and animated paper bending during page turns.
- Real PDF pages rendered lazily with PDF.js, navigation, local PDF replacement.
- Local image/PDF cover upload and client-side image export.

## Setup

```bash
npm install
npm run dev
npm run build
```

The source PDF is **copied** into `public/inm.pdf` and does not modify the original INM-TeX project. The dedicated GitHub repository hosts the static `docs/` build.

Paper thickness is a user-configurable caliper; nominal paper weight in gsm alone does not establish thickness. The default hardcover model estimates block thickness as `pages/2 * caliper` and includes approximate cover board dimensions. A printer's spine allowance may differ due to binding method and stock.

The artwork is INM-specific and does not claim any association with the American Mathematical Society.
