'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { SectionHeading } from '@/components/common/section-heading'
import { PropertyCard } from './property-card'
import { PropertyModal } from './property-modal'
import { useFilters } from '@/components/providers/filter-provider'
import { PROPERTIES } from '@/data/properties'
import type { Property } from '@/types'

export function FeaturedProperties() {
  const { filters, resetFilters } = useFilters()
  const [selected, setSelected] = useState<Property | null>(null)

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (filters.configuration !== 'any' && p.configKey !== filters.configuration) return false
      if (filters.location !== 'any' && p.city !== filters.location) return false
      if (filters.priceRange !== 'any') {
        const [min, max] = filters.priceRange.split('-').map(Number)
        if (p.price < min || p.price > max) return false
      }
      return true
    })
  }, [filters])

  const hasActiveFilters =
    filters.configuration !== 'any' || filters.location !== 'any' || filters.priceRange !== 'any'

  return (
    <section 
      id="properties" 
      className="relative scroll-mt-24 bg-background px-5 pb-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        {/* 
          Large top padding to accommodate the floating filter
          The padding creates space so the heading starts below the filter
        */}
        <div className="pt-32 sm:pt-36 lg:pt-40 xl:pt-44" />

        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Signature homes, curated"
            highlight="curated"
            description="An evolving portfolio of the most sought-after residences. Use the search filters above to refine by configuration, price, and location."
          />
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={resetFilters}
              className="rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold-dark transition-colors hover:bg-gold/10"
            >
              Clear filters ({filtered.length} of {PROPERTIES.length})
            </motion.button>
          )}
        </div>

        <motion.div layout className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} onOpen={() => setSelected(property)} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-16 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-dark">
                <SearchX className="h-6 w-6" />
              </span>
              <p className="font-serif text-2xl text-navy">No residences match your search</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try adjusting your filters to explore more of our curated collection.
              </p>
              <button
                onClick={resetFilters}
                className="rounded-full bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-navy shadow-gold-glow"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PropertyModal property={selected} onClose={() => setSelected(null)} />
    </section>
  )
}