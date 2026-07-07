import type { BlogPost } from '@/types'

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'defining-modern-luxury-living',
    title: 'Defining Modern Luxury Living in 2026',
    excerpt:
      "From biophilic design to wellness architecture, discover the principles shaping the world's most desirable homes.",
    category: 'Design',
    date: 'June 12, 2026',
    author: 'Isabella Moreau',
    authorRole: 'Head of Design',
    readTime: '6 min read',
    image: '/images/blog-1.png',
    content: [
      'Luxury has quietly redefined itself. Where opulence once meant excess, today it means intention — spaces designed around light, air, and the rhythms of the people who live in them.',
      'The most sought-after residences of 2026 embrace biophilic design, weaving nature into architecture through planted terraces, natural materials, and expansive glass that dissolves the line between inside and out.',
      'Wellness has become non-negotiable. Home spas, cold plunge pools, meditation rooms, and circadian lighting systems are no longer amenities but expectations for the discerning buyer.',
      'At the core of it all is craftsmanship. Hand-finished stone, bespoke millwork, and materials sourced from a single quarry are the details that separate a beautiful home from an unforgettable one.',
    ],
  },
  {
    slug: 'waterfront-investment-guide',
    title: "The Discerning Buyer's Guide to Waterfront Investment",
    excerpt:
      'Why coastal and marina-front properties continue to outperform, and what to look for before you buy.',
    category: 'Investment',
    date: 'May 28, 2026',
    author: 'Julian Vance',
    authorRole: 'Managing Partner',
    readTime: '8 min read',
    image: '/images/blog-3.png',
    content: [
      'Waterfront real estate has long been the crown jewel of luxury portfolios, and 2026 is no exception. Scarcity, lifestyle, and enduring demand continue to drive appreciation well above the broader market.',
      'The fundamentals matter more than ever. Elevation, shoreline stability, and private water access are the differentiators that protect long-term value in a changing climate.',
      'Beyond the numbers, waterfront living offers something no spreadsheet can capture — the daily privilege of light on water, open horizons, and a sense of retreat within reach of the city.',
      'Our advice to buyers is simple: prioritize provenance and permanence. A well-positioned, well-built waterfront home is among the most resilient assets you can hold.',
    ],
  },
  {
    slug: 'art-of-the-private-showing',
    title: 'The Art of the Private Showing',
    excerpt:
      'How white-glove service transforms the experience of buying an extraordinary home.',
    category: 'Lifestyle',
    date: 'May 9, 2026',
    author: 'Camille Laurent',
    authorRole: 'Client Director',
    readTime: '5 min read',
    image: '/images/blog-2.png',
    content: [
      'Purchasing an exceptional home should feel as considered as the residence itself. The private showing is where that experience begins.',
      'We curate each viewing around the client — the time of day when the light is most flattering, the route that reveals the neighborhood at its best, and the details that speak to how they intend to live.',
      'Discretion is paramount. Our clients value privacy, and every showing is arranged with confidentiality, security, and seamless logistics as a given.',
      'Ultimately, the private showing is about storytelling. A home is not a set of square footage and finishes; it is a future, and our role is to help our clients see themselves within it.',
    ],
  },
]

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
