'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarClock, Maximize, MapPin } from 'lucide-react'
import { getAmenityIcon } from '@/lib/amenity-icons'
import type { Property } from '@/types'

const STATUS_STYLES: Record<string, string> = {
  'Ready to Move': 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  'Under Construction': 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  'New Launch': 'bg-gold/15 text-gold-dark border-gold/40',
}

export function PropertyCard({ property, onOpen }: { property: Property; onOpen: () => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onClick={onOpen}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxury transition-shadow duration-500 hover:shadow-[0_36px_80px_-30px_rgba(26,26,46,0.4)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={property.images[0] || '/placeholder.svg'}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        <span
          className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
            STATUS_STYLES[property.status]
          }`}
        >
          {property.status}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-light/70">Starting from</p>
            <p className="font-serif text-2xl font-semibold text-light">{property.priceLabel}</p>
          </div>
          <motion.span className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-gold-gradient text-navy opacity-0 shadow-gold-glow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </motion.span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gold-dark">
          <MapPin className="h-3.5 w-3.5" />
          {property.location}
        </div>
        <h3 className="mt-2 font-serif text-xl font-semibold text-navy">{property.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>

        {/* Meta */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border/70 py-3 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Config</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{property.configuration}</p>
          </div>
          <div className="border-x border-border/70">
            <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Maximize className="h-3 w-3" /> Area
            </p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{property.area}</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <CalendarClock className="h-3 w-3" /> Possess
            </p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{property.possession}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.slice(0, 4).map((amenity) => {
            const Icon = getAmenityIcon(amenity)
            return (
              <span
                key={amenity}
                className="flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-navy/80 transition-colors duration-300 group-hover:bg-gold/10"
              >
                <Icon className="h-3.5 w-3.5 text-gold-dark" />
                {amenity}
              </span>
            )
          })}
        </div>

        <div className="mt-5 flex-1" />
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-transparent py-3 text-sm font-semibold text-gold-dark transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-navy group-hover:shadow-gold-glow">
          View Details
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  )
}