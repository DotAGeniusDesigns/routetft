// Set 17 artifact items with verified CDragon PBE icon URLs
// Filenames confirmed from: raw.communitydragon.org/pbe/game/assets/maps/tft/icons/items/hexcore/

const CDN = 'https://raw.communitydragon.org/pbe/game/assets/maps/tft/icons/items/hexcore'

export interface ArtifactItem {
  name: string
  imageUrl: string
}

export const ARTIFACT_ITEMS: ArtifactItem[] = [
  // ── Set 17-specific god artifacts ────────────────────────────────────────────
  { name: "Ahri's Aura",              imageUrl: `${CDN}/tft17_item_artifact_ahrirhythm.tft_set17.png` },
  { name: "Ekko's Patience",          imageUrl: `${CDN}/tft17_item_artifact_ekkopatience.tft_set17.png` },
  { name: "Evelynn's Instinct",       imageUrl: `${CDN}/tft17_item_artifact_evelynnfang.tft_set17.png` },
  { name: "Kayle's Exaltation",       imageUrl: `${CDN}/tft17_item_artifact_kaylegreatsword.tft_set17.png` },
  { name: "Kayle's Radiant Exaltation", imageUrl: `${CDN}/tft17_item_artifact_kaylegreatsword.tft_set17.png` },
  { name: "Soraka's Miracle",         imageUrl: `${CDN}/tft17_item_artifact_sorakamiracle.tft_set17.png` },
  { name: "Thresh's Lantern",         imageUrl: `${CDN}/tft17_item_artifact_threshlantern.tft_set17.png` },
  { name: "Varus's Obsession",        imageUrl: `${CDN}/tft17_item_artifact_varusobsession.tft_set17.png` },
  { name: "Yasuo's Bladework",        imageUrl: `${CDN}/tft17_item_artifact_yasuobladework.tft_set17.png` },
  // ── Generic artifacts in Set 17 pool ─────────────────────────────────────────
  { name: 'Aegis of Dawn',            imageUrl: `${CDN}/tft_item_artifact_aegisofdawn.tft_set16.png` },
  { name: 'Aegis of Dusk',            imageUrl: `${CDN}/tft_item_artifact_aegisofdusk.tft_set16.png` },
  { name: 'Blighting Jewel',          imageUrl: `${CDN}/tft_item_artifact_blightingjewel.tft_set13.png` },
  { name: 'Cappa Juice',              imageUrl: `${CDN}/tft16_artifact_kappajuice.tft_set16.png` },
  { name: 'Corrupt Vampiric Scepter', imageUrl: `${CDN}/tft_item_artifact_cursedvampiricscepter.tft_set13.png` },
  { name: 'Dawncore',                 imageUrl: `${CDN}/tft_item_artifact_dawncore.tft_set15.png` },
  { name: 'Eternal Pact',             imageUrl: `${CDN}/tft16_artifact_eternalpact.tft_set16.png` },
  { name: 'Fishbones',                imageUrl: `${CDN}/tft_item_artifact_fishbones.tft_set13.png` },
  { name: 'Flickerblades',            imageUrl: `${CDN}/tft_item_artifact_navoriflickerplade.tft_tft14_5.png` },
  { name: 'Forbidden Idol',           imageUrl: `${CDN}/tft_item_artifact_forbiddenidol.tft_set13.png` },
  { name: 'Hellfire Hatchet',         imageUrl: `${CDN}/tft_item_artifact_hellfirehatchet.tft_set16.png` },
  { name: 'Horizon Focus',            imageUrl: `${CDN}/tft_item_artifact_horizonfocus.tft_set13.png` },
  { name: 'Innervating Locket',       imageUrl: `${CDN}/tft_item_artifact_innervatinglocket.tft_set13.png` },
  { name: 'Lesser Mirrored Persona',  imageUrl: `${CDN}/tft16_artifact_lessermirroredpersona.tft_set16.png` },
  { name: 'Lich Bane',                imageUrl: `https://raw.communitydragon.org/pbe/game/assets/maps/particles/tft/item_icons/ornn_items/tft_item_artifact_lichbane.png` },
  { name: 'Lightshield Crest',        imageUrl: `${CDN}/tft_item_artifact_lightshieldcrest.tft_set13.png` },
  { name: "Luden's Tempest",          imageUrl: `${CDN}/tft_item_artifact_ludenstempest.tft_set13.png` },
  { name: 'Mending Echoes',           imageUrl: `${CDN}/tft16_artifact_mendingechoes.tft_set16.png` },
  { name: 'Mirrored Persona',         imageUrl: `${CDN}/tft16_artifact_mirroredpersona.tft_set16.png` },
  { name: 'Mittens',                  imageUrl: `${CDN}/tft_item_artifact_mittens.tft_set13.png` },
  { name: "Prowler's Claw",           imageUrl: `${CDN}/tft_item_artifact_prowlersclaw.tft_set13.png` },
  { name: 'Rapid Firecannon',         imageUrl: `${CDN}/tft_item_artifact_rapidfirecannon.tft_set13.png` },
  { name: "Seeker's Armguard",        imageUrl: `${CDN}/tft_item_artifact_seekersarmguard.tft_set13.png` },
  { name: 'Shadow Puppet',            imageUrl: `${CDN}/tft16_artifact_shadowpuppet.tft_set16.png` },
  { name: 'Silvermere Dawn',          imageUrl: `${CDN}/tft_item_artifact_silvermeredawn.tft_set13.png` },
  { name: 'Spectral Cutlass',         imageUrl: `${CDN}/tft_item_artifact_spectralcutlass.tft_set13.png` },
  { name: 'Statikk Shiv',             imageUrl: `${CDN}/tft_item_artifact_stattikshiv.tft_tft14_5.png` },
  { name: 'Suspicious Trench Coat',   imageUrl: `${CDN}/tft_item_artifact_suspicioustrenchcoat.tft_set13.png` },
  { name: 'Talisman Of Ascension',    imageUrl: `${CDN}/tft_item_artifact_talismanofascension.tft_set13.png` },
  { name: 'The Indomitable',          imageUrl: `${CDN}/tft_item_artifact_theindomitable.tft_tft14_5.png` },
  { name: 'Titanic Hydra',            imageUrl: `${CDN}/tft_item_artifact_titanichydra.tft_tft14_5.png` },
  { name: 'Unending Despair',         imageUrl: `${CDN}/tft_item_artifact_unendingdespair.tft_set13.png` },
  { name: 'Void Gauntlet',            imageUrl: `${CDN}/tft16_artifact_voidgauntlet.tft_set16.png` },
  { name: "Wit's End",                imageUrl: `${CDN}/tft_item_artifact_witsend.tft_set13.png` },
]
