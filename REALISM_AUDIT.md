# INM Book Studio — Realism Gate

Date: 2026-11-11
Status: **Current published mesh fails visual realism. Do not claim the model has been fixed.**
Live site: https://chouyuanjue.github.io/inm-3d-book/
Project: `E:\INM-3D-Book` (independent from `E:\INM-TeX`)

## What the reference reveals

Actual photographs of thick, sewn hardcovers show that:

1. The exterior *case spine* remains in a compact cradle under the book block. The visible spine does **not** open sideways as a flat board.
2. Folded paper signatures turn around a shared sewn text-block spine. Their layer thickness is visible at head, tail and fore edge, and the silhouette changes continuously with reading position.
3. Fore edges are not perfectly rectangular blocks with drawn stripes; individual signatures have varied, asymmetric curl, leaf separation, and micro-offsets.
4. Boards and textile joints form coherent solid surfaces with realistic overhangs, contact points and shadowing. Their hinge rotation does not imply that the entire text-block back turns rigidly with a board.
5. A 1,248-page A4 sewn book is a heavy object. In a desk pose, geometry, opening angle and contact surface must be reconciled with its 62.4 mm paper-block thickness; an arbitrary two-wing V is inadequate.

Useful real object references:
- https://www.diplomarbeit-druck.de/hardcover/hardcover-premium-plus
- https://www.psychol.cam.ac.uk/file/bookopenjpg
- https://www.schultenprint.nl/site/boek-drukken-bindwijze

## Inspected assets — isolated research, no production replacement

| Candidate | License | Technical appearance | Decision |
|---|---|---|---|
| Innerscene **open-notebook.glb** | CC0 | 4,804 triangles, two very thin page masses, multiple visible decorative stitches, PBR; mostly notebook geometry 298×211×25 mm | Reject for thick sewn hardcover; scaling to 62+ mm would distort topology |
| Grab3D **open-book.glb** | CC0 | 5,376 triangles, cartoon/medieval storybook motifs, ribbon and gold corners, 2 cm thick | Reject: clearly stylized, single baked mesh and not suited to editable INM pages |
| Fabio Santaniello Bruun **irma-book** engine | MIT | Excellent closed-cover wrap, bevel, French groove, procedural cloth and emboss; opening flips the front cover while page block stays in a closed upright profile | Evaluate as potential **closed-book shell only**. Reject for complete open-book simulation |

All three prototypes were run in actual browser WebGL and screenshots inspected; the existing site has NOT been replaced. Prototype and downloaded third-party files live in ignored `asset-research/`.

## Existing model — why it fails

- It uses aggregate left/right signature blocks with a mathematical profile repeated for all signatures, so it reads as two smooth carved wedges.
- Case and book-block geometry do not share the complex sewn back / shoulders / rounded binding profile of a real volume; the exposed gutter still looks like a long, straight rail.
- The paper cut textures are regular, and the sharp fore-edge and interior contact transitions betray a synthetic model.
- The simulated opening and reading pose is determined by interpolated positions rather than a single authored binding rig with collision and measured constraints.
- Studio lighting cannot compensate for missing high-frequency geometry, material scans, and real folds.

## Rebuild architecture — do not patch this mesh again

**Assets first, user interface second.** Build a high-fidelity authored or legitimately sourced **rigged** hardcover object with two cover boards, a continuous case spine, structural cloth joints, sewn text-block spine, front and back endpapers, and individual signature layers.

- Author at least three neutral reference poses (closed, partly open, reading spread), verified in an offline DCC viewport with neutral clay materials **before** any cover textures or page text.
- Model text-block and paper-stack deformations using signature-level skinned meshes or blend shapes. Do not draw hundreds of lines across a flat face and call it a book.
- Assign material-correct UVs and physically based textures derived from real cloth/paper samples (normal, roughness, base color), with restrained studio lights and contact ambient occlusion.
- Adapt three source dimensions: trim width/height, paper caliper, and leaf count. At every pose maintain overhang, board alignment, consistent signature thickness and no intersection.
- Integrate INM's existing PDF as dynamically assigned surface textures ONLY AFTER the model passes neutral geometry QA.
- Keep the live site and original INM source unchanged until the replacement passes comparable real-photograph views.

## Acceptance gates

**G1: Geometry.** Match a real thick sewn hardcover in front, top, head/tail, spine side, and underside views. No floating case, detached boards, central rod or mirrored wedge.
**G2: Motion.** Examine closed → 30° → 90° → reading spread, at p1, p624 and p1248, plus one sheet mid-turn. No stretching, collision, spine opening, or sheet separation artifacts.
**G3: Appearance.** Compare scene-framed renders beside real photographs under equivalent viewing angles. Page folds, material response and shadows must be visually coherent at full screen and macro crop.
**G4: Browser.** Run automatic Playwright desktop/mobile tests for correct PDF page surfaces and interactions, then test GPU performance. The final site must not be visually worse than the reference asset.
**G5: Delivery.** Only then replace existing public GitHub Pages version; report limitations accurately.

This audit intentionally rejects the three downloaded candidates; it does not assert that any is a photoreal replacement.
