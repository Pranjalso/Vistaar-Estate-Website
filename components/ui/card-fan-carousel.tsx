'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CardFanCarouselProps {
  images: { src: string; alt: string }[]
  autoPlay?: boolean
  interval?: number
}

export function CardFanCarousel({ images, autoPlay = true, interval = 4000 }: CardFanCarouselProps) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const count = images.length

  const layout = () => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      // shortest signed distance around the ring
      let offset = i - active
      if (offset > count / 2) offset -= count
      if (offset < -count / 2) offset += count

      const abs = Math.abs(offset)
      const spread = hovered ? 1.25 : 1
      gsap.to(card, {
        x: offset * 72 * spread,
        y: abs * 16,
        rotation: offset * 7 * spread,
        scale: 1 - abs * 0.09,
        zIndex: 50 - abs,
        opacity: abs > 2 ? 0 : 1 - abs * 0.18,
        duration: 0.7,
        ease: 'power3.out',
      })
    })
  }

  useLayoutEffect(() => {
    layout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, hovered, count])

  useEffect(() => {
    // entrance animation
    gsap.fromTo(
      cardRefs.current.filter(Boolean),
      { y: 60, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out', onComplete: layout },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!autoPlay || hovered) return
    const timer = setInterval(() => setActive((a) => (a + 1) % count), interval)
    return () => clearInterval(timer)
  }, [autoPlay, hovered, interval, count])

  const next = () => setActive((a) => (a + 1) % count)
  const prev = () => setActive((a) => (a - 1 + count) % count)

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative flex h-[360px] w-full items-center justify-center sm:h-[440px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {images.map((img, i) => (
          <div
            key={img.src + i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            onClick={() => setActive(i)}
            className="absolute h-[300px] w-[230px] cursor-pointer overflow-hidden rounded-[26px] border border-white/40 shadow-luxury will-change-transform sm:h-[380px] sm:w-[290px]"
          >
            <img src={img.src || '/placeholder.svg'} alt={img.alt} className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous image"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-navy shadow-luxury transition-all hover:border-gold/60 hover:text-gold-dark"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === active ? 28 : 8,
                backgroundColor: i === active ? 'var(--color-gold)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next image"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-navy shadow-luxury transition-all hover:border-gold/60 hover:text-gold-dark"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
