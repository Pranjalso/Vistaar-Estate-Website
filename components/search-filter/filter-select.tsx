'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterSelectProps {
  label: string
  icon: React.ReactNode
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export function FilterSelect({ label, icon, options, value, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all duration-300',
          'bg-white/90 backdrop-blur-sm',
          open
            ? 'border-gold ring-2 ring-gold/20 shadow-gold-glow'
            : 'border-gold/20 hover:border-gold/40 hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-gold/30'
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-gold shrink-0">{icon}</span>
          <span className="truncate text-navy/80 text-xs sm:text-sm">
            {selected?.label || label}
          </span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gold shrink-0" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-xl border border-gold/20 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  option.value === value
                    ? 'bg-gradient-to-r from-gold-light/20 via-gold/20 to-gold-dark/20 text-navy font-semibold'
                    : 'text-navy/70 hover:bg-gold/10 hover:text-navy'
                )}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}