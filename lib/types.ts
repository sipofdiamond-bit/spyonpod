export interface Product {
  id: string
  title: string
  price: number
  platform: 'Etsy' | 'Amazon' | 'Redbubble' | 'Teespring'
  imageUrl: string
  seller: string
  rating: number
  reviewCount: number
  estimatedSales: number
  listingAge: number
  category: string
  winningScore: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

export interface Keyword {
  id: string
  keyword: string
  searchVolume: number
  difficulty: number
  competition: number
  trend: number[]
  relatedKeywords: string[]
  cpc?: number
}

export interface CompetitorShop {
  id: string
  shopName: string
  platform: string
  productsCount: number
  avgRating: number
  totalReviews: number
  estimatedRevenue: number
  isMonitored: boolean
}

export interface TrendData {
  id: string
  niche: string
  growthRate: number
  searchDemand: number
  competitionLevel: number
  seasonalityScore: number
  avgPrice: number
  trendDirection: 'rising' | 'falling' | 'stable'
  products: Product[]
}

export interface FilterOptions {
  priceRange: [number, number]
  reviewRange: [number, number]
  platform: string[]
  category: string[]
  competitionLevel: string[]
  minScore: number
}

export interface SavedSearch {
  id: string
  query: string
  filters: FilterOptions
  timestamp: string
}
