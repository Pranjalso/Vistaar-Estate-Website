'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SearchPanel } from '@/components/search-filter/search-panel'

const SLIDES = [
  {
    video: '/videos/hero-1.mp4',
    poster: '/images/hero-1.png',
    eyebrow: 'Exceptional Residences',
    title: ['Where architecture', 'becomes a', 'way of living'],
    highlight: 'way of living',
    description:
      "Curating the world's most extraordinary homes — private villas, skyline penthouses, and waterfront estates.",
  },
  {
    video: '/videos/hero-2.mp4',
    poster: '/images/hero-2.png',
    eyebrow: 'Skyline Penthouses',
    title: ['Elevated living', 'above the', 'city lights'],
    highlight: 'city lights',
    description:
      'Panoramic penthouses designed for those who expect the extraordinary from every horizon and every detail.',
  },
  {
    video: '/videos/hero-3.mp4',
    poster: '/images/hero-3.png',
    eyebrow: 'Waterfront Estates',
    title: ['Serene retreats', 'at the edge', 'of the water'],
    highlight: 'of the water',
    description:
      'Discover coastal sanctuaries where refined design meets the calm of open water and endless light.',
  },
]

const AUTOPLAY = 6500

export function Hero() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((dir: number) => {
    setDirection(dir)
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length)
  }, [])

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
  }

  useEffect(() => {
    const timer = setInterval(() => go(1), AUTOPLAY)
    return () => clearInterval(timer)
  }, [go, index])

  const slide = SLIDES[index]

  const renderTitle = (line: string) =>
    line === slide.highlight ? (
      <span className="text-gradient-gold italic">{line}</span>
    ) : (
      line
    )

  return (
    <section 
      id="home" 
      className="relative min-h-[100svh] w-full overflow-visible bg-dark"
    >
      {/* Slides with overflow hidden */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.div className="absolute inset-0 overflow-hidden">
              {slide.video ? (
                <motion.video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={slide.poster}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1.12 }}
                  transition={{ duration: AUTOPLAY / 1000 + 1.5, ease: 'linear' }}
                  className="h-full w-full object-cover"
                  src={slide.video}
                />
              ) : (
                <motion.img
                  src={slide.poster}
                  alt=""
                  aria-hidden
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1.12 }}
                  transition={{ duration: AUTOPLAY / 1000 + 1.5, ease: 'linear' }}
                  className="h-full w-full object-cover"
                />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/55 to-dark/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-dark/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-52 pt-28 sm:px-6 sm:pb-56">
        <AnimatePresence mode="wait">
          <motion.div key={index} className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-light/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-gold-light backdrop-blur-sm"
            >
              {slide.eyebrow}
            </motion.span>

            <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.08] text-light text-balance overflow-visible pb-2 sm:text-6xl lg:text-7xl">
              {slide.title.map((line, i) => (
                <motion.span
                  key={`${index}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  {renderTitle(line)}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-light/75 sm:text-lg"
            >
              {slide.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 16px 36px -10px rgba(212,175,55,0.6)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-semibold text-navy shadow-gold-glow"
              >
                Explore Properties
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full border border-light/30 bg-light/5 px-7 py-3.5 text-sm font-semibold text-light backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold-light"
              >
                Book a Consultation
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows - Desktop: Side navigation */}
      <div className="absolute inset-y-0 left-3 z-20 hidden items-center sm:left-5 sm:flex">
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-light/20 bg-dark/30 text-light backdrop-blur-md transition-all hover:border-gold/60 hover:bg-dark/50 hover:text-gold-light"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-3 z-20 hidden items-center sm:right-5 sm:flex">
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-light/20 bg-dark/30 text-light backdrop-blur-md transition-all hover:border-gold/60 hover:bg-dark/50 hover:text-gold-light"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Nav arrows - Mobile: Bottom-right position */}
      <div className="absolute bottom-32 z-20 flex items-center gap-2 right-4 sm:hidden">
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-light/20 bg-dark/50 text-light backdrop-blur-md transition-all hover:border-gold/60 hover:bg-dark/70 hover:text-gold-light"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-light/20 bg-dark/50 text-light backdrop-blur-md transition-all hover:border-gold/60 hover:bg-dark/70 hover:text-gold-light"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Pagination - Centered below content */}
      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-36">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === index ? 32 : 10,
              backgroundColor: i === index ? 'var(--color-gold)' : 'rgba(248,245,240,0.4)',
            }}
          />
        ))}
      </div>

      {/* 
        Floating Filter - PERFECT CENTERING
        No margins, no left offsets, no calc() 
        Just pure position: absolute with left: 50% and transform: translate(-50%, 50%)
        Z-index 50 to stay below navbar (z-100)
      */}
      <div 
        className="absolute left-1/2 bottom-0 z-[50] w-full"
        style={{
          transform: 'translate(-50%, 50%)',
          pointerEvents: 'none'
        }}
      >
        <div className="mx-auto pointer-events-auto" style={{ width: 'min(92%, 1280px)' }}>
          <SearchPanel />
        </div>
      </div>
    </section>
  )
}