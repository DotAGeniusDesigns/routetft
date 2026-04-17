// Set 17 miscellaneous run conditions — god boons, Stargazer constellations, Psionic trait items
// God boon ids match augment ids for any cross-system lookups

export type ConditionCategory = 'god_boon' | 'stargazer_constellation' | 'psionic_item'

export interface Condition {
  id: string
  label: string
  category: ConditionCategory
  /** Space God boon portrait (champion name, matches championImages keys) */
  championPortrait?: string
}

export const CONDITION_CATEGORY_LABEL: Record<ConditionCategory, string> = {
  god_boon: 'God boon',
  stargazer_constellation: 'Stargazer',
  psionic_item: 'Psionic item',
}

/** Space God boons — 9 selectable gods */
const GOD_BOON_CONDITIONS: Condition[] = [
  ['tft17_augment_ahrigodaugment', "Ahri's Boon" as const, 'Ahri' as const],
  ['tft17_augment_aurelionsolgodaugment', "Aurelion Sol's Boon", 'Aurelion Sol'],
  ['tft17_augment_ekkogodaugment', "Ekko's Boon", 'Ekko'],
  ['tft17_augment_evelynngodaugment', "Evelynn's Boon", 'Evelynn'],
  ['tft17_augment_kaylegodaugment', "Kayle's Boon", 'Kayle'],
  ['tft17_augment_sorakagodaugment', "Soraka's Boon", 'Soraka'],
  ['tft17_augment_threshgodaugment', "Thresh's Boon", 'Thresh'],
  ['tft17_augment_varusgodaugment_boonofstars', "Varus's Boon", 'Varus'],
  ['tft17_augment_yasuogodaugment_paintedpower', "Yasuo's Boon", 'Yasuo'],
].map(([id, label, championPortrait]) => ({
  id,
  label,
  category: 'god_boon' as const,
  championPortrait,
}))

/** Stargazer trait — one random constellation per game (empowered hexes) */
const STARGAZER_CONSTELLATIONS: Condition[] = [
  'The Serpent',
  'The Huntress',
  'The Mountain',
  'The Altar',
  'The Medallion',
  'The Fountain',
  'The Boar',
].map(name => ({
  id: `stargazer_${name.toLowerCase().replace(/^the /, '').replace(/\s+/g, '_')}`,
  label: name,
  category: 'stargazer_constellation' as const,
}))

/** Psionic trait-specific items (not regular components) */
const PSIONIC_ITEM_CONDITIONS: Condition[] = [
  'Biomatter Preserver',
  'Drone Uplink',
  'Malware Matrix',
  'Sympathetic Implant',
  'Target-Lock Optics',
].map(name => ({
  id: `psionic_${name.toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_')}`,
  label: name,
  category: 'psionic_item' as const,
}))

export const CONDITIONS: Condition[] = [
  ...GOD_BOON_CONDITIONS,
  ...STARGAZER_CONSTELLATIONS,
  ...PSIONIC_ITEM_CONDITIONS,
]

const byId = Object.fromEntries(CONDITIONS.map(c => [c.id, c])) as Record<string, Condition>

export function getConditionById(id: string): Condition | undefined {
  return byId[id]
}

export function conditionsInCategory(category: ConditionCategory): Condition[] {
  return CONDITIONS.filter(c => c.category === category)
}
