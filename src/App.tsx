import React, { useState, useMemo } from 'react'
import { UserSelection } from './types/tft'
import { TFTDataProvider, useTFTData } from './contexts/TFTDataContext'
import AdminPanel from './components/AdminPanel'
import { getRecommendations } from './utils/compLogic'
import UnitPanel from './components/UnitPanel'
import ItemPanel from './components/ItemPanel'
import AugmentPanel from './components/AugmentPanel'
import ArtifactPanel from './components/ArtifactPanel'
import GodBoonPanel from './components/GodBoonPanel'
import CompRecommendations from './components/CompRecommendations'

function AppContent() {
  const { champions, comps, componentItems, combinedItems, augments } = useTFTData()

  const [selection, setSelection] = useState<UserSelection>({
    items: [],
    combinedItems: [],
    units: [],
    augments: [],
    artifacts: [],
    godBoon: null,
    stage: 2,
  })

  const recommendations = useMemo(
    () => getRecommendations(selection, comps),
    [selection, comps]
  )

  const toggleUnit = (name: string) => {
    setSelection(prev => ({
      ...prev,
      units: prev.units.includes(name)
        ? prev.units.filter(u => u !== name)
        : [...prev.units, name],
    }))
  }

  const toggleItem = (name: string) => {
    if (name.startsWith('__remove__')) {
      const itemName = name.replace('__remove__', '')
      setSelection(prev => {
        const idx = [...prev.items].lastIndexOf(itemName)
        const newItems = [...prev.items]
        newItems.splice(idx, 1)
        return { ...prev, items: newItems }
      })
    } else {
      setSelection(prev => ({ ...prev, items: [...prev.items, name] }))
    }
  }

  const toggleCombinedItem = (name: string) => {
    if (name.startsWith('__remove__')) {
      const itemName = name.replace('__remove__', '')
      setSelection(prev => {
        const idx = [...prev.combinedItems].lastIndexOf(itemName)
        const next = [...prev.combinedItems]
        next.splice(idx, 1)
        return { ...prev, combinedItems: next }
      })
    } else {
      setSelection(prev => ({ ...prev, combinedItems: [...prev.combinedItems, name] }))
    }
  }

  const toggleAugment = (id: string) => {
    setSelection(prev => ({
      ...prev,
      augments: prev.augments.includes(id)
        ? prev.augments.filter(a => a !== id)
        : [...prev.augments, id],
    }))
  }

  const toggleArtifact = (name: string) => {
    setSelection(prev => ({
      ...prev,
      artifacts: prev.artifacts.includes(name)
        ? prev.artifacts.filter(a => a !== name)
        : [...prev.artifacts, name],
    }))
  }

  const setGodBoon = (id: string | null) =>
    setSelection(prev => ({ ...prev, godBoon: id }))

  const clearAll = () =>
    setSelection({
      items: [],
      combinedItems: [],
      units: [],
      augments: [],
      artifacts: [],
      godBoon: null,
      stage: selection.stage,
    })

  const totalSelected =
    selection.items.length +
    selection.combinedItems.length +
    selection.units.length +
    selection.augments.length +
    selection.artifacts.length +
    (selection.godBoon ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#0d0f17] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[#1e2240] px-6 py-3 flex items-center gap-4">
        <div>
          <h1 className="font-['Orbitron'] font-black text-xl text-[#c89b3c] tracking-widest">
            route<span className="text-white">TFT</span>
          </h1>
          <p className="text-[10px] text-[#64748b] tracking-wider">SET 17 COMP FINDER</p>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748b]">Stage</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setSelection(prev => ({ ...prev, stage: s }))}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-all duration-150 ${
                    selection.stage === s
                      ? 'bg-[#c89b3c] text-[#0d0f17]'
                      : 'bg-[#1e2240] text-[#64748b] hover:text-white hover:bg-[#2d3154]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {totalSelected > 0 && (
            <button onClick={clearAll} className="btn-ghost text-xs">
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* 4-column layout — fixed columns scroll horizontally on small screens */}
      <main
        className="flex-1 flex overflow-x-auto overflow-y-hidden"
        style={{ height: 'calc(100vh - 57px)' }}
      >
        <div className="shrink-0 w-[240px] border-r border-[#1e2240] overflow-hidden flex flex-col">
          <UnitPanel
            champions={champions}
            selectedUnits={selection.units}
            onToggle={toggleUnit}
          />
        </div>
        <div className="shrink-0 w-[260px] border-r border-[#1e2240] overflow-hidden flex flex-col">
          <GodBoonPanel selected={selection.godBoon} onSelect={setGodBoon} />
          <AugmentPanel
            augments={augments}
            selectedAugments={selection.augments}
            onToggle={toggleAugment}
          />
          <ArtifactPanel
            selectedArtifacts={selection.artifacts}
            onToggle={toggleArtifact}
          />
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <ItemPanel
              items={componentItems}
              selectedItems={selection.items}
              onToggle={toggleItem}
              combinedCatalog={combinedItems}
              selectedCombined={selection.combinedItems}
              onToggleCombined={toggleCombinedItem}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[280px] overflow-hidden flex flex-col">
          <CompRecommendations recommendations={recommendations} selection={selection} />
        </div>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0f17] flex items-center justify-center">
      <div className="text-center">
        <p className="text-7xl font-black font-['Orbitron'] text-[#1e2240]">404</p>
        <p className="text-[#64748b] text-sm mt-2">Page not found</p>
      </div>
    </div>
  )
}

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const adminRequested = params.has('admin')
  const adminKey = process.env.REACT_APP_ADMIN_KEY
  const isAdmin = adminRequested && adminKey && params.get('admin') === adminKey

  if (adminRequested && !isAdmin) return <NotFound />
  if (isAdmin) return <AdminPanel />
  return (
    <TFTDataProvider>
      <AppContent />
    </TFTDataProvider>
  )
}
