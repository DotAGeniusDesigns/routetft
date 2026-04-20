# routeTFT — CLAUDE.md

## Project Overview
A Teamfight Tactics **Set 17 "Space Gods"** comp finder that recommends optimal compositions based on the player's current items, units, and augments. Game data is sourced from Community Dragon PBE CDN (champion/item images and data). No API key needed.

**App name:** routeTFT

## Stack
- **React 18** + **TypeScript** (CRA / react-scripts)
- **Tailwind CSS v3** for styling (custom config, no component library)
- **lucide-react** for icons
- **Express.js** admin server (port 3001) — `npm run admin` — for editing data files via GUI
- CRA proxy: `"proxy": "http://localhost:3001"` in package.json

## File Structure
```
src/
├── App.tsx                        # Root — holds UserSelection state, 4-column layout
├── index.tsx                      # Entry point
├── index.css                      # Global styles + Tailwind + Google Fonts import
├── types/
│   └── tft.ts                     # All TypeScript interfaces
├── config/
│   └── scoring.ts                 # All numeric scoring constants (weights, bonuses, multipliers)
├── data/
│   ├── set17Champions.ts          # 63 Set 17 purchasable champions
│   ├── championImages.ts          # CHAMPION_IMAGES: Record<string, string> — CDragon PBE portrait URLs
│   ├── tftItems.ts                # 10 component items + 32 combined items with CDN image URLs
│   ├── artifactItems.ts           # Artifact item pool with image URLs
│   ├── augments.ts                # Set 17 augments (Silver/Gold/Prismatic per trait)
│   ├── augmentImages.ts           # Empty stub — image URLs now live in augments.ts (imageUrl field)
│   ├── emblemTraits.ts            # EMBLEM_TRAIT_NAMES — trait names valid for Spatula/Pan crafts
│   ├── conditions.ts              # Set 17 run conditions: god boons, Stargazer constellations, Psionic items
│   └── metaComps.ts               # Meta comps (S/A/B/C tier) for Set 17
├── contexts/
│   └── TFTDataContext.tsx         # Provides champions, comps, componentItems, combinedItems, augments
├── components/
│   ├── UnitPanel.tsx              # Champion selector — portrait images, cost border/glow, filter by cost + trait
│   ├── ItemPanel.tsx              # Component + combined item selector — CDN icons, multi-select with counts
│   ├── AugmentPanel.tsx           # Augment selector — compact search-only bar + selected chips
│   ├── ArtifactPanel.tsx          # Artifact item selector
│   ├── EmblemPanel.tsx            # Trait emblem selector — search + selected chips
│   ├── ConditionsPanel.tsx        # God boon / Stargazer constellation / Psionic item selector
│   ├── CompRecommendations.tsx    # Live ranked comp recommendations — champion portraits + item icons
│   ├── AdminPanel.tsx             # Admin UI — Augments tab + Meta Comps tab (requires admin server)
│   └── admin/
│       ├── TeamBuilder.tsx        # Visual team builder for meta comps — champion pool with images, roles, trait calc
│       └── TieredRecommendationsEditor.tsx  # Drag-tier editor for augments/artifacts/emblems per comp
└── utils/
    ├── compLogic.ts               # Scoring algorithm + recommendation engine
    └── tieredMeta.ts              # Helpers for TieredIdBuckets (normalize, flatten, dedupe, migrate)
admin-server.js                    # Express REST API for editing augments.ts and metaComps.ts
scrape-augments.js                 # One-off Playwright scraper (re-run each patch for augments)
```

## Layout
4-column flexbox layout with `overflow-x-auto` — scrolls horizontally on small windows:
```
[ Units (240px) | Items (300px) | Augments+Artifacts+Emblems+Conditions (260px) | Recommendations (flex, min 280px) ]
```
Third column stacks AugmentPanel / ArtifactPanel / EmblemPanel / ConditionsPanel with `divide-y`.
Header bar: app name, stage selector (1–5), clear all button.

Admin panel accessed via `?admin=<REACT_APP_ADMIN_KEY>` URL param.

## Design System
Dark gaming aesthetic. All colors in Tailwind via arbitrary values or CSS classes.

| Role | Value |
|---|---|
| Page background | `#0d0f17` |
| Panel background | `#13162a` |
| Panel border | `#1e2240` |
| Gold accent | `#c89b3c` |
| Secondary text | `#94a3b8` |
| Muted text | `#64748b` |

Cost colors: 1=grey `#aaa`, 2=green `#5db85a`, 3=blue `#5b9bd5`, 4=purple `#b070e8`, 5=gold `#ffb938`
Tier colors: Prismatic=purple `#b070e8`, Gold=`#ffb938`, Silver=`#94a3b8`
Power tier colors: base=`#64748b`, good=`#5db85a`, great=`#5b9bd5`, op=`#ffb938`

Fonts: `Orbitron` (headings/logo via `font-['Orbitron']`), `Inter` (body) — loaded from Google Fonts in `index.css`.

Custom CSS classes defined in `index.css` `@layer components`: `.panel`, `.panel-header`, `.chip`, `.cost-1` through `.cost-5`, `.tier-s/a/b/c`, `.btn-primary`, `.btn-ghost`, `.unit-card`, `.item-chip`.

## Key Types (`src/types/tft.ts`)
- `Champion` — id, name, cost (1–5), traits[]
- `TFTItem` — id, name, isComponent, composition (component IDs), imageUrl?
- `TFTAugment` — id, name, tier (Prismatic/Gold/Silver), desc, traits[], imageUrl?
- `UnitItemBuild` — champion, coreItems[], flexItems[] (replaces legacy `CarryBuild`)
- `CarryBuild` — champion, items[], components[] (legacy, kept for backwards compat)
- `CompPowerTier` — `'base' | 'good' | 'great' | 'op'`
- `TieredIdBuckets` — `Record<CompPowerTier, string[]>` — per-tier augment/artifact/emblem lists
- `MetaComp` — id, name, tier (S/A/B/C), carries[], tank, coreUnits[], flexUnits[], unitBuilds?, carryBuilds?, keyComponents[], earlyGame[], playstyle, description, augmentTiers?, artifactTiers?, emblemTiers?, recommendedEmblems?, recommendedConditions?
- `UserSelection` — items[] (component names), combinedItems[] (built items), units[], augments[], artifacts[], emblems[], conditions[], stage
- `CompRecommendation` — comp, score, matchedUnits[], matchedEarlyUnits[], matchedComponents[], buildPath[], missingCore[]

## Scoring Logic (`src/utils/compLogic.ts` + `src/config/scoring.ts`)
All numeric constants live in `scoring.ts` — never hardcode numbers in `compLogic.ts`.

**Pillars** (each normalized 0–100 before weight):
- **Unit score** × `SCORING_WEIGHTS.unit` (0.3) — weighted by role (carry > tank > core > flex)
- **Item score** × `SCORING_WEIGHTS.item` (0.5) — greedy slot allocation across all item slots; built items score `FULL_ITEM_SLOT_PROGRESS` (2.2), components score 0.5 per part

**Flat additions** (not normalized, added directly to score):
- **Early game bonus** — `earlyRatio × EARLY_GAME_MAX_BONUS × stageMultiplier` (diminishes at later stages)
- **Augment tier pts** — match against `augmentTiers` buckets; op=30, great=16, good=10, base=4
- **Artifact tier pts** — same buckets; op=24, great=16, good=10, base=4
- **Emblem pts** — matched via held emblems, augment substring, or Spatula/Pan crafts; uses artifact tier table
- **Condition bonus** — god boon match = +6, Stargazer/Psionic match = +4

**Note:** Meta letter tier (S/A/B/C) intentionally does **not** affect score — comps rank purely by board match.

**Item slot weighting:** Core slots weighted [3.2, 2.4, 1.4]; flex = 0.9. Carry core = 1.0×, carry flex = 0.65×, tank core = 0.42×, tank flex = 0.22×, other core = 0.35×, other flex = 0.2×.

**Display vs score:** `componentProgress()` in `CompRecommendations.tsx` is independent (non-greedy) for display only. `allocateCompItemSlots()` in `compLogic.ts` is greedy (reserves shared components), so displayed item progress can be optimistic vs the actual score.

## Meta Comps (`src/data/metaComps.ts`)
Update each patch via Admin panel (`?admin=<key>`). Per-comp fields set in admin:
- `unitBuilds` — per-champion core + flex item lists (preferred over legacy `carryBuilds`)
- `augmentTiers` / `artifactTiers` / `emblemTiers` — drag-tiered power buckets (base→op)
- `recommendedConditions` — god boon / constellation / Psionic item IDs from `data/conditions.ts`

## Champion Notes (`src/data/set17Champions.ts`)
- **63 purchasable Set 17 champions**
- Names must match `championImages.ts` keys exactly for images to load
- Special names requiring exact strings: `"Cho'Gath"`, `"Rek'Sai"`, `"Bel'Veth"`, `"Kai'Sa"`, `"Nunu & Willump"`, `"The Mighty Mech"`
- `"The Mighty Mech"` maps to `tft17_galio` in championImages.ts
- `"Meepsie"` maps to `tft17_ivernminion` in championImages.ts

## Data Sources

### Champion Images (`src/data/championImages.ts`)
- Pattern: `https://raw.communitydragon.org/pbe/game/assets/characters/tft17_{id}/hud/tft17_{id}_square.tft_set17.png`
- Uses **PBE** endpoint (not `latest`) since Set 17 is not yet live
- Source of truth for champion data: `tftchampions-teamplanner.json` from Community Dragon PBE (`tier` field = gold cost)

### Augments (`src/data/augments.ts`)
- Set 17 augments: Silver Hearts, Gold Crests, Prismatic Crowns per trait + champion-specific augments
- Image URLs: `https://cdn.mobalytics.gg/assets/tft/images/hextech-augments/set17/` — will 404 until set goes live
- Augment IDs are slugified names + tier suffix (e.g. `dark_star_heart_silver`)
- Re-scrape when set goes live by running `scrape-augments.js`

### Item Images (`src/data/tftItems.ts`)
- Base CDN: `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/`
- Standard items: `tft_item_{name}.tft_set13.png`
- Newer items: `tft_item_{name}.tft_tft14_5.png` (Kraken's Fury, Void Staff, Spirit Visage)
- Hand of Justice uses `tft_item_unstableconcoction.tft_set13.png` (PBE apiName is UnstableConcoction)
- `imageUrl` is optional on `TFTItem` — components fall back to colored swatch on error

## Items List (`src/data/tftItems.ts`)
All recipes verified against Set 17 PBE data. **Many recipes changed from previous sets:**

**Components (10):** B.F. Sword, Recurve Bow, Needlessly Large Rod, Tear of the Goddess, Chain Vest, Negatron Cloak, Giant's Belt, Sparring Gloves, Spatula, Frying Pan

**Key recipe changes vs prior sets:**
- **Last Whisper** = Recurve Bow + Sparring Gloves (was BF + Recurve)
- **Giant Slayer** = B.F. Sword + Recurve Bow (new name for that recipe)
- **Void Staff** = Recurve Bow + Tear of the Goddess (was Statikk Shiv apiName)
- **Kraken's Fury** = Negatron Cloak + Recurve Bow (renamed from Runaan's Hurricane)
- **Red Buff** = Recurve Bow + Recurve Bow (renamed from Rapid Fire Cannon apiName)
- **Spirit Visage** = Tear + Giant's Belt (renamed from Redemption)
- **Steadfast Heart** = Chain Vest + Sparring Gloves (renamed from Night Harvester)
- **Edge of Night** = B.F. Sword + Chain Vest (renamed from Guardian Angel)
- **Ionic Spark** = NLR + Negatron Cloak (was Tear + Negatron)
- **Sunfire Cape** uses `tft_item_redbuff.tft_set13.png` icon (apiName is TFT_Item_RedBuff)

**New Set 17 items:** Hextech Gunblade (BF+NLR), Giant Slayer (BF+Recurve), Evenshroud (Negatron+Giants Belt), Nashor's Tooth (Recurve+Giants Belt), Striker's Flail (Giants Belt+Sparring)

**Spatula / Frying Pan** are excluded from regular item-slot component allocation — they route through emblem scoring only.

## Admin Backend (`admin-server.js`)
Express server on port 3001. Start with `npm run admin` (separate terminal from `npm start`).
- Parses `augments.ts` via `JSON.parse(raw.slice(raw.indexOf('= [') + 2, ...))`
- Parses `metaComps.ts` via `new Function('module', stripped)(mod)` eval approach
- REST: `GET/POST/PUT/DELETE /api/augments` and `/api/comps`
- Writes back to `src/data/*.ts` files on every mutation (in-memory state)
- **CRA proxy requires restart of `npm start` after adding proxy to package.json**

## Dev Commands
```bash
npm start        # Dev server on localhost:3000
npm run admin    # Admin Express server on localhost:3001 (run in separate terminal)
npm run build    # Production build → /build
node scrape-augments.js  # Re-scrape augments (run when Set 17 goes live)
```

## Conventions
- State lives in `App.tsx` (`UserSelection`), passed down as props
- Game data flows through `TFTDataContext` — don't import data files directly in components
- **Exception**: `CHAMPION_IMAGES` is imported directly in `UnitPanel.tsx`, `admin/TeamBuilder.tsx`, and `CompRecommendations.tsx` (display-only, not game logic)
- **Exception**: `AUGMENT_IMAGES` import in `AugmentPanel.tsx` is kept for compat but the record is empty — use `aug.imageUrl` instead
- **Exception**: `COMPONENT_ITEMS` + `COMBINED_ITEMS` are imported directly in `CompRecommendations.tsx` for the item icon lookup (display-only)
- **Exception**: `ARTIFACT_ITEMS` imported directly in `CompRecommendations.tsx` and `ArtifactPanel.tsx` (display-only)
- All new components go in `src/components/`
- All new types go in `src/types/tft.ts`
- All scoring numbers go in `src/config/scoring.ts` — never hardcode in `compLogic.ts`
- Tailwind only — no inline styles, no CSS modules (exception: style prop for dynamic colors)
- Use arbitrary Tailwind values (`bg-[#0d0f17]`) not custom color tokens
- Item remove uses `__remove__` prefix hack in `toggleItem` — known tech debt
- Item/champion images use `onError` fallbacks — don't assume CDN images load
- Bash commands need `cd /home/dotagenius/routetft &&` prefix (shell cwd may reset)
