// Set 17 "Space Gods" — the 9 god augment boons players can receive
// id matches the augment ID in augments.ts for scoring lookups

export interface GodBoon {
  id: string        // matches augment id for scoring
  name: string
  champion: string  // champion name for portrait image lookup
}

export const GOD_BOONS: GodBoon[] = [
  { id: 'tft17_augment_ahrigodaugment',              name: "Ahri's Boon",         champion: 'Ahri' },
  { id: 'tft17_augment_aurelionsolgodaugment',        name: "Aurelion Sol's Boon", champion: 'Aurelion Sol' },
  { id: 'tft17_augment_ekkogodaugment',              name: "Ekko's Boon",         champion: 'Ekko' },
  { id: 'tft17_augment_evelynngodaugment',           name: "Evelynn's Boon",      champion: 'Evelynn' },
  { id: 'tft17_augment_kaylegodaugment',             name: "Kayle's Boon",        champion: 'Kayle' },
  { id: 'tft17_augment_sorakagodaugment',            name: "Soraka's Boon",       champion: 'Soraka' },
  { id: 'tft17_augment_threshgodaugment',            name: "Thresh's Boon",       champion: 'Thresh' },
  { id: 'tft17_augment_varusgodaugment_boonofstars', name: "Varus's Boon",        champion: 'Varus' },
  { id: 'tft17_augment_yasuogodaugment_paintedpower',name: "Yasuo's Boon",        champion: 'Yasuo' },
]
