import React, { createContext, useContext, ReactNode } from 'react'
import { Champion, MetaComp, TFTItem, TFTAugment } from '../types/tft'
import { CHAMPIONS } from '../data/set17Champions'
import { META_COMPS } from '../data/metaComps'
import { COMPONENT_ITEMS, COMBINED_ITEMS } from '../data/tftItems'
import { AUGMENTS } from '../data/augments'

interface TFTDataContextType {
  champions: Champion[]
  comps: MetaComp[]
  componentItems: TFTItem[]
  combinedItems: TFTItem[]
  augments: TFTAugment[]
}

const TFTDataContext = createContext<TFTDataContextType | null>(null)

export function TFTDataProvider({ children }: { children: ReactNode }) {
  return (
    <TFTDataContext.Provider
      value={{
        champions: CHAMPIONS,
        comps: META_COMPS,
        componentItems: COMPONENT_ITEMS,
        combinedItems: COMBINED_ITEMS,
        augments: AUGMENTS,
      }}
    >
      {children}
    </TFTDataContext.Provider>
  )
}

export function useTFTData() {
  const ctx = useContext(TFTDataContext)
  if (!ctx) throw new Error('useTFTData must be used inside TFTDataProvider')
  return ctx
}
