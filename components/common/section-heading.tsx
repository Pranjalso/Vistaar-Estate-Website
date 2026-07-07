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

  const alignmentClasses = 'items-center text-center sm:items-start sm:text-left'

  return (
    <div className={cn('flex flex-col gap-4 relative z-20 overflow-visible', alignmentClasses, className)}>
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark sm:mx-0"
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
          'max-w-2xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-balance overflow-visible pb-2 sm:text-5xl lg:text-6xl',
          light ? 'text-light' : 'text-heading',
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
            'mx-auto max-w-xl text-base leading-relaxed text-pretty sm:mx-0 sm:text-left',
            light ? 'text-light/70' : 'text-muted-foreground',
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
