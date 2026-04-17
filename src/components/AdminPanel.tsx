import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { TFTAugment, MetaComp } from '../types/tft'
import { CHAMPIONS } from '../data/set17Champions'
import {
  CONDITION_CATEGORY_LABEL,
  ConditionCategory,
  conditionsInCategory,
  Condition,
} from '../data/conditions'
import TeamBuilder from './admin/TeamBuilder'
import TieredRecommendationsEditor from './admin/TieredRecommendationsEditor'
import { migrateMetaCompDraft, flattenTierBuckets, emptyTierBuckets } from '../utils/tieredMeta'

// ─── API helpers ─────────────────────────────────────────────────────────────

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  return res.json()
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  Prismatic: '#b070e8',
  Gold: '#ffb938',
  Silver: '#94a3b8',
  S: '#c89b3c',
  A: '#5b9bd5',
  B: '#94a3b8',
  C: '#64748b',
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-semibold border"
      style={{ color, borderColor: `${color}50`, backgroundColor: `${color}15` }}
    >
      {label}
    </span>
  )
}

function Input({ value, onChange, placeholder, className = '', onKeyDown }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`bg-[#0d0f17] border border-[#2d3154] text-[#e2e8f0] rounded px-2 py-1.5 text-xs
                  focus:outline-none focus:border-[#c89b3c]/60 placeholder-[#4a556a] ${className}`}
    />
  )
}

function Textarea({ value, onChange, rows = 3 }: {
  value: string; onChange: (v: string) => void; rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-[#0d0f17] border border-[#2d3154] text-[#e2e8f0] rounded px-2 py-1.5 text-xs
                 focus:outline-none focus:border-[#c89b3c]/60 resize-none placeholder-[#4a556a]"
    />
  )
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#0d0f17] border border-[#2d3154] text-[#e2e8f0] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#c89b3c]/60"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function SaveBtn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="px-3 py-1.5 rounded text-xs font-semibold bg-[#c89b3c] hover:bg-[#d4aa4a] text-[#0d0f17] disabled:opacity-50 transition-colors"
    >
      {saving ? 'Saving…' : 'Save'}
    </button>
  )
}


// ─── Augments Tab ────────────────────────────────────────────────────────────

function AugmentsTab() {
  const [augments, setAugments] = useState<TFTAugment[]>([])
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<TFTAugment>>({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await apiFetch('/augments')
    if (res.ok) setAugments(res.data)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = augments.filter(a => {
    if (tierFilter !== 'All' && a.tier !== tierFilter) return false
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const startEdit = (aug: TFTAugment) => {
    setEditId(aug.id)
    setDraft({ ...aug })
  }

  const save = async () => {
    if (!editId || !draft) return
    setSaving(true)
    await apiFetch(`/augments/${encodeURIComponent(editId)}`, {
      method: 'PUT',
      body: JSON.stringify(draft),
    })
    await load()
    setEditId(null)
    setSaving(false)
  }

  const remove = async (id: string) => {
    await apiFetch(`/augments/${encodeURIComponent(id)}`, { method: 'DELETE' })
    await load()
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e2240]">
        <Input value={search} onChange={setSearch} placeholder="Search name…" className="w-48" />
        <Select value={tierFilter} onChange={setTierFilter} options={['All', 'Prismatic', 'Gold', 'Silver']} />
        <span className="ml-auto text-xs text-[#64748b]">{filtered.length} augments</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e2240]">
        {filtered.map(aug => {
          const isEditing = editId === aug.id
          const d = isEditing ? draft : aug
          return (
            <div key={aug.id} className={`px-4 py-3 ${isEditing ? 'bg-[#13162a]' : 'hover:bg-[#0f1120]'}`}>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input value={d.name ?? ''} onChange={v => setDraft(p => ({ ...p, name: v }))} placeholder="Name" className="flex-1" />
                    <Select value={d.tier ?? 'Silver'} onChange={v => setDraft(p => ({ ...p, tier: v as TFTAugment['tier'] }))} options={['Prismatic', 'Gold', 'Silver']} />
                  </div>
                  <Textarea value={d.desc ?? ''} onChange={v => setDraft(p => ({ ...p, desc: v }))} rows={2} />
                  <Input
                    value={(d.traits ?? []).join(', ')}
                    onChange={v => setDraft(p => ({ ...p, traits: v.split(',').map(s => s.trim()).filter(Boolean) }))}
                    placeholder="Traits (comma separated)"
                    className="w-full"
                  />
                  <div className="flex gap-2 pt-1">
                    <SaveBtn onClick={save} saving={saving} />
                    <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded text-xs text-[#64748b] hover:text-white border border-[#2d3154] hover:border-[#4a556a] transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white">{aug.name}</span>
                      <Badge label={aug.tier} color={TIER_COLORS[aug.tier]} />
                      {aug.traits.map(t => (
                        <span key={t} className="text-[10px] text-[#64748b]">{t}</span>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#64748b] leading-relaxed line-clamp-2">{aug.desc}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(aug)}
                      className="px-2.5 py-1 rounded text-[11px] border border-[#2d3154] text-[#94a3b8] hover:text-white hover:border-[#c89b3c]/40 transition-colors"
                    >
                      Edit
                    </button>
                    {confirmDelete === aug.id ? (
                      <>
                        <button onClick={() => remove(aug.id)} className="px-2.5 py-1 rounded text-[11px] bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                          Confirm
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="px-2.5 py-1 rounded text-[11px] border border-[#2d3154] text-[#64748b] hover:text-white transition-colors">
                          ✕
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDelete(aug.id)} className="px-2.5 py-1 rounded text-[11px] border border-[#2d3154] text-[#64748b] hover:text-red-400 hover:border-red-500/30 transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Emblem Picker ────────────────────────────────────────────────────────────

const TRAITS = [
  'Anima', 'N.O.V.A.', 'Dark Star', 'Space Groove', 'Meeple', 'Stargazer',
  'Timebreaker', 'Mecha', 'Psionic', 'Arbiter', 'Primordian',
  'Rogue', 'Challenger', 'Brawler', 'Vanguard', 'Sniper', 'Bastion',
  'Marauder', 'Channeler', 'Voyager', 'Shepherd', 'Replicator', 'Fateweaver', 'Redeemer',
]

function EmblemPicker({ selectedEmblems, onChange }: {
  selectedEmblems: string[]
  onChange: (names: string[]) => void
}) {
  const [search, setSearch] = useState('')
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!search.trim()) return []
    return TRAITS.filter(t => t.toLowerCase().includes(search.toLowerCase())).slice(0, 10)
  }, [search])

  React.useEffect(() => { setHighlightIdx(-1) }, [search])

  React.useEffect(() => {
    if (highlightIdx >= 0 && dropdownRef.current) {
      const el = dropdownRef.current.children[highlightIdx] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIdx])

  const add = (name: string) => {
    onChange([...selectedEmblems, name])
    setSearch('')
    setHighlightIdx(-1)
  }

  const removeAt = (idx: number) =>
    onChange(selectedEmblems.filter((_, i) => i !== idx))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault()
      add(results[highlightIdx])
    } else if (e.key === 'Escape') {
      setSearch('')
    }
  }

  return (
    <div className="p-4 rounded-lg border border-[#1e2240] bg-[#0d0f17] space-y-2">
      <div className="text-[10px] font-semibold text-[#c89b3c] uppercase tracking-wider font-['Orbitron']">Recommended Emblems</div>
      {selectedEmblems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedEmblems.map((trait, idx) => (
            <button key={idx} onClick={() => removeAt(idx)}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border border-[#c89b3c50] bg-[#c89b3c15] text-[#c89b3c] transition-all"
            >
              {trait} Emblem <span className="opacity-60">✕</span>
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        <Input value={search} onChange={setSearch} placeholder="Search trait emblems…" className="w-full" onKeyDown={handleKeyDown} />
        {results.length > 0 && (
          <div ref={dropdownRef} className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#13162a] border border-[#2d3154] rounded-lg overflow-hidden shadow-xl">
            {results.map((trait, i) => (
              <button key={trait} onClick={() => add(trait)}
                className="w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 transition-colors"
                style={{ backgroundColor: i === highlightIdx ? '#1e2240' : 'transparent', color: '#94a3b8' }}
              >
                {trait} Emblem
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ADMIN_CONDITION_SECTIONS: ConditionCategory[] = [
  'god_boon',
  'stargazer_constellation',
  'psionic_item',
]

function ConditionsPicker({ selected, onChange }: {
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])

  const chipLabel = (c: Condition) =>
    c.category === 'god_boon' && c.championPortrait ? c.championPortrait : c.label

  return (
    <div className="p-4 rounded-lg border border-[#1e2240] bg-[#0d0f17] space-y-3">
      <div className="text-[10px] font-semibold text-[#a78bfa] uppercase tracking-wider font-['Orbitron']">
        Recommended conditions
      </div>
      <p className="text-[10px] text-[#64748b] leading-snug">
        God boons, Stargazer constellations, and Psionic items that strengthen this comp.
      </p>
      {ADMIN_CONDITION_SECTIONS.map(cat => {
        const items = conditionsInCategory(cat)
        return (
          <div key={cat} className="space-y-1.5">
            <div className="text-[9px] text-[#64748b] uppercase tracking-wider font-['Orbitron']">
              {CONDITION_CATEGORY_LABEL[cat]}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map(c => {
                const isSelected = selected.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle(c.id)}
                    title={c.label}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold border transition-all max-w-full truncate"
                    style={{
                      borderColor: isSelected ? '#a78bfa' : '#2d3154',
                      backgroundColor: isSelected ? '#a78bfa20' : '#13162a',
                      color: isSelected ? '#a78bfa' : '#64748b',
                      boxShadow: isSelected ? '0 0 6px #a78bfa40' : 'none',
                    }}
                  >
                    {chipLabel(c)}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Meta Comps Tab ───────────────────────────────────────────────────────────

function MetaCompsTab() {
  const [comps, setComps] = useState<MetaComp[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, MetaComp>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    const res = await apiFetch('/comps')
    if (res.ok) {
      setComps(res.data)
      const d: Record<string, MetaComp> = {}
      res.data.forEach((c: MetaComp) => {
        d[c.id] = migrateMetaCompDraft(JSON.parse(JSON.stringify(c)))
      })
      setDrafts(d)
      setActiveId(prev => prev ?? (res.data.length > 0 ? res.data[0].id : null))
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateDraft = (id: string, patch: Partial<MetaComp>) => {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const save = async (id: string) => {
    setSaving(id)
    await apiFetch(`/comps/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(drafts[id]),
    })
    await load()
    setSaving(null)
  }

  const remove = async (id: string) => {
    await apiFetch(`/comps/${encodeURIComponent(id)}`, { method: 'DELETE' })
    setConfirmDelete(null)
    if (activeId === id) setActiveId(null)
    await load()
  }

  const createComp = async () => {
    setCreating(true)
    const id = `comp-${Date.now()}`
    const blank: MetaComp = {
      id,
      name: 'New Comp',
      tier: 'A',
      carries: [],
      tank: '',
      coreUnits: [],
      flexUnits: [],
      unitBuilds: [],
      carryBuilds: [],
      keyComponents: [],
      earlyGame: [],
      playstyle: 'standard',
      description: '',
      recommendedConditions: [],
      recommendedAugments: [],
      augmentTiers: emptyTierBuckets(),
      artifactTiers: emptyTierBuckets(),
      recommendedEmblems: [],
    }
    await apiFetch('/comps', { method: 'POST', body: JSON.stringify(blank) })
    await load()
    setActiveId(id)
    setCreating(false)
  }

  const activeDraft = activeId ? drafts[activeId] : null

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar: comp list */}
      <div className="w-52 border-r border-[#1e2240] flex flex-col shrink-0">
        <div className="px-3 py-2 border-b border-[#1e2240] flex items-center">
          <span className="text-[10px] text-[#64748b] font-semibold uppercase tracking-wider">Comps</span>
          <button
            onClick={createComp}
            disabled={creating}
            className="ml-auto text-[11px] px-2 py-0.5 rounded bg-[#c89b3c] hover:bg-[#d4aa4a] text-[#0d0f17] font-semibold disabled:opacity-50 transition-colors"
          >
            {creating ? '…' : '+ New'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {comps.map(comp => (
            <button
              key={comp.id}
              onClick={() => setActiveId(comp.id)}
              className={`w-full text-left px-3 py-2.5 border-b border-[#1e2240] transition-colors ${
                activeId === comp.id ? 'bg-[#13162a] border-l-2 border-l-[#c89b3c]' : 'hover:bg-[#0f1120]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-1 rounded"
                  style={{
                    color:
                      comp.tier === 'S'
                        ? '#c89b3c'
                        : comp.tier === 'A'
                          ? '#5b9bd5'
                          : comp.tier === 'B'
                            ? '#94a3b8'
                            : '#64748b',
                    backgroundColor:
                      comp.tier === 'S'
                        ? '#c89b3c20'
                        : comp.tier === 'A'
                          ? '#5b9bd520'
                          : comp.tier === 'B'
                            ? '#94a3b820'
                            : '#64748b20',
                  }}
                >
                  {comp.tier}
                </span>
                <span className="text-xs text-white truncate">{comp.name}</span>
              </div>
              <div className="text-[10px] text-[#64748b] mt-0.5">{comp.playstyle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main: team builder */}
      <div className="flex-1 overflow-y-auto">
        {activeDraft ? (
          <div className="p-5 space-y-4">
            {/* Action bar */}
            <div className="flex items-center gap-3">
              <div className="ml-auto flex gap-2">
                {confirmDelete === activeDraft.id ? (
                  <>
                    <button onClick={() => remove(activeDraft.id)} className="px-3 py-1.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">Confirm Delete</button>
                    <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded text-xs border border-[#2d3154] text-[#64748b]">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(activeDraft.id)} className="px-3 py-1.5 rounded text-xs border border-[#2d3154] text-[#64748b] hover:text-red-400 hover:border-red-500/30 transition-colors">
                    Delete
                  </button>
                )}
                <button
                  onClick={() => save(activeDraft.id)}
                  disabled={saving === activeDraft.id}
                  className="px-4 py-1.5 rounded text-xs font-semibold bg-[#c89b3c] hover:bg-[#d4aa4a] text-[#0d0f17] disabled:opacity-50 transition-colors"
                >
                  {saving === activeDraft.id ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>

            {/* Comp metadata fields */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-lg border border-[#1e2240] bg-[#0d0f17]">
              <div className="col-span-2">
                <label className="block text-[10px] text-[#64748b] mb-1 uppercase tracking-wider">Name</label>
                <Input
                  value={activeDraft.name}
                  onChange={v => updateDraft(activeDraft.id, { name: v })}
                  placeholder="Comp name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748b] mb-1 uppercase tracking-wider">Tier</label>
                <Select
                  value={activeDraft.tier}
                  onChange={v => updateDraft(activeDraft.id, { tier: v as MetaComp['tier'] })}
                  options={['S', 'A', 'B', 'C']}
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748b] mb-1 uppercase tracking-wider">Playstyle</label>
                <Select
                  value={activeDraft.playstyle}
                  onChange={v => updateDraft(activeDraft.id, { playstyle: v as MetaComp['playstyle'] })}
                  options={['standard', 'fast9', '1cost-reroll', '2cost-reroll', '3cost-reroll']}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-[#64748b] mb-1 uppercase tracking-wider">Description</label>
                <Textarea
                  value={activeDraft.description}
                  onChange={v => updateDraft(activeDraft.id, { description: v })}
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-[#64748b] mb-1 uppercase tracking-wider">Source Link</label>
                <Input
                  value={activeDraft.link ?? ''}
                  onChange={v => updateDraft(activeDraft.id, { link: v })}
                  placeholder="https://tftacademy.gg/..."
                  className="w-full"
                />
              </div>
            </div>

            <ConditionsPicker
              selected={activeDraft.recommendedConditions ?? []}
              onChange={ids => updateDraft(activeDraft.id, { recommendedConditions: ids })}
            />

            <TieredRecommendationsEditor
              title="Augments — drag tiers"
              mode="augment"
              resetKey={activeDraft.id}
              tiers={activeDraft.augmentTiers ?? emptyTierBuckets()}
              onChange={next =>
                updateDraft(activeDraft.id, {
                  augmentTiers: next,
                  recommendedAugments: flattenTierBuckets(next),
                })
              }
            />

            <TieredRecommendationsEditor
              title="Artifacts — drag tiers"
              mode="artifact"
              resetKey={activeDraft.id}
              tiers={activeDraft.artifactTiers ?? emptyTierBuckets()}
              onChange={next => updateDraft(activeDraft.id, { artifactTiers: next })}
            />

            <EmblemPicker
              selectedEmblems={activeDraft.recommendedEmblems ?? []}
              onChange={names => updateDraft(activeDraft.id, { recommendedEmblems: names })}
            />

            <TeamBuilder
              champions={CHAMPIONS}
              comp={activeDraft}
              onUpdate={patch => updateDraft(activeDraft.id, patch)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-[#64748b] text-sm">
            Select a comp from the sidebar
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [tab, setTab] = useState<'augments' | 'comps'>('augments')
  const [serverOk, setServerOk] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/augments')
      .then(r => r.ok ? setServerOk(true) : setServerOk(false))
      .catch(() => setServerOk(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0f17] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1e2240] px-6 py-3 flex items-center gap-4">
        <div>
          <h1 className="font-['Orbitron'] font-black text-xl text-[#c89b3c] tracking-widest">
            TFT<span className="text-white">FLOW</span>
            <span className="text-[#64748b] text-sm ml-2 font-normal normal-case tracking-normal">Admin</span>
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`text-[11px] flex items-center gap-1.5 ${serverOk === true ? 'text-green-400' : serverOk === false ? 'text-red-400' : 'text-[#64748b]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${serverOk === true ? 'bg-green-400' : serverOk === false ? 'bg-red-400' : 'bg-[#64748b]'}`} />
            {serverOk === true ? 'Server connected' : serverOk === false ? 'Server offline — run: node admin-server.js' : 'Connecting…'}
          </span>
          <a
            href="/"
            className="text-xs border border-[#2d3154] text-[#94a3b8] hover:text-white hover:border-[#c89b3c]/40 px-3 py-1.5 rounded transition-colors"
          >
            ← Back to App
          </a>
        </div>
      </header>

      {serverOk === false && (
        <div className="mx-6 mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          Admin server is not running. Open a terminal in the project folder and run:
          <code className="ml-2 font-mono bg-red-500/20 px-2 py-0.5 rounded">node admin-server.js</code>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#1e2240] px-6 flex gap-0">
        {(['augments', 'comps'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t
                ? 'border-[#c89b3c] text-[#c89b3c]'
                : 'border-transparent text-[#64748b] hover:text-white'
            }`}
          >
            {t === 'comps' ? 'Meta Comps' : 'Augments'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'augments' && <AugmentsTab />}
        {tab === 'comps' && <MetaCompsTab />}
      </div>
    </div>
  )
}
