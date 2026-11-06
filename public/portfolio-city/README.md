# Portfolio creative district

The architectural factories in `models/` and Three.js runtime in `vendor/` are copied from `game_dual-realm/city-editor` (2026-10-23). The source game city and editor are not modified. Preserve the Three.js MIT license in `vendor/LICENSE-three.txt`.

`scene.js` authors a separate compact neighborhood, including background residences, streets, trees and per-district project landmarks (currently eight in district 01 and one in district 02). React owns the labels, project cards, accessible index and layout switcher in `app/CityShowcase.tsx`. Both use `app/data/projects.ts`; new entries receive another plot automatically. Known project IDs choose distinctive source models; unknown IDs receive a category-based model. Messages are restricted to the matching iframe/parent and same origin.

The district selector uses `works` for district 01 and `expansion` for district 02. A project defaults to district 01; set `cityDistrict: 'expansion'` in `app/data/projects.ts` for district 02. Optional `citySlot` preserves a zero-based parcel (four parcels per row); explicit parcels are reserved before automatic allocation.

Fruit Slot occupies parcel 3 in district 01, replacing Water Sort. Water Sort keeps the same architectural model and parcel 3 in district 02. Each street retains the complete roads, trees and background neighborhood; empty project parcels show ordinary non-interactive houses. A completely empty district still displays the original physical construction notice.

Switching streets reuses one renderer, shows only that street's models, clears the old selection, and sends only the active district's anchors. React filters labels, cards and the accessible index from the same project metadata. Both selection and anchor messages include the district to prevent stale messages from restoring another street's card. The initial message carries the selected district so a switch made during loading is preserved.

Buildings, labels and index buttons only preview on desktop and mobile widths; the card's “查看作品” link opens the project. Other homepage layouts continue to use the complete nine-project list, and the works-first carousel keeps Water Sort last.

Idle previews advance every five seconds using a district-scoped shuffle bag. Every project appears once per automatic tour; the next tour cannot start with the preceding tour's last project when there are at least two projects. Manual previews do not consume the automatic tour. Pauses preserve the remaining order. Switching districts creates a new tour; the second district's single project stays on that project.

Hovering a landmark, label, card or index pauses the timer, as does keyboard focus or an open layout menu. Leaving resumes with a fresh five-second delay. Touch/click interaction resets that delay. Hidden browser tabs do not advance or catch up on return. Automatic previews only select the card and highlight the building: they never scroll, move keyboard focus or open a page. The scene sends `portfolio-city:hover` on entering/leaving a landmark, including when leaving the canvas; parent messages remain source/origin/district checked.

Run the shuffle acceptance checks with `node --test tests/projectShuffle.test.mjs`.
