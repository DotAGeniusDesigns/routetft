import React, { useState } from 'react'
import { TFTItem } from '../types/tft'

interface Props {
  items: TFTItem[]
  selectedItems: string[]
  onToggle: (name: string) => void
}

const ITEM_COLORS: Record<string, string> = {
  'B.F. Sword': '#e74c3c',
  'Recurve Bow': '#2ecc71',
  'Needlessly Large Rod': '#9b59b6',
  'Tear of the Goddess': '#3498db',
  'Chain Vest': '#e67e22',
  'Negatron Cloak': '#1abc9c',
  "Giant's Belt": '#e91e63',
  'Sparring Gloves': '#f39c12',
  'Spatula': '#c89b3c',
}

export default function ItemPanel({ items, selectedItems, onToggle }: Props) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const counts = selectedItems.reduce<Record<string, number>>((acc, name) => {
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})

  const handleImgError = (name: string) => {
    setImgErrors(prev => ({ ...prev, [name]: true }))
  }

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="text-[#c89b3c] font-semibold font-['Orbitron'] text-sm tracking-wide">COMPONENTS</span>
        <span className="ml-auto text-xs text-[#94a3b8]">{selectedItems.length} selected</span>
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <p className="text-xs text-[#64748b] mb-3">
          Click to add components you have. Click again to add duplicates.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {items.map(item => {
            const count = counts[item.name] || 0
            const color = ITEM_COLORS[item.name] || '#c89b3c'
            const hasImg = item.imageUrl && !imgErrors[item.name]
            return (
              <button
                key={item.id}
                onClick={() => onToggle(item.name)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-150 cursor-pointer group"
                style={{
                  borderColor: count > 0 ? `${color}60` : '#1e2240',
                  backgroundColor: count > 0 ? `${color}12` : '#0d0f17',
                }}
              >
                {/* Image or fallback swatch */}
                <div className="relative">
                  {hasImg ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={() => handleImgError(item.name)}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-[11px] font-bold"
                      style={{ backgroundColor: `${color}30`, border: `1px solid ${color}60`, color }}
                    >
                      {item.name.slice(0, 2)}
                    </div>
                  )}
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#c89b3c] text-[#0d0f17] text-[10px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] text-center leading-tight ${count > 0 ? 'text-white' : 'text-[#64748b] group-hover:text-[#94a3b8]'}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Selected list with remove */}
        {selectedItems.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#1e2240]">
            <div className="text-xs text-[#64748b] mb-2">Selected (click to remove)</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedItems.map((name, i) => (
                <button
                  key={`${name}-${i}`}
                  onClick={() => onToggle(`__remove__${name}`)}
                  className="chip bg-[#1e2240] text-[#94a3b8] border border-[#2d3154] hover:border-red-500/50 hover:text-red-400 transition-colors"
                >
                  {name} ×
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
