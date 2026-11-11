# INM — independent material and binding research

Status: **EXPERIMENTAL / NOT READY TO REPLACE MAIN VIEWER**.

Website: `/inm-3d-book/lab.html`, separate from the main interactive PDF-based book viewer.

## Scope

This branch of research explores a real-geometry, authorable hardcover as an alternative to the failed procedural two-block viewer:

- One book, 1,248 A4 printed pages, 624 sheets at nominal 0.10 mm caliper.
- A middle reading spread represented by 312 individual curved double-sided leaves per half.
- Continuous case spine, French groove, headband stitches, front/back boards, pastedowns and linen reinforcement.
- True scanned materials: **Poly Haven Book Pattern**, CC0, and **ambientCG Paper001**, CC0.
- Actual INM PDF page 624 / 625 applied to the topmost curved leaves.
- Physically based Blender Cycles renders for visual review.
- An orbitable 24-MB glTF preview in the browser. **The glTF is a single static spread and cannot yet flip pages.**

## Assets and licenses

Public CC0 PBR inputs:
- [Poly Haven Book Pattern](https://polyhaven.com/a/book_pattern): downloaded `book_pattern_col1_2k.jpg`, `book_pattern_nor_gl_2k.jpg`, `book_pattern_rough_2k.jpg`.
- [ambientCG Paper001](https://ambientcg.com/view?id=Paper001): `Paper001_1K-JPG` maps.
- Cover artwork is reconstructed in the existing main viewer from the user-provided ivory/blue reference. This research uses these Canvas-generated PNGs, not an external publisher logo file.

The `reference_v2.py` and `export_glb.py` scripts are authored for this project under Apache-2.0. They expect assets at the relative paths defined in their headers and require Blender 4.5+.

## Fidelity status

**Rejected as a photoreal final model.** Offline side-by-side comparison with a physical sewn hardcover showed:
- Pages still fan too regularly around the central gathering, even though individual leaves now exist.
- The cover and pastedown geometry is not calibrated against actual scans of a physical 1,248-page sewn A4 volume.
- The model is not skinned or rigged, so cannot realistically simulate opening / closing or paper turning.
- Materials are physically based, but the rendered micro-contact behavior and paper translucency still need calibration.

Do not replace the main website model until independent geometry, page-turning, material, and smartphone performance gates pass.

## Production safety

This study does **not** mutate `E:\INM-TeX` and does not replace the original main site's interactive book mesh.
The independent lab page is intentionally labeled as research. No image-generation model was invoked.
