'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, IndianRupee, MapPin, Search, X, ChevronDown } from 'lucide-react'
import { FilterSelect } from './filter-select'
import { useFilters } from '@/components/providers/filter-provider'
import { CONFIG_OPTIONS, PRICE_OPTIONS, LOCATION_OPTIONS } from '@/constants/site'
import type { FilterState } from '@/types'
import { useMediaQuery } from '@/app/hooks/use-media-query'

export function SearchPanel() {
  const { filters, setFilters, resetFilters } = useFilters()
  
  const [isMounted, setIsMounted] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState<'config' | 'price' | 'location' | null>(null)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileFilterOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    })
    setMobileFilterOpen(null)
  }

  const handleSearch = () => {
    document.getElementById('properties')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  const hasActiveFilters =
    filters.configuration !== 'any' ||
    filters.location !== 'any' ||
    filters.priceRange !== 'any'

  const getConfigLabel = () => {
    const found = CONFIG_OPTIONS.find(o => o.value === filters.configuration)
    if (!found) return 'Config'
    // Shorten label for mobile
    if (isMobile) {
      if (found.value === 'any') return 'Config'
      return found.label.replace(' BHK', '')
    }
    return found.label
  }

  const getPriceLabel = () => {
    const found = PRICE_OPTIONS.find(o => o.value === filters.priceRange)
    if (!found) return 'Price'
    // Shorten label for mobile
    if (isMobile) {
      if (found.value === 'any') return 'Price'
      return found.label.replace('Any Price', 'Price').replace('Up to ', '').replace('$', '')
    }
    return found.label
  }

  const getLocationLabel = () => {
    const found = LOCATION_OPTIONS.find(o => o.value === filters.location)
    if (!found) return 'Location'
    // Shorten label for mobile
    if (isMobile) {
      if (found.value === 'any') return 'Location'
      // For location, show just the city name
      return found.label
    }
    return found.label
  }

  if (!isMounted) {
    return null
  }

  // Desktop: Full floating card with 3 columns + button
  if (!isMobile && !isTablet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.7, 
          delay: 0.4, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="w-full"
      >
        <div className="relative rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur-xl border border-gold/20">
          <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-gold/20 via-transparent to-gold/20 blur-xl" />
          
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
            <FilterSelect
              label="Configuration"
              icon={<Building2 className="h-4 w-4 text-gold-dark" />}
              options={CONFIG_OPTIONS}
              value={filters.configuration}
              onChange={(v) => handleChange('configuration', v)}
            />
            <FilterSelect
              label="Price Range"
              icon={<IndianRupee className="h-4 w-4 text-gold-dark" />}
              options={PRICE_OPTIONS}
              value={filters.priceRange}
              onChange={(v) => handleChange('priceRange', v)}
            />
            <FilterSelect
              label="Location"
              icon={<MapPin className="h-4 w-4 text-gold-dark" />}
              options={LOCATION_OPTIONS}
              value={filters.location}
              onChange={(v) => handleChange('location', v)}
            />
            <motion.button
              type="button"
              onClick={handleSearch}
              whileHover={{ 
                y: -2, 
                boxShadow: '0 16px 40px -12px rgba(212,175,55,0.6)' 
              }}
              whileTap={{ scale: 0.97 }}
              className="flex h-[54px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 text-sm font-semibold text-navy shadow-gold-glow whitespace-nowrap"
            >
              <Search className="h-4 w-4" />
              Search
            </motion.button>
          </div>

          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-between border-t border-gold/10 pt-3"
            >
              <span className="text-xs text-muted-foreground">
                Active filters applied
              </span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Tablet: Compact floating card with 2 columns
  if (isTablet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.3, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="w-full"
      >
        <div className="relative rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-xl border border-gold/20">
          <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-gold/20 via-transparent to-gold/20 blur-xl" />
          
          <div className="grid grid-cols-2 gap-2.5">
            <FilterSelect
              label="Configuration"
              icon={<Building2 className="h-3.5 w-3.5 text-gold-dark" />}
              options={CONFIG_OPTIONS}
              value={filters.configuration}
              onChange={(v) => handleChange('configuration', v)}
            />
            <FilterSelect
              label="Price Range"
              icon={<IndianRupee className="h-3.5 w-3.5 text-gold-dark" />}
              options={PRICE_OPTIONS}
              value={filters.priceRange}
              onChange={(v) => handleChange('priceRange', v)}
            />
            <FilterSelect
              label="Location"
              icon={<MapPin className="h-3.5 w-3.5 text-gold-dark" />}
              options={LOCATION_OPTIONS}
              value={filters.location}
              onChange={(v) => handleChange('location', v)}
            />
            <motion.button
              type="button"
              onClick={handleSearch}
              whileHover={{ 
                y: -2, 
                boxShadow: '0 16px 40px -12px rgba(212,175,55,0.6)' 
              }}
              whileTap={{ scale: 0.97 }}
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 text-sm font-semibold text-navy shadow-gold-glow"
            >
              <Search className="h-4 w-4" />
              Search
            </motion.button>
          </div>

          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 flex items-center justify-between border-t border-gold/10 pt-2.5"
            >
              <span className="text-[11px] text-muted-foreground">
                Active filters applied
              </span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-medium text-gold-dark hover:text-gold transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Mobile: Compact horizontal pill bar with shortened labels
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="w-full"
      ref={mobileRef}
    >
      <div className="relative rounded-xl bg-white/95 shadow-2xl backdrop-blur-xl border border-gold/20">
        <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-gold/20 via-transparent to-gold/20 blur-xl" />
        
        <div className="flex items-center gap-1 p-1.5 sm:p-2">
          {/* Configuration Pill */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => setMobileFilterOpen(mobileFilterOpen === 'config' ? null : 'config')}
              className={`
                flex w-full items-center justify-between gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] sm:text-xs font-medium transition-all
                ${filters.configuration !== 'any' 
                  ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-navy' 
                  : 'bg-cream/50 text-navy/70 hover:bg-cream'}
                ${mobileFilterOpen === 'config' ? 'ring-2 ring-gold ring-offset-1' : ''}
              `}
            >
              <span className="flex items-center gap-1 truncate min-w-0">
                <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-dark shrink-0" />
                <span className="truncate text-[10px] sm:text-xs">{getConfigLabel()}</span>
              </span>
              <ChevronDown className={`h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 transition-transform ${mobileFilterOpen === 'config' ? 'rotate-180' : ''}`} />
            </button>

            {/* Config Dropdown */}
            <AnimatePresence>
              {mobileFilterOpen === 'config' && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gold/20 bg-white shadow-xl"
                >
                  <div className="max-h-48 overflow-auto py-1">
                    {CONFIG_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChange('configuration', option.value)}
                        className={`
                          w-full px-3 py-2 text-left text-xs transition-colors
                          ${option.value === filters.configuration 
                            ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-navy font-semibold' 
                            : 'text-navy/70 hover:bg-cream'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Pill */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => setMobileFilterOpen(mobileFilterOpen === 'price' ? null : 'price')}
              className={`
                flex w-full items-center justify-between gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] sm:text-xs font-medium transition-all
                ${filters.priceRange !== 'any' 
                  ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-navy' 
                  : 'bg-cream/50 text-navy/70 hover:bg-cream'}
                ${mobileFilterOpen === 'price' ? 'ring-2 ring-gold ring-offset-1' : ''}
              `}
            >
              <span className="flex items-center gap-1 truncate min-w-0">
                <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-dark shrink-0" />
                <span className="truncate text-[10px] sm:text-xs">{getPriceLabel()}</span>
              </span>
              <ChevronDown className={`h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 transition-transform ${mobileFilterOpen === 'price' ? 'rotate-180' : ''}`} />
            </button>

            {/* Price Dropdown */}
            <AnimatePresence>
              {mobileFilterOpen === 'price' && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gold/20 bg-white shadow-xl"
                >
                  <div className="max-h-48 overflow-auto py-1">
                    {PRICE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChange('priceRange', option.value)}
                        className={`
                          w-full px-3 py-2 text-left text-xs transition-colors
                          ${option.value === filters.priceRange 
                            ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-navy font-semibold' 
                            : 'text-navy/70 hover:bg-cream'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location Pill */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => setMobileFilterOpen(mobileFilterOpen === 'location' ? null : 'location')}
              className={`
                flex w-full items-center justify-between gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] sm:text-xs font-medium transition-all
                ${filters.location !== 'any' 
                  ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-navy' 
                  : 'bg-cream/50 text-navy/70 hover:bg-cream'}
                ${mobileFilterOpen === 'location' ? 'ring-2 ring-gold ring-offset-1' : ''}
              `}
            >
              <span className="flex items-center gap-1 truncate min-w-0">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-dark shrink-0" />
                <span className="truncate text-[10px] sm:text-xs">{getLocationLabel()}</span>
              </span>
              <ChevronDown className={`h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 transition-transform ${mobileFilterOpen === 'location' ? 'rotate-180' : ''}`} />
            </button>

            {/* Location Dropdown */}
            <AnimatePresence>
              {mobileFilterOpen === 'location' && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gold/20 bg-white shadow-xl"
                >
                  <div className="max-h-48 overflow-auto py-1">
                    {LOCATION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChange('location', option.value)}
                        className={`
                          w-full px-3 py-2 text-left text-xs transition-colors
                          ${option.value === filters.location 
                            ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-navy font-semibold' 
                            : 'text-navy/70 hover:bg-cream'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <motion.button
            type="button"
            onClick={handleSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy shadow-gold-glow"
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </motion.button>

          {/* Clear Filters Button - Only show if active */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={resetFilters}
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-white/50 text-gold-dark hover:bg-gold/10 transition-colors"
            >
              <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}