# Portfolio creative district

The architectural factories in `models/` and Three.js runtime in `vendor/` are copied from `game_dual-realm/city-editor` (2026-10-23). The source game city and editor are not modified. Preserve the Three.js MIT license in `vendor/LICENSE-three.txt`.

`scene.js` authors a separate compact neighborhood, including background residences, streets, trees and eight project landmarks. React owns the labels, project cards, accessible index and layout switcher in `app/CityShowcase.tsx`. Both use `app/data/projects.ts`; new entries receive another plot automatically. Known project IDs choose distinctive source models; unknown IDs receive a category-based model. Messages are restricted to the matching iframe/parent and same origin.

The city layout also has a district selector: `works` shows existing landmarks and `expansion` shows a reserved lot with one physical “擴建中…” sign. The scene switches visibility of its landmark/construction groups, clears the selection and disables project picking on the reserved lot. Switching districts reuses the same renderer and architectural instances. The initial message carries the selected district so a selection made during loading is preserved. This selector is independent of the five homepage layouts.
