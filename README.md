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

The preloaded cover artwork is an original Canvas 2D reconstruction of the user's ivory-and-blue hardcover reference. It is neither a generative image output nor an AMS publication.

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
npm run build
```

The Vite static build is copied to `docs/`, with GitHub Pages configured for `main:/docs`. On machines where normal Git pushes fail, the standalone `scripts/publish.py` uses the GitHub Git Data API through the local authenticated `gh` CLI, reusing previously uploaded PDF blobs.

## Physical assumptions

The book-block thickness is `ceil(pages/2) × paper caliper` approximately; the visual model estimates cover board and overhang independently. Its default caliper is 0.10 mm, resulting in a 62.4 mm book block for 1,248 printed pages. Exact manufacturing requirements depend on actual stock, grain, swell, imposition, and binding. The simulation is a visual proof, not a printer-supplied cover template.

The binding model uses two independently hinged boards, cloth joints, curved signature blocks, a head/tail cross-section with drawn paper layers and a hollow-back spine that hangs below the open gutter. It models a heavy case-bound volume in a shallow V, rather than pretending that a 1,248-page sewn hardcover is a rigid pair of flat plates. It is an approximate visual reconstruction; the shape of a manufactured spine depends on the specific sewing, rounding, backing and casing process. To keep rendering smooth, only the active PDF pages and animated turning leaf use separate geometries and textures; other signatures are aggregated into shaped page-block meshes.
