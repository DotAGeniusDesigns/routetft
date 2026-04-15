import React, { useState, useMemo } from 'react'
import { TFTAugment } from '../types/tft'

interface Props {
  augments: TFTAugment[]
  selectedAugments: string[]
  onToggle: (id: string) => void
}

const TIER_DOT: Record<string, string> = {
  Prismatic: 'bg-[#b070e8]',
  Gold: 'bg-[#ffb938]',
  Silver: 'bg-[#94a3b8]',
}

export default function AugmentPanel({ augments, selectedAugments, onToggle }: Props) {
  const [search, setSearch] = useState('')

  const results = useMemo(() => {
    if (!search.trim()) return []
    return augments
      .filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8)
  }, [augments, search])

  const selectedAugmentObjects = useMemo(
    () => augments.filter(a => selectedAugments.includes(a.id)),
    [augments, selectedAugments]
  )

  return (
    <div className="border-t border-[#1e2240] px-3 py-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[#c89b3c] font-semibold font-['Orbitron'] text-xs tracking-wide">AUGMENTS</span>
        {selectedAugments.length > 0 && (
          <span className="text-xs text-[#94a3b8]">{selectedAugments.length} selected</span>
        )}
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search augments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs bg-[#0d0f17] border border-[#1e2240] text-[#e2e8f0] rounded px-2 py-1.5 focus:outline-none focus:border-[#c89b3c]/40 placeholder-[#4a556a]"
        />

        {/* Dropdown results */}
        {results.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 mt-0.5 bg-[#13162a] border border-[#1e2240] rounded shadow-xl overflow-hidden">
            {results.map(aug => {
              const selected = selectedAugments.includes(aug.id)
              return (
                <button
                  key={aug.id}
                  onClick={() => { onToggle(aug.id); setSearch('') }}
                  className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-[#1e2240] transition-colors ${selected ? 'opacity-50' : ''}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${TIER_DOT[aug.tier] ?? 'bg-[#64748b]'}`} />
                  <span className="text-xs text-[#e2e8f0] truncate">{aug.name}</span>
                  <span className="ml-auto text-[9px] text-[#64748b] shrink-0">{aug.tier}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected augment chips */}
      {selectedAugmentObjects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedAugmentObjects.map(aug => (
            <button
              key={aug.id}
              onClick={() => onToggle(aug.id)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#1e2240] text-[#94a3b8] border border-[#2d3154] hover:border-red-500/50 hover:text-red-400 transition-colors"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[aug.tier] ?? 'bg-[#64748b]'}`} />
              {aug.name} ×
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
