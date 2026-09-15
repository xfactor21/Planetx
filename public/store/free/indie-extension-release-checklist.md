# Indie Extension Release Checklist

A practical pre-release checklist from planet.X for Manifest V3 Chrome extensions.

## 1. Package the release, not the project folder
- [ ] `manifest_version` is `3`.
- [ ] The extension version has been incremented.
- [ ] `manifest.json` sits at the root of the ZIP.
- [ ] The ZIP does not contain credentials, private notes, test exports, source maps you do not intend to ship, or unrelated build artifacts.
- [ ] The exact packaged build installs in a clean Chrome profile.

## 2. Review permissions like a reviewer will
- [ ] Every permission is required by a feature that actually ships.
- [ ] Old experimental permissions are removed.
- [ ] Host permissions are as narrow as the product allows.
- [ ] You can explain each sensitive permission in one sentence.
- [ ] Listing copy and privacy disclosures describe the same access as the manifest.

## 3. Make privacy claims match the product
- [ ] The public privacy-policy URL loads without authentication.
- [ ] The policy says what is stored locally.
- [ ] The policy says what leaves the device and why.
- [ ] Licensing, analytics, sync, and third-party API calls are disclosed accurately where present.
- [ ] You do not claim “nothing leaves the device” if activation or another service transmits data.

## 4. Prepare Chrome Web Store media
- [ ] 128×128 extension icon is clear at small size.
- [ ] Screenshots use 1280×800 or 640×400 dimensions.
- [ ] Screenshots show real interface states.
- [ ] Each screenshot communicates one feature or outcome.
- [ ] Feature callouts remain readable at store-card scale.
- [ ] No fake ratings, reviews, user counts, browser UI, or unsupported features appear in the media.

### Simple 1280×800 screenshot planning frame
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <rect width="1280" height="800" fill="#07070b"/>
  <rect x="64" y="64" width="1152" height="672" rx="28" fill="#11131b" stroke="#2b2f3d"/>
  <rect x="96" y="96" width="720" height="608" rx="18" fill="#090b11"/>
  <text x="864" y="180" fill="#ffffff" font-size="38" font-family="Arial, sans-serif">One clear feature</text>
  <text x="864" y="230" fill="#9ca3af" font-size="22" font-family="Arial, sans-serif">Short outcome-led callout</text>
</svg>
```
Use this only as a planning frame. Replace the large left panel with a real screenshot from the extension.

## 5. Run clean-profile QA
- [ ] First install works with no prior extension storage.
- [ ] Primary workflow works from first run to completion.
- [ ] Settings and error states are tested.
- [ ] Upgrade from the current published version is tested where possible.
- [ ] Permanent Free behavior matches the approved entitlement matrix.
- [ ] Trial behavior matches the approved entitlement matrix.
- [ ] Pro/license-gated behavior matches the approved entitlement matrix.
- [ ] Uninstall/reinstall expectations are understood.
- [ ] Backup/export/restore flows are tested where promised.

## 6. Prepare reviewer notes
- [ ] Non-obvious setup steps are explained.
- [ ] Sensitive permissions have a short, factual explanation.
- [ ] Reviewer steps reach the core functionality quickly.
- [ ] Paid features can be evaluated without exposing owner credentials or secrets.

## 7. Capture release evidence
- [ ] Final version number recorded.
- [ ] Source commit recorded.
- [ ] Source ZIP stored separately from the publish-ready ZIP.
- [ ] Listing copy captured.
- [ ] Submitted screenshots captured.
- [ ] Privacy-policy URL recorded.
- [ ] Licensing provider/product reference recorded without secrets.
- [ ] Free / Trial / Pro rules recorded.
- [ ] Existing-user migration behavior recorded.
- [ ] Published Chrome Web Store page checked after approval.

---
planet.X — https://www.planet-x.co
