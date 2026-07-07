'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/logo'
import { NAV_LINKS, SITE } from '@/constants/site'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Handle scroll with 15-20px threshold for immediate transition
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const threshold = 18
      setScrolled(scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry) {
          setActive(`#${visibleEntry.target.id}`)
        } else if (window.scrollY < 180) {
          setActive('#home')
        }
      },
      { rootMargin: '-20% 0px -45% 0px', threshold: [0.2, 0.4, 0.6] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.pathname !== '/') return
    if (window.matchMedia('(max-width: 768px)').matches && window.location.hash === '#blog') {
      window.history.replaceState(null, '', window.location.pathname)
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    setActive(href)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2,
      }}
      className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 sm:px-4"
    >
      <motion.nav
        animate={{
          marginTop: scrolled ? 4 : 12,
          paddingTop: scrolled ? 4 : 6,
          paddingBottom: scrolled ? 4 : 6,
          backgroundColor: scrolled 
            ? 'rgba(255, 255, 255, 0.92)' 
            : 'rgba(255, 255, 255, 0)',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          borderColor: scrolled ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0)',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03)' 
            : 'none',
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-full px-4 sm:px-6',
          'border',
          !scrolled && 'border-transparent',
          scrolled && 'border-gold/20',
        )}
      >
        {/* Logo - Fixed for all screens */}
        <motion.button
          onClick={() => handleNav('#home')}
          className="group shrink-0 flex items-center"
          aria-label="Go to home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <motion.div
            animate={{
              scale: scrolled ? 0.85 : 1,
            }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex items-center"
          >
            <Logo />
          </motion.div>
        </motion.button>

        {/* Center links with refined spacing */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href
            return (
              <li key={link.href} className="relative">
                <button
                  onClick={() => handleNav(link.href)}
                  className={cn(
                    'group relative rounded-full px-3.5 py-2 text-sm font-semibold uppercase tracking-[0.22em] transition-all duration-300',
                    isActive
                      ? scrolled
                        ? 'text-navy'
                        : 'text-white'
                      : scrolled
                        ? 'text-navy/80 hover:text-navy'
                        : 'text-white/90 hover:text-white',
                  )}
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="relative z-10 inline-block"
                  >
                    {link.label}
                  </motion.span>
                  <span
                    className={cn(
                      'absolute bottom-0 left-1/2 h-[2px] w-full -translate-x-1/2 rounded-full bg-gold transition-all duration-300',
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100',
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        {/* Desktop Call button - Enlarged */}
        <div className="hidden items-center lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <motion.a
              href={SITE.phoneHref}
              whileHover={{ 
                y: -2, 
                boxShadow: '0 16px 40px -10px rgba(212,175,55,0.6)',
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={cn(
                'flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark font-semibold text-navy shadow-lg transition-all duration-300',
                scrolled 
                  ? 'px-8 py-3.5 text-base' 
                  : 'px-6 py-2.5 text-sm'
              )}>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex items-center justify-center"
              >
                <Phone className={scrolled ? 'h-5 w-5' : 'h-4 w-4'} />
              </motion.span>
              <span className="inline">Call Us</span>
            </motion.a>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 whitespace-nowrap rounded-xl bg-navy px-4 py-2.5 text-xs font-medium text-white shadow-xl"
                >
                  <span className="text-gold-light">Speak with a concierge</span>
                  <br />
                  {SITE.phone}
                  <span className="absolute -top-1 right-8 h-2 w-2 rotate-45 bg-navy" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: Call icon + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Call Icon - Only visible on mobile/tablet */}
          <motion.a
            href={SITE.phoneHref}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 relative',
              scrolled 
                ? 'text-gold hover:bg-cream' 
                : 'text-gold hover:bg-white/10',
              'group'
            )}
            aria-label="Call us"
          >
            <Phone className="h-5 w-5 text-current" />
            
            {/* Pulse ring animation */}
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-gold"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
            
            {/* Glow effect */}
            <motion.span
              className="absolute inset-0 rounded-full bg-gold/20"
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.a>

          {/* Hamburger Menu */}
          <motion.button
            onClick={() => setMenuOpen((o) => !o)}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
              scrolled ? 'text-navy hover:bg-cream' : 'text-white hover:bg-white/10',
            )}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu - Without Call button */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-4 top-20 z-40 overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-gold/20 p-4 shadow-2xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <button
                    onClick={() => handleNav(link.href)}
                    className={cn(
                      'w-full rounded-xl px-4 py-3 text-left text-base font-medium transition-colors',
                      active === link.href 
                        ? 'bg-gradient-to-r from-gold-light/20 to-gold/20 text-gold-dark' 
                        : 'text-navy hover:bg-cream',
                    )}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            {/* Removed the Call button from mobile menu drawer */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}