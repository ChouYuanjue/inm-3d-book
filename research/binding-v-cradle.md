# INM — supported opening of a thick sewn hardcover

Research and implementation notes. The public website intentionally contains only controls.

## Source evidence

- Canadian Conservation Institute, [Display Methods for Books](https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/canadian-conservation-institute-notes/display-methods-books.html): use a V-shaped support rather than forcing bindings flat.
- Warburg Institute, [Using Book Supports](https://warburg.libguides.com/handling-guidelines/using-book-supports): maximum safe opening is structure-dependent; around 120 degrees is a reference for many historic books, not a limit for all modern bindings.
- Canadian Conservation Institute, [Salzinnes Antiphonal binding restoration](https://www.canada.ca/en/conservation-institute/services/videos/salzinnes-treatment-binding.html): physical support geometry varies dramatically from the first to last page in heavy volumes.
- AIC Book and Paper Group, [The Movement of the Book Spine](https://cool.culturalheritage.org/coolaic/sg/bpg/annual/v06/bp06-01.html): sewn textblocks throw up on opening; deformation depends on paper drape, thickness and gutter margin.
- University of Colorado Boulder Libraries, [Mending Book Spines](https://scap.omeka.net/exhibits/show/preservation-week/mending-book-spines---a-preser): hollow-back textblock flex is distinct from the spine covering.
- Shannon Zachary, [The Peculiar Impossibility of the Square-Back, Stiff-Spine Case Binding](https://deepblue.lib.umich.edu/bitstream/handle/2027.42/198888/Zachary%20SM.6%20essay%203_22_2021_A.pdf?isAllowed=y&sequence=1): a thicker Smyth-sewn textblock forms a stronger rising arch under the reading gutter, separate from the counter-curving case hollow.

## Implementation

One 1,248-page volume contains 624 leaves in 39 independent 16-leaf sewn gatherings.

- The open book defaults to 120 degrees in a supported V; the boards do not open flat. Their tilts change asymmetrically with first/middle/last reading position. The illustrative slider permits 90 to 145 degrees.
- Separate backing curves: the sewn textblock rises into a concave (as seen from the open side) arch when opened, while the exterior case follows a lower U-shaped hollow; real space remains between them.
- Each gathering has its own hinge axis on a page-position-dependent arc. Nonzero thickness is preserved at the sewing folds.
- A blended cubic-quadratic page shoulder replaces a singular square-root bend. The top page has a finite, smooth tangent at the fold instead of a sharp triangular corner.
- A concealed 8%-14% physical gutter near the fold is reserved for page curvature. The page texture reuses its inner 8.5% unprinted PDF margin in that zone; no straight guide stripes are drawn. The zoomable PDF reader retains every source pixel.
- Turning pages bend laterally and curl while moving between their actual source and destination folded surfaces.
- PDF texture resolution is independent from the full-resolution reading inspector.

## Reproduction and QA

Run npm test then npm run build in the isolated E:\INM-3D-Book project. Tests cover signature count, finite fold thickness, open V angles, two distinct spine arcs, rounded shoulder, first/middle/last pages, and changing book thickness. Browser QA covers desktop/mobile, 95/120/140-degree angles, page turns in both directions, 2,000 simulated pages and the complete PDF inspector.

This is a procedural geometrical approximation, not a measured scan of any manufactured 62.4-mm-bound book. Mechanical tolerances and safe opening angles depend on the actual signature sewing, paper grain, glue, casing and supports. No generative image model is used. The E:\INM-TeX source remains untouched.
