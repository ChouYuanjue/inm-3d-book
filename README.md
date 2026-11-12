# INM — The Physical Book

An independent, browser-based, print-aware 3D rendering of a **single complete copy** of *Informal Notes on Mathematics*, by Runnel Zhang.

**Live site:** https://chouyuanjue.github.io/inm-3d-book/

The studio uses the current compiled **1,248-page PDF**, rather than splitting the document into separately bound volumes.

## What you can do

- Rotate, orbit and zoom the 3D book with mouse or touch.
- Open and close the ivory clothbound cover; turn pages with arrow controls, keyboard, or tapping the corresponding side of the book. Opening changes the model from an upright display to an open volume resting on a table.
- Browse all **1,645 PDF outline entries** and jump to any bookmark in this one continuous book.
- Jump directly to a specific printed page or scrub through the manuscript.
- Open the high-resolution reading inspector for mathematical notation; enlarge, navigate, and close without leaving the simulation.
- Share a specific location using a deep link, such as `#p=947`.
- Change simulated page count, trim size, paper caliper, binding and the **opening angle (105°–174°)**; the 3D book block, visible left/right signature stacks and spine curvature update accordingly.
- Customize the cover title, author, and blue ink; upload a replacement front-cover image or PDF.
- Import a different reading-copy PDF locally, or download a PNG render of the physical book.

The default front cover and spine use perspective-corrected artwork extracted directly from the supplied ivory-and-blue book photograph, preserving its lettering, emblem and cloth texture. The case spine has an exterior print surface, an unprinted inner lining and sealed rims. Its paper block follows the rounded back and matching hollow fore-edge. Spine artwork is laid out at equal physical pixel density to preserve lettering proportions as page count changes; all case faces share the same ivory cloth base. The back has a coordinated blue-and-black introduction.

## Development

The entire app lives in **E:\\INM-3D-Book**. The original `E:\\INM-TeX` remains untouched.

```powershell
npm install
npm run dev
npm run build
```

To refresh the copied source PDF and the bookmark index:

```powershell
Copy-Item E:\\INM-TeX\\inm.pdf public\\inm.pdf
& E:\\anaconda3\\python.exe scripts\\extract_outline.py
& E:\\anaconda3\\python.exe scripts\\build_page_previews.py
npm run build
```

The default 3D view loads 1100-pixel WebP pages through coalesced byte-range requests and prefetches adjacent leaves. Its index is bundled with the app, avoiding a cold index request. Page turns start immediately with cached or neutral paper textures and update as images arrive; image loading never pauses the 3D renderer. The original PDF loads on demand for the full-resolution reader. Uploaded PDFs retain local PDF rendering. Regenerate the preview packs whenever the source PDF changes.

The Vite static build is copied to `docs/`, with GitHub Pages configured for `main:/docs`. On machines where normal Git pushes fail, the standalone `scripts/publish.py` uses the GitHub Git Data API through the local authenticated `gh` CLI, reusing previously uploaded PDF blobs.

## Physical assumptions

Resting sheets and turning sheets share an arc-length cross-section. The resting solver derives projected span from paper length and the local support curve; a turning sheet interpolates tangent angles and integrates segment lengths. The stationary stacks transition between their two curved poses during the turn, including their head/tail cuts and hollow fore-edge. Sampled lift-off and landing shapes match their corresponding resting surfaces, and forward/backward turns use the same reversible path.

The book-block thickness is `ceil(pages/2) × paper caliper` approximately; the visual model estimates cover board and overhang independently. Its default caliper is 0.10 mm, resulting in a 62.4 mm book block for 1,248 printed pages. Exact manufacturing requirements depend on actual stock, grain, swell, imposition, and binding. The simulation is a visual proof, not a printer-supplied cover template.

The binding model has **one continuous, compact case spine** that does not unfold with the leaves. Two independent cover-board hinges move the covers, while the text-block leaves fan out into a rounded gutter. Paper edges have dynamically shaped, finely layered surfaces at the head, tail and fore edge, and the cloth has a small deterministic woven bump texture. Opening the book changes both geometry and the whole book's viewing orientation; page count controls the actual visual left/right stack balance. This is an illustrative mechanical mockup, not a validated bindery model or a photorealistic scan. Actual bending depends on paper grain, signature sewing, rounding/backing, adhesive and casing. To keep rendering responsive, only active PDF pages and the turning leaf use page textures; the rest of the book is represented by aggregated signature masses and fine laminated cut surfaces.

