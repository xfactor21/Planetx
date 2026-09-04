# planet.X site update — bdXm deck/media integration

## Changed
- Added a new web-native `BDXMPresentation` component for `/beta`.
- Converted `Power_Play_Redefined.pptx` into a site-ready media package:
  - original PPTX download
  - PDF fallback/viewer file
  - 13 rendered slide images for source-deck review
- Added an interactive deck mode with custom animated visuals for the bdXm story beats instead of relying only on the static PowerPoint.
- Added a compact tabbed layout: Interactive deck / Original slides / Media vault.
- Added a dedicated media vault section so deck, screenshots, and future video placement do not crowd the beta app cards.
- Added large source-slide lightbox viewing.
- Updated beta app screenshot previews to enlarge on hover and open into a much larger full-screen lightbox on click.
- Fixed the xFactor info-section typo: “planet-X Development and xFactor building…” → “planet-X Development and xFactor are building…”.

## Validation notes
- The PowerPoint was successfully rendered to PDF and slide images with LibreOffice/PDF tools.
- A full Next build could not be completed inside this container because dependency installation timed out and `next` was not available in `node_modules/.bin`.
- Source changes were kept limited to React/Tailwind components, public media assets, and a text typo fix.
