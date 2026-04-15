import { MetaComp, UserSelection, CompRecommendation } from '../types/tft'
import { COMBINED_ITEMS, COMPONENT_ITEMS } from '../data/tftItems'

// composition arrays use component IDs; selection.items uses component names — build a lookup
const compIdToName: Record<string, string> = Object.fromEntries(
  COMPONENT_ITEMS.map(c => [c.id, c.name])
)

export function scoreComp(
  comp: MetaComp,
  selection: UserSelection
): CompRecommendation {
  let score = 0

  // --- Unit score (40%) ---
  const unitMatches = selection.units.filter(u =>
    comp.coreUnits.includes(u) || comp.flexUnits.includes(u)
  )
  const coreMatches = selection.units.filter(u => comp.coreUnits.includes(u))
  const unitScore = (coreMatches.length / Math.max(comp.coreUnits.length, 1)) * 100
  score += unitScore * 0.4

  // --- Early game bonus (up to +10 pts) ---
  // Strong signal at stage 2, halved at stage 3, negligible at stage 4+
  const earlyMatches = selection.units.filter(u => comp.earlyGame.includes(u))
  const earlyRatio = earlyMatches.length / Math.max(comp.earlyGame.length, 1)
  const earlyWeight = selection.stage <= 2 ? 1.0 : selection.stage === 3 ? 0.5 : 0.05
  score += earlyRatio * 10 * earlyWeight

  // --- Item score (45%) ---
  // Uses a shared, depleting component pool so the same physical component can't be
  // double-counted across multiple items. Process highest-weight slots first so
  // priority items claim components before lower-weight ones do.
  //
  // Contribution per slot: weight * (components_claimed / 2)
  //   0 components  → 0 credit
  //   1 component   → half credit
  //   2 components  → full credit
  const ITEM_WEIGHTS = [2, 2, 1]

  // Flatten all item slots into (itemName, weight) pairs, highest weight first
  type ItemSlot = { item: string; weight: number }
  const slots: ItemSlot[] = []

  const unitBuilds = comp.unitBuilds ?? []
  if (unitBuilds.length > 0) {
    unitBuilds.forEach(build => {
      build.coreItems.forEach((item, idx) => slots.push({ item, weight: ITEM_WEIGHTS[idx] ?? 1 }))
      build.flexItems.forEach(item => slots.push({ item, weight: 1 }))
    })
  } else {
    comp.carryBuilds?.forEach(build => {
      build.items.forEach((item, idx) => slots.push({ item, weight: ITEM_WEIGHTS[idx] ?? 1 }))
    })
  }
  slots.sort((a, b) => b.weight - a.weight)

  // Single component pool — components are consumed as they're claimed
  const pool = [...selection.items]

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

  let weightedProgress = 0
  let totalItemWeight = 0
  slots.forEach(({ item, weight }) => {
    totalItemWeight += weight
    weightedProgress += weight * (claimComponents(item) / 2)
  })

  const itemScore = (weightedProgress / Math.max(totalItemWeight, 1)) * 100
  score += itemScore * 0.45

  // --- Augment / emblem bonus (up to +20 pts) ---
  const recAugments = comp.recommendedAugments ?? []
  const recEmblems = comp.recommendedEmblems ?? []
  const matchedAugments = selection.augments.filter(id => recAugments.includes(id))
  const matchedEmblems = selection.augments.filter(id =>
    recEmblems.some(e => id.toLowerCase().includes(e.toLowerCase().replace(/\s+/g, '_')))
  )
  const augmentBonus = Math.min((matchedAugments.length + matchedEmblems.length) * 10, 20)
  score += augmentBonus

  // --- God Boon bonus (+20 pts) ---
  const recGodBoons = comp.recommendedGodBoons ?? []
  const godBoonBonus = (selection.godBoon && recGodBoons.includes(selection.godBoon)) ? 20 : 0
  score += godBoonBonus

  // --- Tier bonus (15%) and stage/playstyle modifier ---
  // Only apply if there's actual signal from unit/item/augment/boon matches.
  const hasSignal = unitScore > 0 || weightedProgress > 0 || augmentBonus > 0 || godBoonBonus > 0

  if (hasSignal) {
    const tierBonus = comp.tier === 'S' ? 100 : comp.tier === 'A' ? 75 : 50
    score += tierBonus * 0.15

    if (selection.stage <= 2) {
      if (comp.playstyle === '1cost-reroll') score += 15
      else if (comp.playstyle === '2cost-reroll') score += 12
      else if (comp.playstyle === '3cost-reroll') score += 5
      else if (comp.playstyle === 'standard') score += 5
      else if (comp.playstyle === 'fast9') score += 3
    } else if (selection.stage === 3) {
      if (comp.playstyle === '1cost-reroll') score += 8
      else if (comp.playstyle === '2cost-reroll') score += 12
      else if (comp.playstyle === '3cost-reroll') score += 12
      else if (comp.playstyle === 'standard') score += 8
      else if (comp.playstyle === 'fast9') score += 8
    } else if (selection.stage === 4) {
      if (comp.playstyle === 'standard') score += 5
      else if (comp.playstyle === 'fast9') score += 8
    }
  }

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
