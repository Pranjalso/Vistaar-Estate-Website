import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { BLOG_POSTS, getPostBySlug } from '@/data/blog'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'
import { FloatingActions } from '@/components/common/floating-actions'
import { SITE } from '@/constants/site'

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Article Not Found' }
  return {
    title: `${post.title} | ${SITE.name} Journal`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {/* Hero */}
        <section className="relative h-[62vh] min-h-[440px] w-full overflow-hidden">
          <img
            src={post.image || '/placeholder.svg'}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-4xl px-6 pb-14">
              <span className="inline-block rounded-full bg-gold-gradient px-4 py-1 text-xs font-semibold text-navy shadow-gold-glow">
                {post.category}
              </span>
              <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-balance text-light md:text-6xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-light/80">
                <span className="flex items-center gap-2">
                  <User className="size-4 text-gold" />
                  {post.author}, {post.authorRole}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="size-4 text-gold" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4 text-gold" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <article className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/#blog"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-gold-dark"
          >
            <ArrowLeft className="size-4" />
            Back to Journal
          </Link>

          <p className="font-serif text-2xl leading-relaxed text-navy">{post.excerpt}</p>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Related */}
        <section className="border-t border-border/60 bg-cream/60 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-10 font-serif text-3xl font-semibold text-navy">Continue Reading</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-luxury">
                    <img
                      src={r.image || '/placeholder.svg'}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-4 block text-xs font-semibold uppercase tracking-widest text-gold-dark">
                    {r.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-navy transition-colors group-hover:text-gold-dark">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
