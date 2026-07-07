'use client'

import { motion } from 'framer-motion'
import { Award, Compass, Gem, HeartHandshake, Target } from 'lucide-react'
import { SectionHeading } from '@/components/common/section-heading'
import { CountUp } from '@/components/common/count-up'
import { CardFanCarousel } from '@/components/ui/card-fan-carousel'

const GALLERY = [
  { src: '/images/about-1.png', alt: 'Grand luxury living space' },
  { src: '/images/about-2.png', alt: 'Designer luxury kitchen' },
  { src: '/images/about-3.png', alt: 'Opulent master bedroom' },
  { src: '/images/about-4.png', alt: 'Spa-like luxury bathroom' },
  { src: '/images/about-5.png', alt: 'Rooftop terrace lounge' },
]

const STATS = [
  { value: 25, suffix: '+', label: 'Years of Experience' },
  { value: 4800, suffix: '+', label: 'Happy Clients' },
  { value: 320, suffix: '+', label: 'Completed Projects' },
  { value: 18, suffix: '', label: 'Cities Served' },
]

const VALUES = [
  { icon: Compass, title: 'Our Vision', text: 'To redefine luxury living through timeless design and uncompromising service.' },
  { icon: Target, title: 'Our Mission', text: 'To match discerning clients with residences that reflect their aspirations.' },
  { icon: Gem, title: 'Craftsmanship', text: 'Every home is vetted for quality, provenance, and enduring value.' },
  { icon: HeartHandshake, title: 'Trust', text: 'Discretion and integrity guide every relationship we build.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function About() {
  return (
    <section 
      id="about" 
      className="relative overflow-visible bg-cream/60 px-5 pb-24 sm:px-6"
      style={{
        paddingTop: 'clamp(160px, 22vh, 220px)',
        marginTop: 0,
        scrollMarginTop: 'clamp(120px, 16vh, 160px)'
      }}
    >
      {/* decorative accents */}
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        {/* Right: content (first on small screens) */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title="A legacy of extraordinary homes"
            highlight="extraordinary"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base leading-relaxed text-muted-foreground"
          >
            For over two decades, we have been the trusted name behind the world&apos;s most
            coveted addresses. We pair architectural connoisseurship with white-glove service to guide
            our clients through every chapter of ownership.
          </motion.p>

          {/* Values */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {VALUES.map((v) => (
              <motion.div
                variants={item}
                key={v.title}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm transition-shadow hover:shadow-luxury"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold-dark">
                  <v.icon className="h-5 w-5" />
                </span>
                <h4 className="mt-3 font-serif text-lg font-semibold text-navy">{v.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        {/* Left: fan carousel (second on small screens) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 lg:order-1"
        >
          <CardFanCarousel images={GALLERY} />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-16 max-w-6xl">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="flex items-center gap-1 font-serif text-4xl font-semibold text-navy sm:text-5xl">
                <Award className="mb-1 hidden h-6 w-6 text-gold sm:block" />
                <span className="text-gradient-gold">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </span>
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}