/**
 * routeTFT — master scoring numbers
 * ================================
 * The recommendation engine (`utils/compLogic.ts`) reads **only** from this file
 * for numeric tuning. Adjust values here to change how comps rank; the algorithm
 * structure lives in `compLogic.ts`.
 */

import type { CompPowerTier } from '../types/tft'

// ─── Main pillars (unit & item subscores are 0–SUBSCORE_SCALE before these) ───

/** Max scale for unit coverage and item progress before pillar weights apply */
export const SUBSCORE_SCALE = 100

export const SCORING_WEIGHTS = {
  /** Weight of core-unit coverage vs total score */
  unit: 0.3,
  /** Weight of item build progress vs total score */
  item: 0.5,
} as const

// ─── Unit match role weights (used inside normalized unit coverage) ──────────

/**
 * Relative importance of matching each comp unit category.
 * Higher values mean that unit contributes more to unitScore.
 */
export const UNIT_MATCH_ROLE_WEIGHTS = {
  carryCore: 1.0,
  tankCore: 0.7,
  nonTaggedCore: 0.5,
  flexUnit: 0.2,
} as const

// ─── Early-game unit bonus (extra points from `earlyGame` list overlap) ───────

/** Maximum points before stage multiplier */
export const EARLY_GAME_MAX_BONUS = 10

/** Multiplies `EARLY_GAME_MAX_BONUS * earlyRatio` based on current stage */
export const EARLY_GAME_STAGE_MULTIPLIER = {
  /** Stages 1–2 */
  stage1to2: 0.35,
  /** Stage 3 */
  stage3: 0.2,
  /** Stage 4+ */
  stage4Plus: 0.05,
} as const

// ─── Item slots (core BIS weights + finished item vs components) ─────────────

/** Weights for 1st / 2nd / 3rd core item slot; flex slots use `ITEM_FLEX_WEIGHT` */
export const ITEM_CORE_SLOT_WEIGHTS: readonly [number, number, number] = [3.2, 2.4, 1.4]

/** Weight for each flex-item slot */
export const ITEM_FLEX_WEIGHT = 0.9

/**
 * Slot progress when the user selected a **built** copy in `combinedItems`.
 * Loose components contribute at most `1.0` (both parts present).
 */
export const FULL_ITEM_SLOT_PROGRESS = 2.2

/**
 * Additional multipliers by champion role + slot type.
 * These control carry/tank and core/flex item hierarchy.
 */
export const ITEM_ROLE_SLOT_MULTIPLIERS = {
  carryCore: 1.0,
  carryFlex: 0.65,
  tankCore: 0.42,
  tankFlex: 0.22,
  otherCore: 0.35,
  otherFlex: 0.2,
} as const

// ─── Augment & artifact tier lists (meta comp editor tiers) ──────────────────

export const AUGMENT_TIER_MATCH_POINTS: Record<CompPowerTier, number> = {
  base: 4,
  good: 10,
  great: 16,
  op: 30,
}

/** Artifact priority mirrors augments except OP is slightly lower than OP augments. */
export const ARTIFACT_TIER_MATCH_POINTS: Record<CompPowerTier, number> = {
  base: 4,
  good: 10,
  great: 16,
  op: 24,
}

// ─── Trait emblems (matched via augment ID substring rules in compLogic) ─────

export const EMBLEM_POINTS_PER_MATCH = 16

// ─── Miscellaneous conditions (god boon, constellation, Psionic item, …) ───

/** Points per user condition that appears on the comp’s recommended list */
export const CONDITION_MATCH_BONUS = 2

// ─── Meta comp letter tier (S / A / B / C) ───────────────────────────────────

/** Flat bonus by meta letter tier (no extra multiplier). */
export const META_LETTER_TIER_FLAT_BONUS = {
  // Around a carry-unit-level bump
  S: 8,
  // Around a tank-unit-level bump
  A: 5.5,
  // No baseline boost for B tier
  B: 0,
  // Small negative nudge for fringe comps
  C: -3,
} as const
