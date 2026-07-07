export type PropertyStatus = 'Ready to Move' | 'Under Construction' | 'New Launch'

export interface Property {
  id: string
  name: string
  location: string
  city: string
  price: number // in INR
  priceLabel: string
  configuration: string // e.g. "3 BHK", "4 BHK", "Villa"
  configKey: string // normalized key for filtering: "2bhk" | "3bhk" | "4bhk" | "villa"
  status: PropertyStatus
  area: string
  possession: string
  description: string
  longDescription: string
  amenities: string[]
  specs: { label: string; value: string }[]
  highlights: string[]
  images: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: string
  date: string
  author: string
  authorRole: string
  readTime: string
  image: string
}

export interface FilterState {
  configuration: string
  priceRange: string
  location: string
}
