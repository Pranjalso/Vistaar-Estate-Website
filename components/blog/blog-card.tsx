'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import type { BlogPost } from '@/types'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxury transition-shadow duration-500 hover:shadow-[0_36px_80px_-30px_rgba(26,26,46,0.4)] sm:w-[360px]"
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.image || '/placeholder.svg'}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-navy shadow-gold-glow">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime}
            </span>
          </div>
          <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-navy transition-colors group-hover:text-gold-dark">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4 flex flex-1 items-end justify-between">
            <span className="text-xs font-medium text-navy/70">By {post.author}</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-gold-dark">
              Read More
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
