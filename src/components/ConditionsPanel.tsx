import React from 'react'
import {
  CONDITION_CATEGORY_LABEL,
  ConditionCategory,
  conditionsInCategory,
  Condition,
} from '../data/conditions'

interface Props {
  selected: string[]
  onToggle: (id: string) => void
  onClear: () => void
}

function ConditionChips({
  items,
  selected,
  onToggle,
  chipLabel,
}: {
  items: Condition[]
  selected: string[]
  onToggle: (id: string) => void
  chipLabel: (c: Condition) => string
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map(c => {
        const isOn = selected.includes(c.id)
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-all max-w-full truncate"
            style={{
              borderColor: isOn ? '#a78bfa' : '#1e2240',
              backgroundColor: isOn ? '#a78bfa20' : '#13162a',
              color: isOn ? '#a78bfa' : '#64748b',
              opacity: selected.length > 0 && !isOn ? 0.45 : 1,
              boxShadow: isOn ? '0 0 6px #a78bfa40' : 'none',
            }}
            title={c.label}
          >
            {chipLabel(c)}
          </button>
        )
      })}
    </div>
  )
}

const SECTION_ORDER: ConditionCategory[] = [
  'god_boon',
  'stargazer_constellation',
  'psionic_item',
]

export default function ConditionsPanel({ selected, onToggle, onClear }: Props) {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-semibold text-[#a78bfa] uppercase tracking-wider font-['Orbitron']">
          Conditions
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[9px] text-[#4a556a] hover:text-[#94a3b8] transition-colors ml-auto shrink-0"
          >
            clear
          </button>
        )}
      </div>
      <p className="text-[9px] text-[#4a556a] mb-2 leading-snug">
        God boons, your Stargazer constellation, and Psionic items you have access to.
      </p>
      <div className="space-y-2.5">
        {SECTION_ORDER.map(cat => {
          const items = conditionsInCategory(cat)
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <div className="text-[9px] text-[#64748b] uppercase tracking-wider font-['Orbitron'] mb-1">
                {CONDITION_CATEGORY_LABEL[cat]}
              </div>
              <ConditionChips
                items={items}
                selected={selected}
                onToggle={onToggle}
                chipLabel={c =>
                  c.category === 'god_boon' && c.championPortrait ? c.championPortrait : c.label
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
