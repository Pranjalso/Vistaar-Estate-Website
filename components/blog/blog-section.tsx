'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeading } from '@/components/common/section-heading'
import { BlogCard } from './blog-card'
import { BLOG_POSTS } from '@/data/blog'

export function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section id="blog" className="scroll-mt-32 bg-background px-5 pt-32 pb-24 sm:px-6 sm:pt-36 lg:pt-40">
      <div className="mx-auto max-w-6xl">
        {/* Header - Desktop: Title left, buttons right */}
        <div className="hidden sm:flex sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Journal"
            title="Insights from the world of luxury"
            highlight="luxury"
            description="Perspectives on design, investment, and the art of exceptional living."
          />
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous articles"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-navy shadow-luxury transition-all hover:border-gold/60 hover:text-gold-dark"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next articles"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-navy shadow-luxury transition-all hover:border-gold/60 hover:text-gold-dark"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Header - Mobile: Title only */}
        <div className="sm:hidden">
          <SectionHeading
            align="left"
            eyebrow="Journal"
            title="Insights from the world of luxury"
            highlight="luxury"
            description="Perspectives on design, investment, and the art of exceptional living."
          />
        </div>

        {/* Blog Cards with Mobile Navigation */}
        <div className="relative mt-12">
          <div
            ref={scrollRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
          >
            {BLOG_POSTS.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Mobile Navigation Buttons - Positioned on the right side */}
          <div className="absolute right-0 top-0 -mt-14 flex items-center gap-2 sm:hidden">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous articles"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-white/90 text-navy shadow-lg backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-white hover:text-gold-dark"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next articles"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-white/90 text-navy shadow-lg backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-white hover:text-gold-dark"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}