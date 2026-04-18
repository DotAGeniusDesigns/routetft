import React, { useState, useMemo, useEffect } from 'react'
import { Champion, MetaComp, UnitItemBuild } from '../../types/tft'
import { CHAMPION_IMAGES } from '../../data/championImages'
import { COMPONENT_ITEMS, COMBINED_ITEMS } from '../../data/tftItems'
import { ARTIFACT_ITEMS as ARTIFACT_ITEM_DATA } from '../../data/artifactItems'

const ITEM_IMAGES: Record<string, string> = Object.fromEntries([
  ...[...COMPONENT_ITEMS, ...COMBINED_ITEMS].filter(i => i.imageUrl).map(i => [i.name, i.imageUrl as string]),
  ...ARTIFACT_ITEM_DATA.map(i => [i.name, i.imageUrl]),
])

// ─── Cost border colors ───────────────────────────────────────────────────────
const COST_BORDER: Record<number, string> = {
  1: '#6b7280',
  2: '#22c55e',
  3: '#3b82f6',
  4: '#a855f7',
  5: '#f59e0b',
}

const COST_BG: Record<number, string> = {
  1: '#374151',
  2: '#14532d',
  3: '#1e3a8a',
  4: '#581c87',
  5: '#78350f',
}

// ─── Role badge ───────────────────────────────────────────────────────────────
type Role = 'carry' | 'tank' | 'flex' | 'early'

const ROLE_STYLES: Record<Role, { label: string; color: string; bg: string }> = {
  carry:  { label: 'C',     color: '#fbbf24', bg: '#78350f' },
  tank:   { label: 'T',     color: '#60a5fa', bg: '#1e3a8a' },
  flex:   { label: 'FX',   color: '#a78bfa', bg: '#3b0764' },
  early:  { label: 'E',    color: '#86efac', bg: '#14532d' },
}

// ─── Champion portrait ────────────────────────────────────────────────────────
function ChampPortrait({
  champ,
  size = 56,
  role,
  selected,
  onClick,
  onRoleClick,
  dimmed = false,
}: {
  champ: Champion
  size?: number
  role?: Role
  selected?: boolean
  onClick?: () => void
  onRoleClick?: (role: Role | null) => void
  dimmed?: boolean
}) {
  const img = CHAMPION_IMAGES[champ.name] ?? ''
  const border = COST_BORDER[champ.cost]

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: size, height: size }}
      onClick={onClick}
      title={`${champ.name} (${champ.traits.join(', ')})`}
    >
      {/* Portrait */}
      <div
        className="w-full h-full rounded-md overflow-hidden transition-all duration-150"
        style={{
          border: `2px solid ${selected ? '#c89b3c' : border}`,
          opacity: dimmed ? 0.35 : 1,
          boxShadow: selected ? `0 0 8px ${border}80` : 'none',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={champ.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] text-center font-bold leading-tight px-0.5"
            style={{ backgroundColor: COST_BG[champ.cost], color: border }}
          >
            {champ.name.split(' ')[0]}
          </div>
        )}
      </div>

      {/* Cost pip */}
      <div
        className="absolute bottom-0 left-0 text-[9px] font-black px-1 rounded-tr"
        style={{ backgroundColor: COST_BG[champ.cost], color: border }}
      >
        {champ.cost}
      </div>

      {/* Role badge */}
      {role && (
        <div
          className="absolute top-0 right-0 text-[8px] font-black px-1 rounded-bl leading-tight"
          style={{ backgroundColor: ROLE_STYLES[role].bg, color: ROLE_STYLES[role].color }}
        >
          {ROLE_STYLES[role].label}
        </div>
      )}

      {/* Hover overlay for role assignment (only when selected) */}
      {selected && onRoleClick && (
        <div className="absolute inset-0 rounded-md bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5 flex-wrap p-0.5">
          {(['carry', 'tank', 'flex', 'early'] as Role[]).map(r => (
            <button
              key={r}
              onClick={e => { e.stopPropagation(); onRoleClick(r) }}
              className="text-[8px] font-bold px-1 py-0.5 rounded transition-colors"
              style={{
                backgroundColor: role === r ? ROLE_STYLES[r].bg : '#1e2240',
                color: ROLE_STYLES[r].color,
                border: `1px solid ${ROLE_STYLES[r].color}40`,
              }}
            >
              {ROLE_STYLES[r].label}
            </button>
          ))}
          <button
            onClick={e => { e.stopPropagation(); onRoleClick(null) }}
            className="text-[8px] font-bold px-1 py-0.5 rounded transition-colors"
            style={{
              backgroundColor: !role ? '#2d3154' : '#1e2240',
              color: !role ? '#e2e8f0' : '#64748b',
              border: `1px solid ${!role ? '#4a556a' : '#2d3154'}`,
            }}
          >
            —
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Item lists ───────────────────────────────────────────────────────────────

const STANDARD_ITEMS = [
  // AP
  "Rabadon's Deathcap", "Jeweled Gauntlet", "Blue Buff", "Archangel's Staff",
  "Ionic Spark", "Hextech Gunblade", "Crownguard", "Morellonomicon", "Adaptive Helm",
  // AD / AS
  "Infinity Edge", "Giant Slayer", "Last Whisper", "Bloodthirster", "Spear of Shojin",
  "Deathblade", "Sterak's Gage", "Edge of Night", "Titan's Resolve", "Guinsoo's Rageblade",
  "Void Staff", "Kraken's Fury", "Red Buff", "Hand of Justice", "Quicksilver", "Nashor's Tooth",
  // Tank
  "Warmog's Armor", "Gargoyle Stoneplate", "Bramble Vest", "Dragon's Claw", "Sunfire Cape",
  "Spirit Visage", "Protector's Vow", "Steadfast Heart", "Evenshroud", "Striker's Flail",
  "Thief's Gloves",
]

const ARTIFACT_ITEMS = ARTIFACT_ITEM_DATA.map(i => i.name)

const ANIMA_PSIONIC_ITEMS = [
  // Anima trait items
  "Anima Blessing", "Anima Core", "Anima Crown",
  // Psionic trait items
  "Biomatter Preserver", "Drone Uplink", "Malware Matrix", "Sympathetic Implant", "Target-Lock Optics",
  // Other special/radiant items
  "Radiant Infinity Edge", "Radiant Bloodthirster", "Radiant Warmog's", "Radiant Sunfire Cape",
  "Radiant Guinsoo's Rageblade", "Radiant Titan's Resolve", "Radiant Gargoyle Stoneplate",
]

// ─── Per-unit item panel ───────────────────────────────────────────────────────

function UnitItemPanel({
  champion, build, onUpdate, onClose,
}: {
  champion: Champion
  build: UnitItemBuild
  onUpdate: (b: UnitItemBuild) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState<'standard' | 'artifact' | 'special'>('standard')
  const [itemSearch, setItemSearch] = useState('')

  const itemList = tab === 'standard' ? STANDARD_ITEMS : tab === 'artifact' ? ARTIFACT_ITEMS : ANIMA_PSIONIC_ITEMS
  const filtered = itemList.filter(i => i.toLowerCase().includes(itemSearch.toLowerCase()))

  const toggle = (item: string, slot: 'coreItems' | 'flexItems') => {
    if (slot === 'coreItems') {
      // Core items allow duplicates — always add; remove via chip click
      onUpdate({ ...build, coreItems: [...build.coreItems, item] })
    } else {
      // Flex items toggle on/off (move from core if needed)
      const inFlex = build.flexItems.includes(item)
      if (inFlex) {
        onUpdate({ ...build, flexItems: build.flexItems.filter(x => x !== item) })
      } else {
        onUpdate({
          ...build,
          coreItems: build.coreItems.filter(x => x !== item),
          flexItems: [...build.flexItems, item],
        })
      }
    }
  }

  const removeCoreAt = (idx: number) =>
    onUpdate({ ...build, coreItems: build.coreItems.filter((_, i) => i !== idx) })

  const img = CHAMPION_IMAGES[champion.name]

  return (
    <div className="bg-[#0d0f17] border border-[#2d3154] rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-md border-2 overflow-hidden shrink-0" style={{ borderColor: COST_BORDER[champion.cost] }}>
          {img ? <img src={img} alt={champion.name} className="w-full h-full object-cover" /> : (
            <div className="w-full h-full flex items-center justify-center text-[9px]" style={{ backgroundColor: COST_BG[champion.cost], color: COST_BORDER[champion.cost] }}>{champion.name[0]}</div>
          )}
        </div>
        <span className="text-sm font-semibold text-white">{champion.name}</span>
        <button onClick={onClose} className="ml-auto text-[#64748b] hover:text-white text-xs px-2">✕</button>
      </div>

      {/* Selected items summary */}
      {(build.coreItems.length > 0 || build.flexItems.length > 0) && (
        <div className="space-y-1.5">
          {build.coreItems.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[9px] text-[#c89b3c] uppercase tracking-wider w-8 shrink-0">Core</span>
              {build.coreItems.map((item, idx) => (
                <div
                  key={idx}
                  title={`${item} (click to remove)`}
                  onClick={() => removeCoreAt(idx)}
                  className="relative w-6 h-6 rounded border border-[#c89b3c50] overflow-hidden bg-[#1e2240] cursor-pointer group/chip"
                >
                  {ITEM_IMAGES[item]
                    ? <img src={ITEM_IMAGES[item]} alt={item} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-[7px] text-[#c89b3c]">{item[0]}</div>
                  }
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/chip:opacity-100 flex items-center justify-center text-[8px] text-white font-bold transition-opacity">✕</div>
                </div>
              ))}
            </div>
          )}
          {build.flexItems.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[9px] text-[#a78bfa] uppercase tracking-wider w-8 shrink-0">Flex</span>
              {build.flexItems.map(item => (
                <div key={item} title={item} className="w-6 h-6 rounded border border-[#a78bfa50] overflow-hidden bg-[#1e2240]">
                  {ITEM_IMAGES[item]
                    ? <img src={ITEM_IMAGES[item]} alt={item} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-[7px] text-[#a78bfa]">{item[0]}</div>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Item type tabs */}
      <div className="flex gap-1 border-b border-[#1e2240] pb-2">
        {(['standard', 'artifact', 'special'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors capitalize ${tab === t ? 'bg-[#c89b3c] text-[#0d0f17]' : 'text-[#64748b] hover:text-white'}`}
          >
            {t === 'special' ? 'Anima/Psionic' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <input
          value={itemSearch}
          onChange={e => setItemSearch(e.target.value)}
          placeholder="Filter…"
          className="ml-auto bg-[#13162a] border border-[#2d3154] text-[#e2e8f0] rounded px-2 py-0.5 text-[10px] focus:outline-none w-24"
        />
      </div>

      {/* Item grid — click adds to core, shift-click adds to flex */}
      <div className="text-[9px] text-[#4a556a] mb-1">Click → Core &nbsp;|&nbsp; Shift+click → Flex</div>
      <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
        {filtered.map(item => {
          const isCore = build.coreItems.includes(item)
          const isFlex = build.flexItems.includes(item)
          const imgSrc = ITEM_IMAGES[item]
          return (
            <button
              key={item}
              onClick={e => toggle(item, e.shiftKey ? 'flexItems' : 'coreItems')}
              title={item}
              className="relative w-8 h-8 rounded border-2 overflow-hidden transition-all shrink-0"
              style={{
                borderColor: isCore ? '#c89b3c' : isFlex ? '#a78bfa' : '#2d3154',
                boxShadow: isCore ? '0 0 6px #c89b3c60' : isFlex ? '0 0 6px #a78bfa60' : 'none',
                opacity: !isCore && !isFlex ? 0.65 : 1,
              }}
            >
              {imgSrc
                ? <img src={imgSrc} alt={item} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[7px] font-bold"
                    style={{ backgroundColor: '#13162a', color: isCore ? '#c89b3c' : isFlex ? '#a78bfa' : '#64748b' }}>
                    {item.slice(0, 2)}
                  </div>
              }
            </button>
          )
        })}
      </div>
    </div>
  )
}

function unitRolesFromComp(comp: MetaComp): Record<string, Role> {
  const roles: Record<string, Role> = {}
  comp.carries.forEach(u => { roles[u] = 'carry' })
  if (comp.tank) roles[comp.tank] = 'tank'
  comp.earlyGame?.forEach(u => { if (!roles[u]) roles[u] = 'early' })
  comp.flexUnits?.forEach(u => { if (!roles[u]) roles[u] = 'flex' })
  return roles
}

// ─── Main TeamBuilder ─────────────────────────────────────────────────────────
interface TeamBuilderProps {
  champions: Champion[]
  comp: MetaComp
  onUpdate: (updated: Partial<MetaComp>) => void
}

export default function TeamBuilder({ champions, comp, onUpdate }: TeamBuilderProps) {
  const [costFilter, setCostFilter] = useState<number | null>(null)
  const [traitFilter, setTraitFilter] = useState('')
  const [search, setSearch] = useState('')

  // Local state for unit roles (must reset when switching comps — prior state keyed by champion name only)
  const [unitRoles, setUnitRoles] = useState<Record<string, Role>>(() => unitRolesFromComp(comp))

  // All selected units = core + flex + early
  const allSelected = useMemo(() => {
    const set = new Set([...(comp.coreUnits ?? []), ...(comp.flexUnits ?? []), ...(comp.earlyGame ?? [])])
    return Array.from(set)
  }, [comp.coreUnits, comp.flexUnits, comp.earlyGame])

  const allTraits = useMemo(() =>
    Array.from(new Set(champions.flatMap(c => c.traits))).sort(),
    [champions]
  )

  const filteredChamps = useMemo(() => {
    return champions.filter(c => {
      if (costFilter !== null && c.cost !== costFilter) return false
      if (traitFilter && !c.traits.includes(traitFilter)) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [champions, costFilter, traitFilter, search])

  // Active traits from selected units
  const activeTraits = useMemo(() => {
    const counts: Record<string, number> = {}
    allSelected.forEach(name => {
      const champ = champions.find(c => c.name === name)
      champ?.traits.forEach(t => { counts[t] = (counts[t] || 0) + 1 })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [allSelected, champions])

  const toggleUnit = (champ: Champion) => {
    const name = champ.name
    const inCore = (comp.coreUnits ?? []).includes(name)
    const inFlex = (comp.flexUnits ?? []).includes(name)
    const inEarly = (comp.earlyGame ?? []).includes(name)

    if (!inCore && !inFlex && !inEarly) {
      // Add to core with no role tag by default
      onUpdate({ coreUnits: [...(comp.coreUnits ?? []), name] })
    } else {
      // Remove from wherever it is
      onUpdate({
        coreUnits: (comp.coreUnits ?? []).filter(u => u !== name),
        flexUnits: (comp.flexUnits ?? []).filter(u => u !== name),
        carries: (comp.carries ?? []).filter(u => u !== name),
        earlyGame: (comp.earlyGame ?? []).filter(u => u !== name),
      })
      setUnitRoles(r => { const n = { ...r }; delete n[name]; return n })
    }
  }

  const setRole = (name: string, role: Role | null) => {
    // null = clear role, unit stays in core with no badge
    if (role === null) {
      setUnitRoles(r => { const n = { ...r }; delete n[name]; return n })
    } else {
      setUnitRoles(r => ({ ...r, [name]: role }))
    }

    const effectiveRoles = { ...unitRoles, [name]: role ?? undefined }

    const newCarries = allSelected.filter(u => effectiveRoles[u] === 'carry')
    const newEarly = allSelected.filter(u => effectiveRoles[u] === 'early')
    const newTank = role === 'tank' ? name : (comp.tank === name ? '' : comp.tank)
    const nonFlexNonEarly = allSelected.filter(u => {
      const r = u === name ? role : unitRoles[u]
      return r !== 'flex' && r !== 'early'
    })
    const newFlexUnits = allSelected.filter(u => {
      const r = u === name ? role : unitRoles[u]
      return r === 'flex'
    })

    onUpdate({
      carries: newCarries,
      tank: newTank,
      earlyGame: newEarly,
      coreUnits: nonFlexNonEarly,
      flexUnits: newFlexUnits,
    })
  }

  // Unit builds (per-unit item assignment)
  const [activeItemUnit, setActiveItemUnit] = useState<string | null>(null)

  // Only reset when switching to another meta comp — not on every draft patch (e.g. adding items),
  // or the item panel would close and selection would “reset” on each update.
  useEffect(() => {
    setUnitRoles(unitRolesFromComp(comp))
    setActiveItemUnit(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `comp` identity changes every keystroke; we only reset when `comp.id` changes
  }, [comp.id])

  const getUnitBuild = (name: string): UnitItemBuild =>
    (comp.unitBuilds ?? []).find(b => b.champion === name) ?? { champion: name, coreItems: [], flexItems: [] }

  const updateUnitBuild = (build: UnitItemBuild) => {
    const existing = comp.unitBuilds ?? []
    const updated = existing.some(b => b.champion === build.champion)
      ? existing.map(b => b.champion === build.champion ? build : b)
      : [...existing, build]
    onUpdate({ unitBuilds: updated })
  }

  return (
    <div className="grid grid-cols-[1fr_340px] gap-4">
      {/* LEFT: Champion pool */}
      <div className="space-y-3">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0d0f17] border border-[#2d3154] text-[#e2e8f0] rounded px-2 py-1 text-xs focus:outline-none focus:border-[#c89b3c]/40 w-32 placeholder-[#4a556a]"
          />
          <div className="flex gap-1">
            {[null, 1, 2, 3, 4, 5].map(cost => (
              <button
                key={cost ?? 'all'}
                onClick={() => setCostFilter(cost)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                style={{
                  backgroundColor: costFilter === cost ? (cost ? COST_BG[cost] : '#c89b3c30') : '#1e2240',
                  color: costFilter === cost ? (cost ? COST_BORDER[cost] : '#c89b3c') : '#64748b',
                  border: `1px solid ${costFilter === cost ? (cost ? COST_BORDER[cost] + '50' : '#c89b3c50') : 'transparent'}`,
                }}
              >
                {cost === null ? 'All' : `$${cost}`}
              </button>
            ))}
          </div>
          <select
            value={traitFilter}
            onChange={e => setTraitFilter(e.target.value)}
            className="text-[10px] bg-[#1e2240] border border-[#2d3154] text-[#94a3b8] rounded px-2 py-1 focus:outline-none ml-auto"
          >
            <option value="">All traits</option>
            {allTraits.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Champion grid */}
        <div className="flex flex-wrap gap-1.5">
          {filteredChamps.map(champ => {
            const selected = allSelected.includes(champ.name)
            return (
              <ChampPortrait
                key={champ.id}
                champ={champ}
                size={52}
                selected={selected}
                role={unitRoles[champ.name]}
                onClick={() => toggleUnit(champ)}
                onRoleClick={selected ? (r) => setRole(champ.name, r) : undefined}
                dimmed={!selected && allSelected.length >= 10}
              />
            )
          })}
        </div>

        {/* Unit item panel */}
        {activeItemUnit && (() => {
          const champ = champions.find(c => c.name === activeItemUnit)
          if (!champ) return null
          return (
            <UnitItemPanel
              champion={champ}
              build={getUnitBuild(activeItemUnit)}
              onUpdate={updateUnitBuild}
              onClose={() => setActiveItemUnit(null)}
            />
          )
        })()}
      </div>

      {/* RIGHT: Current team */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#c89b3c] font-['Orbitron'] tracking-wide">
          TEAM ({allSelected.length} units)
        </div>
        <p className="text-[9px] text-[#4a556a]">Hover → set role &nbsp;|&nbsp; Click portrait → assign items</p>

        {/* Selected units grid */}
        <div className="bg-[#0d0f17] rounded-xl border border-[#1e2240] p-3">
          {allSelected.length === 0 ? (
            <p className="text-xs text-[#4a556a] text-center py-4">Click champions to add them to the comp</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allSelected.map(name => {
                const champ = champions.find(c => c.name === name)
                if (!champ) return null
                const build = getUnitBuild(name)
                const hasItems = build.coreItems.length + build.flexItems.length > 0
                const isActive = activeItemUnit === name
                return (
                  <div key={name} className="flex flex-col items-center gap-1">
                    <div className="relative group/unit">
                      <ChampPortrait
                        champ={champ}
                        size={60}
                        selected
                        role={unitRoles[name]}
                        onClick={() => setActiveItemUnit(isActive ? null : name)}
                        onRoleClick={r => setRole(name, r)}
                      />
                      {hasItems && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#c89b3c] border border-[#0d0f17]" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-md ring-2 ring-[#c89b3c] pointer-events-none" />
                      )}
                      {/* Remove button — top-left, visible on hover */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleUnit(champ) }}
                        className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-red-500/80 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover/unit:opacity-100 transition-opacity hover:bg-red-500 z-10"
                      >
                        ✕
                      </button>
                    </div>
                    <span className="text-[9px] text-[#64748b] text-center max-w-[60px] truncate">{name.split(' ')[0]}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {(Object.entries(ROLE_STYLES) as [Role, typeof ROLE_STYLES[Role]][]).map(([role, s]) => (
            <span key={role} className="flex items-center gap-1 px-1.5 py-0.5 rounded border"
              style={{ borderColor: `${s.color}30`, backgroundColor: `${s.bg}40`, color: s.color }}>
              <span className="font-bold">{s.label}</span> {role}
            </span>
          ))}
        </div>

        {/* Active traits */}
        {activeTraits.length > 0 && (
          <div>
            <div className="text-[10px] text-[#64748b] mb-1.5 font-semibold uppercase tracking-wider">Active Traits</div>
            <div className="flex flex-wrap gap-1">
              {activeTraits.map(([trait, count]) => (
                <span key={trait} className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                  style={{
                    borderColor: '#c89b3c40',
                    backgroundColor: count >= 4 ? '#c89b3c25' : '#1e2240',
                    color: count >= 4 ? '#c89b3c' : '#94a3b8',
                  }}
                >
                  {count} {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
