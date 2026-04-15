import React, { useState } from 'react'
import { Champion } from '../types/tft'
import { CHAMPION_IMAGES } from '../data/championImages'

interface Props {
  champions: Champion[]
  selectedUnits: string[]
  onToggle: (name: string) => void
}

const COST_BORDER: Record<number, string> = {
  1: 'border-[#aaa]',
  2: 'border-[#5db85a]',
  3: 'border-[#5b9bd5]',
  4: 'border-[#b070e8]',
  5: 'border-[#ffb938]',
}

const COST_GLOW: Record<number, string> = {
  1: 'shadow-[0_0_6px_rgba(170,170,170,0.5)]',
  2: 'shadow-[0_0_6px_rgba(93,184,90,0.6)]',
  3: 'shadow-[0_0_6px_rgba(91,155,213,0.6)]',
  4: 'shadow-[0_0_6px_rgba(176,112,232,0.6)]',
  5: 'shadow-[0_0_6px_rgba(255,185,56,0.7)]',
}

const COST_COLORS: Record<number, string> = {
  1: 'text-[#aaa]',
  2: 'text-[#5db85a]',
  3: 'text-[#5b9bd5]',
  4: 'text-[#b070e8]',
  5: 'text-[#ffb938]',
}

const COST_BG: Record<number, string> = {
  1: 'cost-1',
  2: 'cost-2',
  3: 'cost-3',
  4: 'cost-4',
  5: 'cost-5',
}

export default function UnitPanel({ champions, selectedUnits, onToggle }: Props) {
  const [filter, setFilter] = useState<number | null>(null)
  const [traitFilter, setTraitFilter] = useState<string>('')

  const allTraits = Array.from(new Set(champions.flatMap(c => c.traits))).sort()

  const filtered = champions.filter(c => {
    if (filter !== null && c.cost !== filter) return false
    if (traitFilter && !c.traits.includes(traitFilter)) return false
    return true
  })

  const byCost = [1, 2, 3, 4, 5].map(cost => ({
    cost,
    units: filtered.filter(c => c.cost === cost),
  }))

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="text-[#c89b3c] font-semibold font-['Orbitron'] text-sm tracking-wide">UNITS</span>
        <span className="ml-auto text-xs text-[#94a3b8]">{selectedUnits.length} held</span>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 flex gap-1.5 flex-wrap border-b border-[#1e2240]">
        <button
          onClick={() => setFilter(null)}
          className={`chip ${filter === null ? 'bg-[#c89b3c]/20 text-[#c89b3c] border border-[#c89b3c]/40' : 'bg-[#1e2240] text-[#94a3b8] border border-transparent hover:text-white'}`}
        >
          All
        </button>
        {[1, 2, 3, 4, 5].map(cost => (
          <button
            key={cost}
            onClick={() => setFilter(filter === cost ? null : cost)}
            className={`chip ${COST_BG[cost]} ${filter === cost ? 'ring-1 ring-current' : 'opacity-70 hover:opacity-100'}`}
          >
            ${cost}
          </button>
        ))}
        <select
          value={traitFilter}
          onChange={e => setTraitFilter(e.target.value)}
          className="ml-auto text-xs bg-[#1e2240] border border-[#2d3154] text-[#94a3b8] rounded px-2 py-0.5 focus:outline-none focus:border-[#c89b3c]/50"
        >
          <option value="">All traits</option>
          {allTraits.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Unit grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {byCost.map(({ cost, units }) =>
          units.length === 0 ? null : (
            <div key={cost}>
              <div className={`text-xs font-semibold mb-1.5 ${COST_COLORS[cost]}`}>
                Cost {cost}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {units.map(champion => {
                  const selected = selectedUnits.includes(champion.name)
                  const imgUrl = CHAMPION_IMAGES[champion.name]
                  return (
                    <button
                      key={champion.id}
                      onClick={() => onToggle(champion.name)}
                      title={`${champion.name} — ${champion.traits.join(', ')}`}
                      className={`relative flex flex-col items-center rounded overflow-hidden border-2 transition-all duration-150 cursor-pointer ${
                        COST_BORDER[champion.cost]
                      } ${
                        selected
                          ? `opacity-100 ${COST_GLOW[champion.cost]}`
                          : 'opacity-50 hover:opacity-80 border-opacity-40'
                      }`}
                    >
                      {/* Portrait image */}
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={champion.name}
                          className="w-full aspect-square object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full aspect-square flex items-center justify-center ${COST_BG[champion.cost]}`}>
                          <span className="text-[10px] font-bold text-white">
                            {champion.name.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      {/* Name label */}
                      <div
                        className="w-full text-center py-0.5 px-0.5"
                        style={{ backgroundColor: 'rgba(13,15,23,0.85)' }}
                      >
                        <span className={`text-[9px] leading-tight truncate block ${selected ? 'text-[#c89b3c]' : 'text-[#94a3b8]'}`}>
                          {champion.name.split(' ')[0]}
                        </span>
                      </div>
                      {/* Selected checkmark */}
                      {selected && (
                        <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#c89b3c] flex items-center justify-center">
                          <span className="text-[#0d0f17] text-[8px] font-bold leading-none">✓</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
