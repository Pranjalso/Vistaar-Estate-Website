'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  highlight?: string
  description?: string
  align?: 'center' | 'left'
  light?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  light = false,
  className,
}: SectionHeadingProps) {
  const renderTitle = () => {
    if (!highlight) return title
    const parts = title.split(highlight)
    return (
      <>
        {parts[0]}
        <span className="text-gradient-gold italic">{highlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark"
      >
        <span className="h-px w-8 bg-gold" />
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          'max-w-2xl font-serif text-4xl font-medium leading-tight text-balance sm:text-5xl',
          light ? 'text-light' : 'text-navy',
        )}
      >
        {renderTitle()}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            'max-w-xl text-base leading-relaxed text-pretty',
            light ? 'text-light/70' : 'text-muted-foreground',
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
