import React, { useMemo, useState } from 'react'
import { EMBLEM_TRAIT_NAMES } from '../data/emblemTraits'

interface Props {
  selectedEmblems: string[]
  onToggle: (traitName: string) => void
}

export default function EmblemPanel({ selectedEmblems, onToggle }: Props) {
  const [search, setSearch] = useState('')

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return EMBLEM_TRAIT_NAMES.filter(t => t.toLowerCase().includes(q)).slice(0, 10)
  }, [search])

  return (
    <div className="px-3 py-2 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[#c89b3c] font-semibold font-['Orbitron'] text-xs tracking-wide">EMBLEMS</span>
        {selectedEmblems.length > 0 && (
          <span className="text-xs text-[#94a3b8]">{selectedEmblems.length} selected</span>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search trait emblems…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs bg-[#0d0f17] border border-[#1e2240] text-[#e2e8f0] rounded px-2 py-1.5 focus:outline-none focus:border-[#c89b3c]/40 placeholder-[#4a556a]"
        />
        {results.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 mt-0.5 bg-[#13162a] border border-[#1e2240] rounded shadow-xl overflow-hidden">
            {results.map(t => {
              const selected = selectedEmblems.includes(t)
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onToggle(t)
                    setSearch('')
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs text-[#e2e8f0] hover:bg-[#1e2240] transition-colors ${selected ? 'opacity-50' : ''}`}
                >
                  {t} Emblem
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedEmblems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedEmblems.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => onToggle(t)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#1e2240] text-[#c89b3c] border border-[#2d3154] hover:border-red-500/50 hover:text-red-400 transition-colors max-w-full"
            >
              <span className="truncate">{t}</span>
              <span>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
