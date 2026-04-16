import { MetaComp, TieredIdBuckets, CompPowerTier } from '../types/tft'

export const POWER_TIER_ORDER: CompPowerTier[] = ['base', 'good', 'great', 'op']

export const EMPTY_TIER_BUCKETS: TieredIdBuckets = {
  base: [],
  good: [],
  great: [],
  op: [],
}

/** Fresh tier buckets (never share array refs with EMPTY_TIER_BUCKETS). */
export function emptyTierBuckets(): TieredIdBuckets {
  return { base: [], good: [], great: [], op: [] }
}

export function flattenTierBuckets(t: TieredIdBuckets): string[] {
  return POWER_TIER_ORDER.flatMap(tier => t[tier])
}

export function removeKeyFromTiers(tiers: TieredIdBuckets, key: string): TieredIdBuckets {
  const next = emptyTierBuckets()
  for (const tier of POWER_TIER_ORDER) {
    next[tier] = (tiers[tier] ?? []).filter(k => k !== key)
  }
  return next
}

export function normalizeAugmentTiers(comp: MetaComp): TieredIdBuckets {
  const hasStructured =
    comp.augmentTiers &&
    POWER_TIER_ORDER.some(tier => (comp.augmentTiers![tier] ?? []).length > 0)
  if (hasStructured && comp.augmentTiers) {
    return dedupeAcrossTiers(comp.augmentTiers)
  }
  if (comp.recommendedAugments?.length) {
    return { ...emptyTierBuckets(), good: [...comp.recommendedAugments] }
  }
  return emptyTierBuckets()
}

export function normalizeArtifactTiers(comp: MetaComp): TieredIdBuckets {
  if (!comp.artifactTiers) return emptyTierBuckets()
  return dedupeAcrossTiers(comp.artifactTiers)
}

function dedupeAcrossTiers(tiers: TieredIdBuckets): TieredIdBuckets {
  const seen = new Set<string>()
  const out = emptyTierBuckets()
  // Prefer stronger tiers first if duplicates exist in data
  for (const tier of [...POWER_TIER_ORDER].reverse()) {
    for (const id of tiers[tier] ?? []) {
      if (!seen.has(id)) {
        seen.add(id)
        out[tier].push(id)
      }
    }
  }
  return out
}

/** One-time UI migration when loading comps in admin. */
export function migrateMetaCompDraft(comp: MetaComp): MetaComp {
  const augmentTiers = normalizeAugmentTiers(comp)
  const artifactTiers = comp.artifactTiers ? dedupeAcrossTiers(comp.artifactTiers) : emptyTierBuckets()
  return {
    ...comp,
    augmentTiers,
    artifactTiers,
    recommendedAugments: flattenTierBuckets(augmentTiers),
  }
}
