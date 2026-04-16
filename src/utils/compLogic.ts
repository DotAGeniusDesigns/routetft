import { MetaComp, UserSelection, CompRecommendation } from '../types/tft'
import { COMBINED_ITEMS, COMPONENT_ITEMS } from '../data/tftItems'
import {
  AUGMENT_TIER_MATCH_POINTS,
  ARTIFACT_TIER_MATCH_POINTS,
  EARLY_GAME_MAX_BONUS,
  EARLY_GAME_STAGE_MULTIPLIER,
  EMBLEM_POINTS_PER_MATCH,
  FULL_ITEM_SLOT_PROGRESS,
  GOD_BOON_MATCH_BONUS,
  ITEM_CORE_SLOT_WEIGHTS,
  ITEM_FLEX_WEIGHT,
  ITEM_ROLE_SLOT_MULTIPLIERS,
  META_LETTER_TIER_FLAT_BONUS,
  SCORING_WEIGHTS,
  SUBSCORE_SCALE,
  UNIT_MATCH_ROLE_WEIGHTS,
} from '../config/scoring'
import {
  normalizeAugmentTiers,
  normalizeArtifactTiers,
  POWER_TIER_ORDER,
} from './tieredMeta'

// composition arrays use component IDs; selection.items uses component names — build a lookup
const compIdToName: Record<string, string> = Object.fromEntries(
  COMPONENT_ITEMS.map(c => [c.id, c.name])
)

export function scoreComp(
  comp: MetaComp,
  selection: UserSelection
): CompRecommendation {
  let score = 0
  const carries = new Set(comp.carries ?? [])
  const tank = comp.tank ?? ''
  const coreSet = new Set(comp.coreUnits ?? [])
  const flexSet = new Set(comp.flexUnits ?? [])

  // --- Unit score ---
  const unitMatches = selection.units.filter(u =>
    comp.coreUnits.includes(u) || comp.flexUnits.includes(u)
  )
  const coreMatches = selection.units.filter(u => comp.coreUnits.includes(u))
  function unitRoleWeight(unit: string): number {
    if (coreSet.has(unit) && carries.has(unit)) return UNIT_MATCH_ROLE_WEIGHTS.carryCore
    if (coreSet.has(unit) && tank === unit) return UNIT_MATCH_ROLE_WEIGHTS.tankCore
    if (coreSet.has(unit)) return UNIT_MATCH_ROLE_WEIGHTS.nonTaggedCore
    if (flexSet.has(unit)) return UNIT_MATCH_ROLE_WEIGHTS.flexUnit
    return 0
  }
  const targetUnitWeight = [...Array.from(coreSet), ...Array.from(flexSet)].reduce(
    (sum, u) => sum + unitRoleWeight(u),
    0
  )
  const matchedUnitWeight = selection.units.reduce((sum, u) => sum + unitRoleWeight(u), 0)
  const unitScore =
    (matchedUnitWeight / Math.max(targetUnitWeight, Number.EPSILON)) * SUBSCORE_SCALE
  score += unitScore * SCORING_WEIGHTS.unit

  // --- Early game bonus ---
  const earlyMatches = selection.units.filter(u => comp.earlyGame.includes(u))
  const earlyRatio = earlyMatches.length / Math.max(comp.earlyGame.length, 1)
  const earlyWeight =
    selection.stage <= 2
      ? EARLY_GAME_STAGE_MULTIPLIER.stage1to2
      : selection.stage === 3
        ? EARLY_GAME_STAGE_MULTIPLIER.stage3
        : EARLY_GAME_STAGE_MULTIPLIER.stage4Plus
  score += earlyRatio * EARLY_GAME_MAX_BONUS * earlyWeight

  // --- Item score (depleting combined + component pools) ---
  type ItemSlot = { item: string; weight: number }
  const slots: ItemSlot[] = []
  const roleSlotMultiplier = (
    champion: string,
    slotType: 'core' | 'flex'
  ): number => {
    const isCarry = carries.has(champion)
    const isTank = tank === champion
    if (isCarry && slotType === 'core') return ITEM_ROLE_SLOT_MULTIPLIERS.carryCore
    if (isCarry && slotType === 'flex') return ITEM_ROLE_SLOT_MULTIPLIERS.carryFlex
    if (isTank && slotType === 'core') return ITEM_ROLE_SLOT_MULTIPLIERS.tankCore
    if (isTank && slotType === 'flex') return ITEM_ROLE_SLOT_MULTIPLIERS.tankFlex
    if (slotType === 'core') return ITEM_ROLE_SLOT_MULTIPLIERS.otherCore
    return ITEM_ROLE_SLOT_MULTIPLIERS.otherFlex
  }

  const unitBuilds = comp.unitBuilds ?? []
  if (unitBuilds.length > 0) {
    unitBuilds.forEach(build => {
      build.coreItems.forEach((item, idx) =>
        slots.push({
          item,
          weight:
            (ITEM_CORE_SLOT_WEIGHTS[idx] ?? ITEM_FLEX_WEIGHT) *
            roleSlotMultiplier(build.champion, 'core'),
        })
      )
      build.flexItems.forEach(item =>
        slots.push({
          item,
          weight: ITEM_FLEX_WEIGHT * roleSlotMultiplier(build.champion, 'flex'),
        })
      )
    })
  } else {
    comp.carryBuilds?.forEach(build => {
      build.items.forEach((item, idx) =>
        slots.push({
          item,
          weight:
            (ITEM_CORE_SLOT_WEIGHTS[idx] ?? ITEM_FLEX_WEIGHT) *
            ITEM_ROLE_SLOT_MULTIPLIERS.carryCore,
        })
      )
    })
  }
  slots.sort((a, b) => b.weight - a.weight)

  const combinedPool = [...(selection.combinedItems ?? [])]
  const pool = [...selection.items]

  function takeBuiltItem(itemName: string): boolean {
    const idx = combinedPool.indexOf(itemName)
    if (idx === -1) return false
    combinedPool.splice(idx, 1)
    return true
  }

  function claimComponents(itemName: string): number {
    const combined = COMBINED_ITEMS.find(i => i.name === itemName)
    if (!combined || combined.composition.length < 2) return 0
    const a = compIdToName[combined.composition[0]] ?? combined.composition[0]
    const b = compIdToName[combined.composition[1]] ?? combined.composition[1]
    let claimed = 0
    const idxA = pool.indexOf(a)
    if (idxA !== -1) { claimed++; pool.splice(idxA, 1) }
    const idxB = pool.indexOf(b)
    if (idxB !== -1) { claimed++; pool.splice(idxB, 1) }
    return claimed
  }

  function slotProgress(itemName: string): number {
    // Built-item precedence:
    // 1) consume exact completed item first (from combinedItems)
    // 2) only if missing, try to consume loose components
    // This prevents double-crediting one slot from both representations while
    // still allowing extra components to satisfy other item slots.
    if (takeBuiltItem(itemName)) return FULL_ITEM_SLOT_PROGRESS
    return claimComponents(itemName) / 2
  }

  let weightedProgress = 0
  let totalItemWeight = 0
  slots.forEach(({ item, weight }) => {
    totalItemWeight += weight
    weightedProgress += weight * slotProgress(item)
  })

  const itemScore = (weightedProgress / Math.max(totalItemWeight, 1)) * SUBSCORE_SCALE
  score += itemScore * SCORING_WEIGHTS.item

  // --- Tiered augment + artifact + emblem ---
  const augmentTiers = normalizeAugmentTiers(comp)
  const artifactTiers = normalizeArtifactTiers(comp)
  const recEmblems = comp.recommendedEmblems ?? []

  function sumTierMatches(
    tiers: typeof augmentTiers,
    userIds: string[],
    perTierPoints: Record<string, number>
  ): number {
    let pts = 0
    for (const tier of POWER_TIER_ORDER) {
      const bucket = tiers[tier] ?? []
      const n = userIds.filter(id => bucket.includes(id)).length
      pts += n * (perTierPoints[tier] ?? 0)
    }
    return pts
  }

  const augmentPts = sumTierMatches(
    augmentTiers,
    selection.augments,
    AUGMENT_TIER_MATCH_POINTS
  )
  const artifactPts = sumTierMatches(
    artifactTiers,
    selection.artifacts,
    ARTIFACT_TIER_MATCH_POINTS
  )

  const matchedEmblems = selection.augments.filter(id =>
    recEmblems.some(e => id.toLowerCase().includes(e.toLowerCase().replace(/\s+/g, '_')))
  )
  const emblemPts = matchedEmblems.length * EMBLEM_POINTS_PER_MATCH

  score += augmentPts + artifactPts + emblemPts

  // --- God boon ---
  const recGodBoons = comp.recommendedGodBoons ?? []
  const godBoonBonus =
    selection.godBoon && recGodBoons.includes(selection.godBoon) ? GOD_BOON_MATCH_BONUS : 0
  score += godBoonBonus

  // --- Meta letter tier ---
  // Always apply as a small baseline quality adjustment.
  score += META_LETTER_TIER_FLAT_BONUS[comp.tier]

  // --- Build path ---
  const buildPath: string[] = []

  if (coreMatches.length === 0 && unitMatches.length === 0) {
    buildPath.push(`Hold ${comp.earlyGame.slice(0, 3).join(', ')} as early game units`)
  } else if (coreMatches.length > 0) {
    buildPath.push(`You have ${coreMatches.length} core unit${coreMatches.length > 1 ? 's' : ''} — keep building toward ${comp.name}`)
  }

  const missingCore = comp.coreUnits.filter(u => !selection.units.includes(u))
  const priorityUnits = missingCore.slice(0, 3)
  if (priorityUnits.length > 0) {
    buildPath.push(`Scout for: ${priorityUnits.join(', ')}`)
  }

  comp.carryBuilds?.forEach(build => {
    const haveComponents = build.components.filter(c => selection.items.includes(c))
    const missingComponents = build.components.filter(c => !selection.items.includes(c))
    if (haveComponents.length > 0) {
      buildPath.push(
        `${build.champion} BIS: ${build.items.join(' → ')}` +
          (missingComponents.length > 0 ? ` (need: ${missingComponents.slice(0, 2).join(', ')})` : ' ✓')
      )
    } else {
      buildPath.push(`${build.champion} wants: ${build.components.slice(0, 3).join(', ')}`)
    }
  })

  return {
    comp,
    score: Math.round(score),
    matchedUnits: coreMatches,
    matchedEarlyUnits: earlyMatches,
    matchedComponents: [],
    buildPath,
    missingCore: missingCore.slice(0, 4),
  }
}

export function getRecommendations(selection: UserSelection, comps: MetaComp[]): CompRecommendation[] {
  return comps
    .map(comp => scoreComp(comp, selection))
    .sort((a, b) => b.score - a.score)
}
