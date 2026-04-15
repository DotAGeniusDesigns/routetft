import { Champion } from '../types/tft'

// Set 17 "Space Gods" — sourced from Community Dragon PBE (tftchampions-teamplanner.json)
export const CHAMPIONS: Champion[] = [
  // Cost 1
  { id: 'aatrox', name: 'Aatrox', cost: 1, traits: ['N.O.V.A.', 'Bastion'] },
  { id: 'briar', name: 'Briar', cost: 1, traits: ['Anima', 'Primordian', 'Rogue'] },
  { id: 'caitlyn', name: 'Caitlyn', cost: 1, traits: ['N.O.V.A.', 'Fateweaver'] },
  { id: 'chogath', name: "Cho'Gath", cost: 1, traits: ['Dark Star', 'Brawler'] },
  { id: 'ezreal', name: 'Ezreal', cost: 1, traits: ['Timebreaker', 'Sniper'] },
  { id: 'leona', name: 'Leona', cost: 1, traits: ['Arbiter', 'Vanguard'] },
  { id: 'lissandra', name: 'Lissandra', cost: 1, traits: ['Dark Star', 'Shepherd', 'Replicator'] },
  { id: 'nasus', name: 'Nasus', cost: 1, traits: ['Space Groove', 'Vanguard'] },
  { id: 'poppy', name: 'Poppy', cost: 1, traits: ['Meeple', 'Bastion'] },
  { id: 'reksai', name: "Rek'Sai", cost: 1, traits: ['Primordian', 'Brawler'] },
  { id: 'talon', name: 'Talon', cost: 1, traits: ['Stargazer', 'Rogue'] },
  { id: 'teemo', name: 'Teemo', cost: 1, traits: ['Space Groove', 'Shepherd'] },
  { id: 'twisted-fate', name: 'Twisted Fate', cost: 1, traits: ['Stargazer', 'Fateweaver'] },
  { id: 'veigar', name: 'Veigar', cost: 1, traits: ['Meeple', 'Replicator'] },

  // Cost 2
  { id: 'akali', name: 'Akali', cost: 2, traits: ['N.O.V.A.', 'Marauder'] },
  { id: 'belveth', name: "Bel'Veth", cost: 2, traits: ['Primordian', 'Challenger', 'Marauder'] },
  { id: 'gnar', name: 'Gnar', cost: 2, traits: ['Meeple', 'Sniper'] },
  { id: 'gragas', name: 'Gragas', cost: 2, traits: ['Psionic', 'Brawler'] },
  { id: 'gwen', name: 'Gwen', cost: 2, traits: ['Space Groove', 'Rogue'] },
  { id: 'jax', name: 'Jax', cost: 2, traits: ['Stargazer', 'Bastion'] },
  { id: 'jinx', name: 'Jinx', cost: 2, traits: ['Anima', 'Challenger'] },
  { id: 'meepsie', name: 'Meepsie', cost: 2, traits: ['Meeple', 'Shepherd', 'Voyager'] },
  { id: 'milio', name: 'Milio', cost: 2, traits: ['Timebreaker', 'Fateweaver'] },
  { id: 'mordekaiser', name: 'Mordekaiser', cost: 2, traits: ['Dark Star', 'Channeler', 'Vanguard'] },
  { id: 'pantheon', name: 'Pantheon', cost: 2, traits: ['Timebreaker', 'Brawler', 'Replicator'] },
  { id: 'pyke', name: 'Pyke', cost: 2, traits: ['Psionic', 'Voyager'] },
  { id: 'zoe', name: 'Zoe', cost: 2, traits: ['Arbiter', 'Channeler'] },

  // Cost 3
  { id: 'aurora', name: 'Aurora', cost: 3, traits: ['Anima', 'Voyager'] },
  { id: 'diana', name: 'Diana', cost: 3, traits: ['Arbiter', 'Challenger'] },
  { id: 'fizz', name: 'Fizz', cost: 3, traits: ['Meeple', 'Rogue'] },
  { id: 'illaoi', name: 'Illaoi', cost: 3, traits: ['Anima', 'Vanguard', 'Shepherd'] },
  { id: 'kaisa', name: "Kai'Sa", cost: 3, traits: ['Dark Star', 'Rogue'] },
  { id: 'lulu', name: 'Lulu', cost: 3, traits: ['Stargazer', 'Replicator'] },
  { id: 'maokai', name: 'Maokai', cost: 3, traits: ['N.O.V.A.', 'Brawler'] },
  { id: 'miss-fortune', name: 'Miss Fortune', cost: 3, traits: ['Gun Goddess', 'Choose Trait'] },
  { id: 'ornn', name: 'Ornn', cost: 3, traits: ['Space Groove', 'Bastion'] },
  { id: 'rhaast', name: 'Rhaast', cost: 3, traits: ['Redeemer'] },
  { id: 'samira', name: 'Samira', cost: 3, traits: ['Space Groove', 'Sniper'] },
  { id: 'urgot', name: 'Urgot', cost: 3, traits: ['Mecha', 'Brawler', 'Marauder'] },
  { id: 'viktor', name: 'Viktor', cost: 3, traits: ['Psionic', 'Channeler'] },

  // Cost 4
  { id: 'aurelion-sol', name: 'Aurelion Sol', cost: 4, traits: ['Mecha', 'Channeler'] },
  { id: 'corki', name: 'Corki', cost: 4, traits: ['Meeple', 'Fateweaver'] },
  { id: 'karma', name: 'Karma', cost: 4, traits: ['Dark Star', 'Voyager'] },
  { id: 'kindred', name: 'Kindred', cost: 4, traits: ['N.O.V.A.', 'Challenger'] },
  { id: 'leblanc', name: 'LeBlanc', cost: 4, traits: ['Arbiter', 'Shepherd'] },
  { id: 'master-yi', name: 'Master Yi', cost: 4, traits: ['Psionic', 'Marauder'] },
  { id: 'nami', name: 'Nami', cost: 4, traits: ['Space Groove', 'Replicator'] },
  { id: 'nunu', name: 'Nunu & Willump', cost: 4, traits: ['Stargazer', 'Vanguard'] },
  { id: 'rammus', name: 'Rammus', cost: 4, traits: ['Meeple', 'Bastion'] },
  { id: 'riven', name: 'Riven', cost: 4, traits: ['Timebreaker', 'Rogue'] },
  { id: 'tahm-kench', name: 'Tahm Kench', cost: 4, traits: ['Oracle', 'Brawler'] },
  { id: 'the-mighty-mech', name: 'The Mighty Mech', cost: 4, traits: ['Mecha', 'Voyager'] },
  { id: 'xayah', name: 'Xayah', cost: 4, traits: ['Stargazer', 'Sniper'] },

  // Cost 5
  { id: 'bard', name: 'Bard', cost: 5, traits: ['Meeple', 'Channeler'] },
  { id: 'blitzcrank', name: 'Blitzcrank', cost: 5, traits: ['Party Animal', 'Space Groove', 'Vanguard'] },
  { id: 'fiora', name: 'Fiora', cost: 5, traits: ['Divine Duelist', 'Anima', 'Marauder'] },
  { id: 'graves', name: 'Graves', cost: 5, traits: ['Factory New'] },
  { id: 'jhin', name: 'Jhin', cost: 5, traits: ['Dark Star', 'Eradicator', 'Sniper'] },
  { id: 'morgana', name: 'Morgana', cost: 5, traits: ['Dark Lady'] },
  { id: 'shen', name: 'Shen', cost: 5, traits: ['Bulwark', 'Bastion'] },
  { id: 'sona', name: 'Sona', cost: 5, traits: ['Commander', 'Psionic', 'Shepherd'] },
  { id: 'vex', name: 'Vex', cost: 5, traits: ['Doomer'] },
  { id: 'zed', name: 'Zed', cost: 5, traits: ['Galaxy Hunter'] },
]

export const CHAMPION_MAP = Object.fromEntries(CHAMPIONS.map(c => [c.name, c]))
