import { Product, Keyword, CompetitorShop, TrendData } from './types'

const categories = ['Apparel', 'Home Decor', 'Accessories', 'Stationery', 'Mugs', 'Phone Cases', 'Wall Art', 'Stickers']
const platforms = ['Etsy', 'Amazon', 'Redbubble', 'Teespring'] as const
const trends = ['up', 'down', 'stable'] as const

// Product titles for different categories
const productTitles = [
  'Vintage Floral T-Shirt Design',
  'Motivational Quote Wall Art Print',
  'Custom Pet Portrait Mug',
  'Boho Moon Phase Phone Case',
  'Minimalist Mountain Sticker Pack',
  'Retro Gaming Console Poster',
  'Personalized Name Tote Bag',
  'Watercolor Sunset Canvas Print',
  'Coffee Lover Funny Mug',
  'Astrology Zodiac Sign Shirt',
  'Nature Photography Wall Decor',
  'Vintage Camera Illustration Print',
  'Succulent Plant Sticker Set',
  'Geometric Abstract Art Poster',
  'Inspirational Desk Notepad',
  'Cute Animal Illustration Mug',
  'Adventure Awaits Travel Poster',
  'Mandala Pattern Phone Case',
  'Retro Sunset Graphic Tee',
  'Botanical Line Art Print',
]

const keywords = [
  'funny coffee mug',
  'motivational wall art',
  'custom pet portrait',
  'vintage t-shirt design',
  'minimalist poster',
  'personalized gift',
  'boho home decor',
  'retro gaming',
  'watercolor print',
  'astrology shirt',
  'nature photography',
  'geometric art',
  'plant sticker',
  'travel poster',
  'inspirational quote',
]

const shopNames = [
  'CreativeStudio',
  'ArtisanDesigns',
  'VintageVibes',
  'ModernPrints',
  'CozyCreations',
  'UrbanArtistry',
  'BohoBoutique',
  'RetroRevival',
  'NatureNest',
  'MinimalMerch',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateMockProducts(count: number = 50): Product[] {
  const products: Product[] = []
  
  for (let i = 0; i < count; i++) {
    const reviewCount = randomInt(10, 5000)
    const rating = randomFloat(3.5, 5)
    const price = randomFloat(15, 75)
    const estimatedSales = randomInt(50, 10000)
    const listingAge = randomInt(1, 365)
    
    // Calculate winning score based on various factors
    const reviewGrowth = reviewCount / (listingAge || 1)
    const ratingScore = (rating / 5) * 100
    const salesScore = Math.min((estimatedSales / 100), 100)
    const competitionScore = randomInt(20, 80)
    const winningScore = Math.round(
      (reviewGrowth * 0.2 + ratingScore * 0.3 + salesScore * 0.3 + competitionScore * 0.2)
    )
    
    products.push({
      id: `prod-${i + 1}`,
      title: randomChoice(productTitles),
      price: parseFloat(price.toFixed(2)),
      platform: randomChoice(platforms),
      imageUrl: `https://placehold.co/400x400?text=POD+Product+${i + 1}`,
      seller: randomChoice(shopNames),
      rating: parseFloat(rating.toFixed(1)),
      reviewCount,
      estimatedSales,
      listingAge,
      category: randomChoice(categories),
      winningScore: Math.min(Math.max(winningScore, 10), 100),
      trend: randomChoice(trends),
      lastUpdated: new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return products
}

export function generateMockKeywords(count: number = 30): Keyword[] {
  const mockKeywords: Keyword[] = []
  
  for (let i = 0; i < count; i++) {
    const searchVolume = randomInt(500, 50000)
    const difficulty = randomInt(20, 90)
    const competition = randomInt(30, 95)
    
    // Generate trend data (12 months)
    const trend = Array.from({ length: 12 }, () => randomInt(500, searchVolume))
    
    // Generate related keywords
    const relatedKeywords = Array.from({ length: 5 }, (_, j) => 
      `${keywords[i % keywords.length]} ${j + 1}`
    )
    
    mockKeywords.push({
      id: `kw-${i + 1}`,
      keyword: keywords[i % keywords.length],
      searchVolume,
      difficulty,
      competition,
      trend,
      relatedKeywords,
      cpc: randomFloat(0.5, 3),
    })
  }
  
  return mockKeywords
}

export function generateMockCompetitors(count: number = 20): CompetitorShop[] {
  const competitors: CompetitorShop[] = []
  
  for (let i = 0; i < count; i++) {
    competitors.push({
      id: `comp-${i + 1}`,
      shopName: shopNames[i % shopNames.length],
      platform: randomChoice(platforms),
      productsCount: randomInt(10, 500),
      avgRating: parseFloat(randomFloat(3.5, 5).toFixed(1)),
      totalReviews: randomInt(100, 10000),
      estimatedRevenue: randomInt(1000, 100000),
      isMonitored: false,
    })
  }
  
  return competitors
}

export function generateMockTrends(count: number = 10): TrendData[] {
  const trendData: TrendData[] = []
  
  const trendNiches = [
    'Custom Pet Portraits',
    'Vintage Aesthetic',
    'Motivational Quotes',
    'Minimalist Design',
    'Retro Gaming',
    'Boho Style',
    'Nature Photography',
    'Geometric Patterns',
    'Watercolor Art',
    'Astrology & Zodiac',
    'Coffee Culture',
    'Plant Lovers',
  ]
  
  for (let i = 0; i < count; i++) {
    const growthRate = randomFloat(-20, 150)
    const trendDirection = growthRate > 20 ? 'rising' : growthRate < -10 ? 'falling' : 'stable'
    
    trendData.push({
      id: `trend-${i + 1}`,
      niche: trendNiches[i % trendNiches.length],
      growthRate: parseFloat(growthRate.toFixed(1)),
      searchDemand: randomInt(1000, 50000),
      competitionLevel: randomInt(30, 90),
      seasonalityScore: randomInt(0, 100),
      avgPrice: parseFloat(randomFloat(15, 65).toFixed(2)),
      trendDirection,
      products: generateMockProducts(5),
    })
  }
  
  return trendData
}

// Initialize mock data if storage is empty
export function initializeMockData() {
  if (typeof window === 'undefined') return
  
  const hasData = localStorage.getItem('pod_spy_products')
  if (!hasData) {
    localStorage.setItem('pod_spy_products', JSON.stringify(generateMockProducts(100)))
    localStorage.setItem('pod_spy_keywords', JSON.stringify(generateMockKeywords(30)))
    localStorage.setItem('pod_spy_competitors', JSON.stringify(generateMockCompetitors(20)))
    localStorage.setItem('pod_spy_trends', JSON.stringify(generateMockTrends(10)))
  }
}
