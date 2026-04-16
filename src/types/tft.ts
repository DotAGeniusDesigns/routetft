export interface Champion {
  id: string
  name: string
  cost: 1 | 2 | 3 | 4 | 5
  traits: string[]
}

export interface Trait {
  id: string
  name: string
  breakpoints: number[]
}

export interface TFTItem {
  id: string
  name: string
  isComponent: boolean
  composition: string[] // component item IDs
  imageUrl?: string
}

export interface UnitItemBuild {
  champion: string
  coreItems: string[]     // BIS / must-have items
  flexItems: string[]     // situational / flex item options
}

/** @deprecated use UnitItemBuild — kept for backwards compat with existing data */
export interface CarryBuild {
  champion: string
  items: string[]
  components: string[]
}

/** Power curve for augments & artifacts on a meta comp (drag tiers in admin). */
export type CompPowerTier = 'base' | 'good' | 'great' | 'op'

/** Per-tier lists: augment IDs or artifact names, depending on context. */
export type TieredIdBuckets = Record<CompPowerTier, string[]>

export interface MetaComp {
  id: string
  name: string
  tier: 'S' | 'A' | 'B'
  carries: string[]
  tank: string
  coreUnits: string[]
  flexUnits: string[]
  unitBuilds?: UnitItemBuild[]    // per-unit item assignments (replaces carryBuilds)
  carryBuilds?: CarryBuild[]      // legacy — kept for old data compat
  keyComponents: string[]
  earlyGame: string[]
  playstyle: '1cost-reroll' | '2cost-reroll' | '3cost-reroll' | 'standard' | 'fast9'
  description: string
  link?: string
  /** Flat list — auto-synced from augmentTiers for older saves; scoring prefers augmentTiers. */
  recommendedAugments?: string[]
  /** Drag-tiered augment IDs (base → OP); overrides flat list when present. */
  augmentTiers?: TieredIdBuckets
  /** Drag-tiered artifact item names (from artifact pool). */
  artifactTiers?: TieredIdBuckets
  recommendedEmblems?: string[]   // trait emblem names (e.g. "Dark Star Emblem")
  recommendedGodBoons?: string[]  // god augment IDs that work well for this comp
}

export interface UserSelection {
  items: string[]       // component item names the user has
  /** Finished combined items (built items on bench/board), not components */
  combinedItems: string[]
  units: string[]       // champion names the user holds
  augments: string[]    // augment IDs the user has
  artifacts: string[]   // artifact item names the user has
  godBoon: string | null  // which Space God boon the player received
  stage: number
}

export interface TFTAugment {
  id: string
  name: string
  tier: 'Prismatic' | 'Gold' | 'Silver'
  desc: string
  traits: string[]
  imageUrl?: string
}

export interface CompRecommendation {
  comp: MetaComp
  score: number
  matchedUnits: string[]
  matchedEarlyUnits: string[]
  matchedComponents: string[]
  buildPath: string[]
  missingCore: string[]
}
