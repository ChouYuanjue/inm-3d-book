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

- The open book defaults to 120 degrees in a supported V. Crucially the **opening is distributed by current page position**, not split evenly across both covers: near page 1 only the front board and thin turned leaves lift, while the other ~624-sheet stack stays nearly closed and flat; near the end this is mirrored; at the middle the opening is shared approximately equally. The illustrated slider ranges from 90 to 145 degrees.
- Separate backing curves: the sewn textblock may throw up into a raised arch when opened near the middle, while the exterior hollow case remains lower. **The throw-up is multiplied by a page-position-dependent engagement factor** approaching zero at the very beginning/end, since turning a few leaves does not force an entire heavy textblock into a symmetric arch.
- Each gathering has its own hinge axis on a page-position-dependent arc. Nonzero thickness is preserved at the sewing folds.
- The top folio has an **inward curl localized around its sewing fold**, governed by a finite-slope exponential shoulder that relaxes onto the underlying pile. Curl amplitude responds to how many sheets are supported under the visible page and its distance from the current split. A heavy stack remains block-like, while only a thin set of loose turned leaves curls strongly. Avoid a universal U-shaped trough.
- A concealed 8%-14% physical gutter near the fold is reserved for sewing curvature. The texture remaps the inner 8.5% of each original PDF margin there, without visible guide stripes, while the zoomable PDF reader retains every source pixel. The 3D page uses a neutral sRGB **unlit print material**, preventing tone-mapping and studio lights from washing out black text.
- Turning pages bend laterally and curl while moving between their actual source and destination folded surfaces. **Page x-projection and z-support are calculated from the corresponding rotated cover board**, preventing pages from penetrating the board near the beginning/end.
- A near-closed thick block uses a softly laminated, slightly mottled paper-cut surface to cover repetitive, artificial looking signature arcs on the exposed head/tail edges. Internally the independent gathering meshes remain present; at middle spreads, visible individual signature layers are retained.
- Camera framing adapts to the raised front/back cover near book ends, preventing cropping. PDF texture resolution is independent from the full-resolution reading inspector.

## Reproduction and QA

Run npm test then npm run build in the isolated E:\INM-3D-Book project. Tests cover signature count, nonzero folds, V angles, dynamic backing, curled shoulders, nearly undisturbed early/late stacks, projected geometry following the raised boards, and support clearance. Browser QA waits for actual PDF textures, then inspects page 1, page 11, page 625 and page 1,248 on desktop/mobile, bidirectional page turns and the full-resolution PDF inspector.

This is a procedural geometrical approximation, not a measured scan of any manufactured 62.4-mm-bound book. Mechanical tolerances and safe opening angles depend on the actual signature sewing, paper grain, glue, casing and supports. No generative image model is used. The E:\INM-TeX source remains untouched.
