'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { FilterState } from '@/types'

const DEFAULT_FILTERS: FilterState = {
  configuration: 'any',
  priceRange: 'any',
  location: 'any',
}

interface FilterContextValue {
  filters: FilterState
  setFilters: (f: FilterState) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}
