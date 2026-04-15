import { TFTItem } from '../types/tft'

const CDN = 'https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore'

export const COMPONENT_ITEMS: TFTItem[] = [
  { id: 'bf-sword', name: 'B.F. Sword', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_bfsword.tft_set13.png` },
  { id: 'recurve-bow', name: 'Recurve Bow', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_recurvebow.tft_set13.png` },
  { id: 'nlr', name: 'Needlessly Large Rod', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_needlesslylargerod.tft_set13.png` },
  { id: 'tear', name: 'Tear of the Goddess', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_tearofthegoddess.tft_set13.png` },
  { id: 'chain-vest', name: 'Chain Vest', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_chainvest.tft_set13.png` },
  { id: 'negatron', name: 'Negatron Cloak', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_negatroncloak.tft_set13.png` },
  { id: 'giants-belt', name: "Giant's Belt", isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_giantsbelt.tft_set13.png` },
  { id: 'sparring-gloves', name: 'Sparring Gloves', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_sparringgloves.tft_set13.png` },
  { id: 'spatula', name: 'Spatula', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_spatula.tft_set13.png` },
  { id: 'frying-pan', name: 'Frying Pan', isComponent: true, composition: [], imageUrl: `${CDN}/tft_item_fryingpan.tft_set13.png` },
]

// Combined items — composition lists the IDs of the two components
// All recipes verified against Set 17 "Space Gods" PBE data
export const COMBINED_ITEMS: TFTItem[] = [
  // AP items
  { id: 'rabadons', name: "Rabadon's Deathcap", isComponent: false, composition: ['nlr', 'nlr'], imageUrl: `${CDN}/tft_item_rabadonsdeathcap.tft_set13.png` },
  { id: 'jeweled-gauntlet', name: 'Jeweled Gauntlet', isComponent: false, composition: ['nlr', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_jeweledgauntlet.tft_set13.png` },
  { id: 'archangels', name: "Archangel's Staff", isComponent: false, composition: ['tear', 'nlr'], imageUrl: `${CDN}/tft_item_archangelsstaff.tft_set13.png` },
  { id: 'blue-buff', name: 'Blue Buff', isComponent: false, composition: ['tear', 'tear'], imageUrl: `${CDN}/tft_item_bluebuff.tft_set13.png` },
  { id: 'ionic-spark', name: 'Ionic Spark', isComponent: false, composition: ['nlr', 'negatron'], imageUrl: `${CDN}/tft_item_ionicspark.tft_set13.png` },
  { id: 'hextech-gunblade', name: 'Hextech Gunblade', isComponent: false, composition: ['bf-sword', 'nlr'], imageUrl: `${CDN}/tft_item_hextechgunblade.tft_set13.png` },
  { id: 'crownguard', name: 'Crownguard', isComponent: false, composition: ['nlr', 'chain-vest'], imageUrl: `${CDN}/tft_item_crownguard.tft_set13.png` },
  { id: 'morellonomicon', name: 'Morellonomicon', isComponent: false, composition: ['nlr', 'giants-belt'], imageUrl: `${CDN}/tft_item_morellonomicon.tft_set13.png` },
  { id: 'adaptive-helm', name: 'Adaptive Helm', isComponent: false, composition: ['negatron', 'tear'], imageUrl: `${CDN}/tft_item_adaptivehelm.tft_set13.png` },

  // AD items
  { id: 'infinity-edge', name: 'Infinity Edge', isComponent: false, composition: ['bf-sword', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_infinityedge.tft_set13.png` },
  { id: 'giant-slayer', name: 'Giant Slayer', isComponent: false, composition: ['bf-sword', 'recurve-bow'], imageUrl: `${CDN}/tft_item_madredsbloodrazor.tft_set13.png` },
  { id: 'last-whisper', name: 'Last Whisper', isComponent: false, composition: ['recurve-bow', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_lastwhisper.tft_set13.png` },
  { id: 'bloodthirster', name: 'Bloodthirster', isComponent: false, composition: ['bf-sword', 'negatron'], imageUrl: `${CDN}/tft_item_bloodthirster.tft_set13.png` },
  { id: 'spear-of-shojin', name: 'Spear of Shojin', isComponent: false, composition: ['bf-sword', 'tear'], imageUrl: `${CDN}/tft_item_spearofshojin.tft_set13.png` },
  { id: 'deathblade', name: 'Deathblade', isComponent: false, composition: ['bf-sword', 'bf-sword'], imageUrl: `${CDN}/tft_item_deathblade.tft_set13.png` },
  { id: 'sterak', name: "Sterak's Gage", isComponent: false, composition: ['bf-sword', 'giants-belt'], imageUrl: `${CDN}/tft_item_steraksgage.tft_set13.png` },
  { id: 'edge-of-night', name: 'Edge of Night', isComponent: false, composition: ['bf-sword', 'chain-vest'], imageUrl: `${CDN}/tft_item_guardianangel.tft_set13.png` },
  { id: 'titans', name: "Titan's Resolve", isComponent: false, composition: ['chain-vest', 'recurve-bow'], imageUrl: `${CDN}/tft_item_titansresolve.tft_set13.png` },
  { id: 'rageblade', name: "Guinsoo's Rageblade", isComponent: false, composition: ['recurve-bow', 'nlr'], imageUrl: `${CDN}/tft_item_guinsoosrageblade.tft_set13.png` },
  { id: 'void-staff', name: 'Void Staff', isComponent: false, composition: ['recurve-bow', 'tear'], imageUrl: `${CDN}/tft_item_voidstaff.tft_tft14_5.png` },
  { id: 'krakens-fury', name: "Kraken's Fury", isComponent: false, composition: ['negatron', 'recurve-bow'], imageUrl: `${CDN}/tft_item_krakenslayer.tft_tft14_5.png` },
  { id: 'red-buff', name: 'Red Buff', isComponent: false, composition: ['recurve-bow', 'recurve-bow'], imageUrl: `${CDN}/tft_item_rapidfirecannon.tft_set13.png` },
  { id: 'hoj', name: 'Hand of Justice', isComponent: false, composition: ['tear', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_unstableconcoction.tft_set13.png` },
  { id: 'quicksilver', name: 'Quicksilver', isComponent: false, composition: ['negatron', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_quicksilver.tft_set13.png` },
  { id: 'nashors-tooth', name: "Nashor's Tooth", isComponent: false, composition: ['recurve-bow', 'giants-belt'], imageUrl: `${CDN}/tft_item_leviathan.tft_set13.png` },

  // Tank items
  { id: 'warmogs', name: "Warmog's Armor", isComponent: false, composition: ['giants-belt', 'giants-belt'], imageUrl: `${CDN}/tft_item_warmogsarmor.tft_set13.png` },
  { id: 'gargoyle', name: 'Gargoyle Stoneplate', isComponent: false, composition: ['chain-vest', 'negatron'], imageUrl: `${CDN}/tft_item_gargoylestoneplate.tft_set13.png` },
  { id: 'bramble', name: 'Bramble Vest', isComponent: false, composition: ['chain-vest', 'chain-vest'], imageUrl: `${CDN}/tft_item_bramblevest.tft_set13.png` },
  { id: 'dragons-claw', name: "Dragon's Claw", isComponent: false, composition: ['negatron', 'negatron'], imageUrl: `${CDN}/tft_item_dragonsclaw.tft_set13.png` },
  { id: 'sunfire', name: 'Sunfire Cape', isComponent: false, composition: ['chain-vest', 'giants-belt'], imageUrl: `${CDN}/tft_item_redbuff.tft_set13.png` },
  { id: 'spirit-visage', name: 'Spirit Visage', isComponent: false, composition: ['tear', 'giants-belt'], imageUrl: `${CDN}/tft_item_spiritvisagerr.tft_tft14_5.png` },
  { id: 'frozen-heart', name: "Protector's Vow", isComponent: false, composition: ['chain-vest', 'tear'], imageUrl: `${CDN}/tft_item_frozenheart.tft_set13.png` },
  { id: 'steadfast-heart', name: 'Steadfast Heart', isComponent: false, composition: ['chain-vest', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_nightharvester.tft_set13.png` },
  { id: 'evenshroud', name: 'Evenshroud', isComponent: false, composition: ['negatron', 'giants-belt'], imageUrl: `${CDN}/tft_item_spectralgauntlet.tft_set13.png` },
  { id: 'strikers-flail', name: "Striker's Flail", isComponent: false, composition: ['giants-belt', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_powergauntlet.tft_set13.png` },
  { id: 'thiefs-gloves', name: "Thief's Gloves", isComponent: false, composition: ['sparring-gloves', 'sparring-gloves'], imageUrl: `${CDN}/tft_item_thiefsgloves.tft_set13.png` },
]

export const ALL_ITEMS = [...COMPONENT_ITEMS, ...COMBINED_ITEMS]

// Which completed items can be built from a given component
export function getCombinedFromComponent(componentId: string): TFTItem[] {
  return COMBINED_ITEMS.filter(item => item.composition.includes(componentId))
}

// Which completed items can be built from two components together
export function getCombinedFromTwo(comp1: string, comp2: string): TFTItem[] {
  return COMBINED_ITEMS.filter(item =>
    item.composition.includes(comp1) && item.composition.includes(comp2)
  )
}
