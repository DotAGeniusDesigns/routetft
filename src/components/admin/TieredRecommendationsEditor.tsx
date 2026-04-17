import React, { useState, useEffect, useMemo } from 'react'
import { TieredIdBuckets, CompPowerTier } from '../../types/tft'
import { AUGMENTS } from '../../data/augments'
import { ARTIFACT_ITEMS } from '../../data/artifactItems'
import { POWER_TIER_ORDER, removeKeyFromTiers } from '../../utils/tieredMeta'

type PoolMode = 'augment' | 'artifact'

const TIER_STYLES: Record<CompPowerTier, { label: string; accent: string; border: string }> = {
  base: { label: 'Base', accent: '#94a3b8', border: '#47556960' },
  good: { label: 'Good', accent: '#5db85a', border: '#5db85a45' },
  great: { label: 'Great', accent: '#5b9bd5', border: '#5b9bd545' },
  op: { label: 'OP', accent: '#ffb938', border: '#ffb93850' },
}

type DragPayload = { key: string }

function cloneTiers(t: TieredIdBuckets): TieredIdBuckets {
  return {
    base: [...(t.base ?? [])],
    good: [...(t.good ?? [])],
    great: [...(t.great ?? [])],
    op: [...(t.op ?? [])],
  }
}

function normalizeTiers(t: TieredIdBuckets): TieredIdBuckets {
  const out = cloneTiers(t)
  const seen = new Set<string>()
  for (const tier of POWER_TIER_ORDER) {
    out[tier] = (out[tier] ?? [])
      .map(k => k.trim())
      .filter(Boolean)
      .filter(k => {
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
  }
  return out
}

function parseDrag(e: React.DragEvent): DragPayload | null {
  try {
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return null
    return JSON.parse(raw) as DragPayload
  } catch {
    return null
  }
}

interface Props {
  title: string
  mode: PoolMode
  tiers: TieredIdBuckets
  onChange: (next: TieredIdBuckets) => void
  resetKey: string
}

export default function TieredRecommendationsEditor({
  title,
  mode,
  tiers,
  onChange,
  resetKey,
}: Props) {
  const [staging, setStaging] = useState<string[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setStaging([])
    setSearch('')
  }, [resetKey])

  const occupied = useMemo(() => {
    const s = new Set<string>()
    POWER_TIER_ORDER.forEach(t => tiers[t].forEach(k => s.add(k.trim())))
    staging.forEach(k => s.add(k.trim()))
    return s
  }, [tiers, staging])

  const searchHits = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    if (mode === 'augment') {
      return AUGMENTS.filter(a => a.name.toLowerCase().includes(q)).slice(0, 12)
    }
    return ARTIFACT_ITEMS.filter(a => a.name.toLowerCase().includes(q)).slice(0, 12)
  }, [search, mode])

  const labelFor = (key: string) =>
    mode === 'augment'
      ? AUGMENTS.find(a => a.id === key.trim())?.name ?? key
      : key

  const removeEverywhere = (key: string) => {
    const normalizedKey = key.trim()
    setStaging(s => s.filter(k => k.trim() !== normalizedKey))
    onChange(removeKeyFromTiers(normalizeTiers(tiers), normalizedKey))
  }

  const assignKey = (key: string, target: 'staging' | CompPowerTier) => {
    const normalizedKey = key.trim()
    const nextStaging = staging.filter(k => k.trim() !== normalizedKey)
    let nextTiers = removeKeyFromTiers(normalizeTiers(tiers), normalizedKey)

    if (target === 'staging') {
      if (!nextStaging.includes(normalizedKey)) nextStaging.push(normalizedKey)
      setStaging(nextStaging)
      onChange(nextTiers)
      return
    }

    if (!nextTiers[target].includes(normalizedKey)) nextTiers[target].push(normalizedKey)
    setStaging(nextStaging)
    onChange(nextTiers)
  }

  const handleDragStart = (e: React.DragEvent, key: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ key } satisfies DragPayload))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, target: 'staging' | CompPowerTier) => {
    e.preventDefault()
    const p = parseDrag(e)
    if (!p) return
    assignKey(p.key, target)
  }

  function Pill({ k, tierAccent }: { k: string; tierAccent?: string }) {
    const accent = tierAccent ?? '#94a3b8'
    return (
      <div
        draggable
        onDragStart={e => handleDragStart(e, k)}
        className="flex items-center gap-0.5 pl-1.5 pr-0.5 py-0.5 rounded border text-[10px] cursor-grab active:cursor-grabbing max-w-[160px]"
        style={{
          borderColor: `${accent}55`,
          backgroundColor: `${accent}14`,
          color: '#e2e8f0',
        }}
        title={labelFor(k)}
      >
        <span className="truncate">{labelFor(k)}</span>
        <button
          type="button"
          draggable={false}
          onMouseDown={e => {
            // Prevent parent draggable chip from swallowing remove clicks.
            e.preventDefault()
            e.stopPropagation()
          }}
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            removeEverywhere(k)
          }}
          className="shrink-0 text-[#64748b] hover:text-red-400 px-0.5 text-[11px] leading-none"
        >
          ×
        </button>
      </div>
    )
  }

  const tryAddFromSearch = (key: string) => {
    const normalizedKey = key.trim()
    if (occupied.has(normalizedKey)) return
    assignKey(normalizedKey, 'staging')
    setSearch('')
  }

  return (
    <div className="p-4 rounded-lg border border-[#1e2240] bg-[#0d0f17] space-y-3">
      <div className="text-[10px] font-semibold text-[#c89b3c] uppercase tracking-wider font-['Orbitron']">
        {title}
      </div>
      <p className="text-[9px] text-[#64748b]">
        Search to add to the pool, then drag into Base → OP. Drag between areas anytime; × removes completely.
      </p>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={mode === 'augment' ? 'Search augments…' : 'Search artifacts…'}
          className="w-full bg-[#0d0f17] border border-[#2d3154] text-[#e2e8f0] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#c89b3c]/60 placeholder-[#4a556a]"
        />
        {searchHits.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-0.5 bg-[#13162a] border border-[#2d3154] rounded-lg overflow-hidden shadow-xl max-h-40 overflow-y-auto">
            {searchHits.map(hit => {
              const key = mode === 'augment' ? (hit as { id: string }).id : (hit as { name: string }).name
              const dis = occupied.has(key)
              return (
                <button
                  key={key}
                  type="button"
                  disabled={dis}
                  onClick={() => tryAddFromSearch(key)}
                  className={`w-full text-left px-2.5 py-1.5 text-[11px] ${dis ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#1e2240] text-[#94a3b8]'}`}
                >
                  {mode === 'augment' ? (hit as { name: string }).name : key}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={e => handleDrop(e, 'staging')}
        className="min-h-[40px] rounded-lg border border-dashed border-[#2d3154] bg-[#0a0c14] px-2 py-1.5 flex flex-wrap gap-1 items-center"
      >
        <span className="text-[8px] uppercase tracking-wider text-[#4a556a] w-full">Pool</span>
        {staging.map(k => (
          <Pill key={`st-${k}`} k={k} />
        ))}
        {staging.length === 0 && (
          <span className="text-[9px] text-[#4a556a]">Drop here or add from search</span>
        )}
      </div>

      {POWER_TIER_ORDER.map(tier => {
        const st = TIER_STYLES[tier]
        return (
          <div
            key={tier}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, tier)}
            className="rounded-lg border px-2 py-1.5 space-y-1"
            style={{ borderColor: st.border, backgroundColor: '#13162a80' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold" style={{ color: st.accent }}>
                {st.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {tiers[tier].map(k => (
                <Pill key={`${tier}-${k}`} k={k} tierAccent={st.accent} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
