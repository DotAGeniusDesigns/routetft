import React from 'react'
import { GOD_BOONS } from '../data/godBoons'

interface Props {
  selected: string | null
  onSelect: (id: string | null) => void
}

export default function GodBoonPanel({ selected, onSelect }: Props) {
  return (
    <div className="border-b border-[#1e2240] px-3 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-semibold text-[#a78bfa] uppercase tracking-wider font-['Orbitron']">
          God Boon
        </span>
        {selected && (
          <button
            onClick={() => onSelect(null)}
            className="text-[9px] text-[#4a556a] hover:text-[#94a3b8] transition-colors ml-auto shrink-0"
          >
            clear
          </button>
        )}
      </div>
      <div className="flex gap-1 flex-wrap">
        {GOD_BOONS.map(boon => {
          const isSelected = selected === boon.id
          return (
            <button
              key={boon.id}
              onClick={() => onSelect(isSelected ? null : boon.id)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-all"
              style={{
                borderColor: isSelected ? '#a78bfa' : '#1e2240',
                backgroundColor: isSelected ? '#a78bfa20' : '#13162a',
                color: isSelected ? '#a78bfa' : '#64748b',
                opacity: !isSelected && selected ? 0.45 : 1,
                boxShadow: isSelected ? '0 0 6px #a78bfa40' : 'none',
              }}
            >
              {boon.champion}
            </button>
          )
        })}
      </div>
    </div>
  )
}
