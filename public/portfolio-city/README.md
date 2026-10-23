# Portfolio creative district

The architectural factories in `models/` and Three.js runtime in `vendor/` are copied from `game_dual-realm/city-editor` (2026-10-23). The source game city and editor are not modified. Preserve the Three.js MIT license in `vendor/LICENSE-three.txt`.

`scene.js` authors a separate compact neighborhood, including background residences, streets, trees and eight project landmarks. React owns the labels, project cards, accessible index and layout switcher in `app/CityShowcase.tsx`. Both use `app/data/projects.ts`; new entries receive another plot automatically. Known project IDs choose distinctive source models; unknown IDs receive a category-based model. Messages are restricted to the matching iframe/parent and same origin.
