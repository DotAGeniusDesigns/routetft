import React, { useState, useMemo } from 'react'
import { TFTItem } from '../types/tft'

interface Props {
  items: TFTItem[]
  selectedItems: string[]
  onToggle: (name: string) => void
  combinedCatalog: TFTItem[]
  selectedCombined: string[]
  onToggleCombined: (name: string) => void
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

export default function ItemPanel({
  items,
  selectedItems,
  onToggle,
  combinedCatalog,
  selectedCombined,
  onToggleCombined,
}: Props) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [combinedSearch, setCombinedSearch] = useState('')

  const compCounts = selectedItems.reduce<Record<string, number>>((acc, name) => {
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})

  const combinedCounts = selectedCombined.reduce<Record<string, number>>((acc, name) => {
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})

  const filteredCombined = useMemo(() => {
    const q = combinedSearch.trim().toLowerCase()
    if (!q) return combinedCatalog
    return combinedCatalog.filter(i => i.name.toLowerCase().includes(q))
  }, [combinedCatalog, combinedSearch])

  const handleImgError = (name: string) => {
    setImgErrors(prev => ({ ...prev, [name]: true }))
  }

  const totalPicks = selectedItems.length + selectedCombined.length

  return (
    <div className="panel flex flex-col h-full min-h-0">
      <div className="panel-header py-2">
        <span className="text-[#c89b3c] font-semibold font-['Orbitron'] text-xs tracking-wide">ITEMS</span>
        <span className="ml-auto text-[10px] text-[#94a3b8]">{totalPicks} selected</span>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Components — compact */}
        <div className="shrink-0 px-2.5 pt-2 pb-2 border-b border-[#1e2240]">
          <div className="text-[8px] text-[#64748b] uppercase tracking-wider mb-1.5">Components</div>
          <p className="text-[8px] text-[#4a556a] mb-1.5 leading-snug">
            Click to add. Duplicates stack.
          </p>
          <div className="grid grid-cols-4 gap-1 max-h-[min(40vh,220px)] overflow-y-auto pr-0.5">
            {items.map(item => {
              const count = compCounts[item.name] || 0
              const color = ITEM_COLORS[item.name] || '#c89b3c'
              const hasImg = item.imageUrl && !imgErrors[item.name]
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.name)}
                  className="flex flex-col items-center gap-0.5 p-1 rounded-md border transition-all duration-150 cursor-pointer group"
                  style={{
                    borderColor: count > 0 ? `${color}55` : '#1e2240',
                    backgroundColor: count > 0 ? `${color}10` : '#0d0f17',
                  }}
                >
                  <div className="relative">
                    {hasImg ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-7 h-7 rounded object-cover"
                        onError={() => handleImgError(item.name)}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center text-[8px] font-bold"
                        style={{ backgroundColor: `${color}28`, border: `1px solid ${color}55`, color }}
                      >
                        {item.name.slice(0, 2)}
                      </div>
                    )}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#c89b3c] text-[#0d0f17] text-[8px] font-bold flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[7px] text-center leading-[1.05] line-clamp-2 ${
                      count > 0 ? 'text-[#cbd5e1]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Full combined items */}
        <div className="flex-1 flex flex-col min-h-0 px-2.5 pt-2 pb-2">
          <div className="text-[8px] text-[#64748b] uppercase tracking-wider mb-1">Full items</div>
          <p className="text-[8px] text-[#4a556a] mb-1.5 leading-snug">
            Already-built items score higher than the same two components.
          </p>
          <input
            type="text"
            value={combinedSearch}
            onChange={e => setCombinedSearch(e.target.value)}
            placeholder="Filter…"
            className="w-full mb-1.5 text-[10px] bg-[#0d0f17] border border-[#1e2240] text-[#e2e8f0] rounded px-2 py-1 focus:outline-none focus:border-[#c89b3c]/40 placeholder-[#4a556a]"
          />
          <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
            <div className="grid grid-cols-3 gap-1">
              {filteredCombined.map(item => {
                const count = combinedCounts[item.name] || 0
                const hasImg = item.imageUrl && !imgErrors[`c-${item.name}`]
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggleCombined(item.name)}
                    className={`flex flex-col items-center gap-0.5 p-1 rounded-md border transition-all ${
                      count > 0
                        ? 'border-[#c89b3c]/50 bg-[#c89b3c]/10'
                        : 'border-[#1e2240] bg-[#0d0f17] hover:border-[#2d3154]'
                    }`}
                  >
                    <div className="relative">
                      {hasImg ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover"
                          onError={() => handleImgError(`c-${item.name}`)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-[#1e2240] flex items-center justify-center text-[7px] text-[#c89b3c] font-bold px-0.5 text-center leading-none">
                          {item.name.slice(0, 3)}
                        </div>
                      )}
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#c89b3c] text-[#0d0f17] text-[8px] font-bold flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </div>
                    <span className="text-[7px] text-center leading-[1.05] line-clamp-2 text-[#94a3b8]">
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected summary */}
        {totalPicks > 0 && (
          <div className="shrink-0 px-2.5 pt-2 pb-2.5 border-t border-[#1e2240] max-h-28 overflow-y-auto">
            <div className="text-[8px] text-[#64748b] mb-1">Selected (click × to remove last)</div>
            {selectedItems.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {selectedItems.map((name, i) => (
                  <button
                    key={`co-${name}-${i}`}
                    onClick={() => onToggle(`__remove__${name}`)}
                    className="chip bg-[#1e2240] text-[#94a3b8] border border-[#2d3154] hover:border-red-500/50 hover:text-red-400 transition-colors text-[9px] py-0.5"
                  >
                    <span className="opacity-50 mr-0.5">C</span>
                    {name} ×
                  </button>
                ))}
              </div>
            )}
            {selectedCombined.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedCombined.map((name, i) => (
                  <button
                    key={`cb-${name}-${i}`}
                    onClick={() => onToggleCombined(`__remove__${name}`)}
                    className="chip bg-[#1a1520] text-[#c89b3c] border border-[#c89b3c]/25 hover:border-red-500/50 hover:text-red-400 transition-colors text-[9px] py-0.5"
                  >
                    <span className="opacity-50 mr-0.5">★</span>
                    {name} ×
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
