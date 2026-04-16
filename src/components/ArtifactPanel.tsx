import React, { useState, useMemo } from 'react'
import { ARTIFACT_ITEMS } from '../data/artifactItems'

interface Props {
  selectedArtifacts: string[]
  onToggle: (name: string) => void
}

export default function ArtifactPanel({ selectedArtifacts, onToggle }: Props) {
  const [search, setSearch] = useState('')

  const results = useMemo(() => {
    if (!search.trim()) return []
    return ARTIFACT_ITEMS.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8)
  }, [search])

  const selectedRows = useMemo(() => {
    const m = new Map(ARTIFACT_ITEMS.map(a => [a.name, a]))
    return selectedArtifacts.map(n => m.get(n)).filter(Boolean) as typeof ARTIFACT_ITEMS
  }, [selectedArtifacts])

  return (
    <div className="border-t border-[#1e2240] px-3 py-2 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[#a78bfa] font-semibold font-['Orbitron'] text-xs tracking-wide">ARTIFACTS</span>
        {selectedArtifacts.length > 0 && (
          <span className="text-xs text-[#94a3b8]">{selectedArtifacts.length} selected</span>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search artifacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs bg-[#0d0f17] border border-[#1e2240] text-[#e2e8f0] rounded px-2 py-1.5 focus:outline-none focus:border-[#a78bfa]/40 placeholder-[#4a556a]"
        />
        {results.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 mt-0.5 bg-[#13162a] border border-[#1e2240] rounded shadow-xl overflow-hidden">
            {results.map(a => {
              const selected = selectedArtifacts.includes(a.name)
              return (
                <button
                  key={a.name}
                  onClick={() => { onToggle(a.name); setSearch('') }}
                  className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-[#1e2240] transition-colors ${selected ? 'opacity-50' : ''}`}
                >
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt="" className="w-6 h-6 rounded shrink-0 object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-[#1e2240] shrink-0" />
                  )}
                  <span className="text-xs text-[#e2e8f0] truncate">{a.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedRows.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedRows.map(a => (
            <button
              key={a.name}
              onClick={() => onToggle(a.name)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#1e2240] text-[#a78bfa] border border-[#2d3154] hover:border-red-500/50 hover:text-red-400 transition-colors max-w-full"
            >
              {a.imageUrl ? (
                <img src={a.imageUrl} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
              ) : null}
              <span className="truncate">{a.name}</span>
              <span>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
