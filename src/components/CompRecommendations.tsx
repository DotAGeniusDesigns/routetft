import React, { useState } from 'react'
import { CompRecommendation, UserSelection } from '../types/tft'
import { CHAMPION_IMAGES } from '../data/championImages'
import { COMPONENT_ITEMS, COMBINED_ITEMS } from '../data/tftItems'
import { GOD_BOONS } from '../data/godBoons'

const ITEM_IMAGES: Record<string, string> = Object.fromEntries(
  [...COMPONENT_ITEMS, ...COMBINED_ITEMS]
    .filter(i => i.imageUrl)
    .map(i => [i.name, i.imageUrl as string])
)

// composition arrays use component IDs; selection.items uses component names
const compIdToName: Record<string, string> = Object.fromEntries(
  COMPONENT_ITEMS.map(c => [c.id, c.name])
)

// For a given combined item name, count how many of its 2 components the user has
function componentProgress(itemName: string, userComponents: string[]): number {
  const combined = COMBINED_ITEMS.find(i => i.name === itemName)
  if (!combined || combined.composition.length < 2) return 0
  const a = compIdToName[combined.composition[0]] ?? combined.composition[0]
  const b = compIdToName[combined.composition[1]] ?? combined.composition[1]
  const copy = [...userComponents]
  let have = 0
  const idxA = copy.indexOf(a)
  if (idxA !== -1) { have++; copy.splice(idxA, 1) }
  const idxB = copy.indexOf(b)
  if (idxB !== -1) { have++ }
  return have
}

// Whether the user can fully build this item right now
function canBuildItem(itemName: string, userComponents: string[]): boolean {
  return componentProgress(itemName, userComponents) === 2
}

interface Props {
  recommendations: CompRecommendation[]
  selection: UserSelection
}

const TIER_CLASS: Record<string, string> = {
  S: 'tier-s',
  A: 'tier-a',
  B: 'tier-b',
}

const PLAYSTYLE_LABEL: Record<string, string> = {
  '1cost-reroll': '↩ 1-Cost',
  '2cost-reroll': '↩ 2-Cost',
  '3cost-reroll': '↩ 3-Cost',
  standard: '↑ Standard',
  fast9: '⚡ Fast 9',
}

function ItemIcon({ name, userComponents, isFlex = false }: { name: string; userComponents: string[]; isFlex?: boolean }) {
  const img = ITEM_IMAGES[name]
  const progress = componentProgress(name, userComponents)
  const built = canBuildItem(name, userComponents)

  // Determine border/glow based on item progress
  let borderStyle = ''
  if (built) {
    borderStyle = isFlex
      ? 'border-[#a78bfa] shadow-[0_0_4px_#a78bfa60]'
      : 'border-[#c89b3c] shadow-[0_0_4px_#c89b3c60]'
  } else if (progress === 1) {
    borderStyle = 'border-[#5b9bd5]'
  } else {
    borderStyle = isFlex ? 'border-[#3b0764]/40' : 'border-[#2d3154]'
  }

  const opacity = !built && progress === 0 ? 'opacity-35' : 'opacity-100'

  return (
    <div
      className={`relative w-5 h-5 rounded border overflow-hidden transition-all ${borderStyle} ${opacity}`}
      title={name}
    >
      {img ? (
        <img src={img} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-[#1e2240] flex items-center justify-center text-[6px] text-[#64748b]">
          {name[0]}
        </div>
      )}
      {/* Half-component dot */}
      {!built && progress === 1 && (
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#5b9bd5] rounded-tl" />
      )}
    </div>
  )
}

export default function CompRecommendations({ recommendations, selection }: Props) {
  const [expanded, setExpanded] = useState<string | null>(recommendations[0]?.comp.id ?? null)

  if (recommendations.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <p className="text-[#64748b] text-sm">Select units or components to get recommendations</p>
      </div>
    )
  }

  const top = recommendations[0]
  const maxScore = top.score
  const anySelected = selection.units.length > 0 || selection.items.length > 0 || selection.augments.length > 0

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="text-[#c89b3c] font-semibold font-['Orbitron'] text-sm tracking-wide">RECOMMENDATIONS</span>
        <span className="ml-auto text-xs text-[#64748b]">scored by your board</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#1e2240]">
        {recommendations.map((rec, i) => {
          const isExpanded = expanded === rec.comp.id
          const pct = anySelected && maxScore > 0 ? Math.round((rec.score / maxScore) * 100) : 0

          return (
            <div key={rec.comp.id}>
              {/* Header row */}
              <button
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1a1d2e] transition-colors text-left"
                onClick={() => setExpanded(isExpanded ? null : rec.comp.id)}
              >
                {/* Rank */}
                <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${i === 0 ? 'bg-[#c89b3c]/20 text-[#c89b3c]' : 'text-[#64748b]'}`}>
                  #{i + 1}
                </span>

                {/* Comp name + tier */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white truncate">{rec.comp.name}</span>
                    <span className={`chip ${TIER_CLASS[rec.comp.tier]}`}>{rec.comp.tier}</span>
                    <span className="chip bg-[#1e2240] text-[#64748b] border border-transparent text-[10px]">
                      {PLAYSTYLE_LABEL[rec.comp.playstyle]}
                    </span>
                  </div>
                  {/* Score bar — only shown when something is selected */}
                  {anySelected && (
                    <div className="mt-1.5 h-1 bg-[#1e2240] rounded-full overflow-hidden w-full">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: i === 0 ? '#c89b3c' : i === 1 ? '#5b9bd5' : '#4a556a',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Score — only shown when something is selected */}
                {anySelected && (
                  <span className={`text-sm font-bold shrink-0 ${i === 0 ? 'text-[#c89b3c]' : 'text-[#64748b]'}`}>
                    {rec.score}
                  </span>
                )}

                <span className="text-[#64748b] text-xs shrink-0">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 bg-[#0d0f17]">
                  {rec.comp.description && (
                    <p className="text-xs text-[#94a3b8] leading-relaxed">{rec.comp.description}</p>
                  )}

                  {/* ── MAIN COMP ─────────────────────────────────────── */}
                  {rec.comp.coreUnits.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold text-[#c89b3c] uppercase tracking-wider mb-2 font-['Orbitron']">
                        Main Comp
                      </div>
                      <div className="bg-[#13162a] rounded-lg border border-[#1e2240] p-3">
                        <div className="flex flex-wrap gap-3">
                          {rec.comp.coreUnits.map(u => {
                            const have = rec.matchedUnits.includes(u)
                            const img = CHAMPION_IMAGES[u]
                            const isCarry = rec.comp.carries.includes(u)
                            const isTank = rec.comp.tank === u
                            const build = (rec.comp.unitBuilds ?? []).find(b => b.champion === u)
                            const coreItems: string[] = (build as any)?.coreItems ?? []
                            const flexItems: string[] = (build as any)?.flexItems ?? []

                            return (
                              <div key={u} className="flex flex-col items-center gap-1" title={u}>
                                <div className="relative">
                                  <div className={`w-11 h-11 rounded-md border-2 overflow-hidden transition-all ${
                                    have
                                      ? isCarry ? 'border-[#c89b3c] shadow-[0_0_8px_#c89b3c60]'
                                        : isTank ? 'border-[#5b9bd5] shadow-[0_0_6px_#5b9bd560]'
                                        : 'border-[#5db85a]'
                                      : 'border-[#2d3154] opacity-40'
                                  }`}>
                                    {img ? (
                                      <img src={img} alt={u} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-[#1e2240] flex items-center justify-center text-[8px] text-[#64748b]">{u.slice(0, 2)}</div>
                                    )}
                                  </div>
                                  {(isCarry || isTank) && (
                                    <div
                                      className="absolute -top-1 -right-1 text-[7px] font-black px-1 rounded leading-tight"
                                      style={{
                                        backgroundColor: isCarry ? '#78350f' : '#1e3a8a',
                                        color: isCarry ? '#fbbf24' : '#60a5fa',
                                      }}
                                    >
                                      {isCarry ? 'C' : 'T'}
                                    </div>
                                  )}
                                </div>

                                {/* Core items */}
                                {coreItems.length > 0 && (
                                  <div className="flex gap-0.5">
                                    {coreItems.map((item: string) => (
                                      <ItemIcon key={item} name={item} userComponents={selection.items} />
                                    ))}
                                  </div>
                                )}

                                {/* Flex items — shown below core, dashed/muted */}
                                {flexItems.length > 0 && (
                                  <div className="flex gap-0.5">
                                    {flexItems.map((item: string) => (
                                      <ItemIcon key={item} name={item} userComponents={selection.items} isFlex />
                                    ))}
                                  </div>
                                )}

                                <span className={`text-[8px] leading-none ${have ? (isCarry ? 'text-[#c89b3c]' : isTank ? 'text-[#5b9bd5]' : 'text-[#5db85a]') : 'text-[#4a556a]'}`}>
                                  {u.split(' ')[0]}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── FLEX OPTIONS ──────────────────────────────────── */}
                  {rec.comp.flexUnits.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-[10px] font-semibold text-[#a78bfa] uppercase tracking-wider font-['Orbitron']">
                          Flex Slots
                        </div>
                        <div className="flex-1 border-t border-dashed border-[#a78bfa]/20" />
                        <span className="text-[9px] text-[#64748b]">swap any of these in</span>
                      </div>
                      <div className="bg-[#0f0d1a] rounded-lg border border-dashed border-[#a78bfa]/30 p-3">
                        <div className="flex flex-wrap gap-2">
                          {rec.comp.flexUnits.map(u => {
                            const have = rec.matchedUnits.includes(u)
                            const img = CHAMPION_IMAGES[u]
                            const build = (rec.comp.unitBuilds ?? []).find(b => b.champion === u)
                            const coreItems: string[] = (build as any)?.coreItems ?? []
                            const flexItems: string[] = (build as any)?.flexItems ?? []
                            return (
                              <div key={u} className="flex flex-col items-center gap-1" title={u}>
                                <div className={`w-10 h-10 rounded-md border-2 border-dashed overflow-hidden ${have ? 'border-[#a78bfa] opacity-100' : 'border-[#3b0764]/60 opacity-50'}`}>
                                  {img ? (
                                    <img src={img} alt={u} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-[#1e1040] flex items-center justify-center text-[8px] text-[#a78bfa]">{u.slice(0, 2)}</div>
                                  )}
                                </div>
                                {coreItems.length > 0 && (
                                  <div className="flex gap-0.5">
                                    {coreItems.map((item: string) => (
                                      <ItemIcon key={item} name={item} userComponents={selection.items} isFlex />
                                    ))}
                                  </div>
                                )}
                                {flexItems.length > 0 && (
                                  <div className="flex gap-0.5">
                                    {flexItems.map((item: string) => (
                                      <ItemIcon key={item} name={item} userComponents={selection.items} isFlex />
                                    ))}
                                  </div>
                                )}
                                <span className={`text-[8px] leading-none ${have ? 'text-[#a78bfa]' : 'text-[#4a556a]'}`}>
                                  {u.split(' ')[0]}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── EARLY GAME ────────────────────────────────────── */}
                  {rec.comp.earlyGame.length > 0 && (
                    <div className="pt-1 border-t-2 border-dashed border-[#1e2240]">
                      <div className="flex items-center gap-2 mb-2 mt-3">
                        <div className="text-[10px] font-semibold text-[#86efac] uppercase tracking-wider font-['Orbitron']">
                          Early Game
                        </div>
                        <div className="flex-1 border-t border-[#86efac]/20" />
                      </div>
                      <div className="bg-[#0a1510] rounded-lg border border-[#86efac]/20 p-3">
                        <div className="flex flex-wrap gap-2">
                          {rec.comp.earlyGame.map(u => {
                            const have = rec.matchedEarlyUnits.includes(u)
                            const img = CHAMPION_IMAGES[u]
                            return (
                              <div key={u} className="flex flex-col items-center gap-1" title={u}>
                                <div className={`w-9 h-9 rounded border-2 overflow-hidden ${have ? 'border-[#86efac]' : 'border-[#1e2240] opacity-40'}`}>
                                  {img ? (
                                    <img src={img} alt={u} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-[#0d2010] flex items-center justify-center text-[8px] text-[#86efac]">{u.slice(0, 2)}</div>
                                  )}
                                </div>
                                <span className={`text-[8px] leading-none ${have ? 'text-[#86efac]' : 'text-[#4a556a]'}`}>
                                  {u.split(' ')[0]}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── GOD BOONS ─────────────────────────────────────── */}
                  {(rec.comp.recommendedGodBoons ?? []).length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] text-[#64748b] uppercase tracking-wider font-['Orbitron'] shrink-0">God Boon</span>
                      {(rec.comp.recommendedGodBoons ?? []).map(boonId => {
                        const boon = GOD_BOONS.find(b => b.id === boonId)
                        if (!boon) return null
                        const matched = selection.godBoon === boonId
                        return (
                          <div
                            key={boonId}
                            className="flex items-center gap-1 px-2 py-0.5 rounded border"
                            style={{
                              borderColor: matched ? '#a78bfa60' : '#1e2240',
                              backgroundColor: matched ? '#a78bfa15' : 'transparent',
                            }}
                          >
                            <span className={`text-[10px] font-semibold ${matched ? 'text-[#a78bfa]' : 'text-[#64748b]'}`}>
                              {boon.champion}
                            </span>
                            {matched && <span className="text-[9px] text-[#a78bfa]">✓</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Source link */}
                  {rec.comp.link && (
                    <a
                      href={rec.comp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-[#64748b] hover:text-[#94a3b8] transition-colors"
                    >
                      <span>↗</span>
                      <span>Source</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
