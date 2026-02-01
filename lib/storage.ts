import { Product, Keyword, CompetitorShop, TrendData, SavedSearch } from './types'

const STORAGE_KEYS = {
  PRODUCTS: 'pod_spy_products',
  KEYWORDS: 'pod_spy_keywords',
  COMPETITORS: 'pod_spy_competitors',
  TRENDS: 'pod_spy_trends',
  SAVED_SEARCHES: 'pod_spy_saved_searches',
  FAVORITES: 'pod_spy_favorites',
  MONITORED_SHOPS: 'pod_spy_monitored_shops',
}

// Generic storage helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Product operations
export const productStorage = {
  getAll: (): Product[] => getFromStorage(STORAGE_KEYS.PRODUCTS, []),
  
  save: (products: Product[]): void => {
    setToStorage(STORAGE_KEYS.PRODUCTS, products)
  },
  
  add: (product: Product): void => {
    const products = productStorage.getAll()
    products.push(product)
    productStorage.save(products)
  },
  
  update: (id: string, updates: Partial<Product>): void => {
    const products = productStorage.getAll()
    const index = products.findIndex(p => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates }
      productStorage.save(products)
    }
  },
  
  delete: (id: string): void => {
    const products = productStorage.getAll()
    productStorage.save(products.filter(p => p.id !== id))
  },
}

// Keyword operations
export const keywordStorage = {
  getAll: (): Keyword[] => getFromStorage(STORAGE_KEYS.KEYWORDS, []),
  
  save: (keywords: Keyword[]): void => {
    setToStorage(STORAGE_KEYS.KEYWORDS, keywords)
  },
  
  add: (keyword: Keyword): void => {
    const keywords = keywordStorage.getAll()
    keywords.push(keyword)
    keywordStorage.save(keywords)
  },
}

// Competitor operations
export const competitorStorage = {
  getAll: (): CompetitorShop[] => getFromStorage(STORAGE_KEYS.COMPETITORS, []),
  
  save: (competitors: CompetitorShop[]): void => {
    setToStorage(STORAGE_KEYS.COMPETITORS, competitors)
  },
  
  toggleMonitor: (id: string): void => {
    const competitors = competitorStorage.getAll()
    const index = competitors.findIndex(c => c.id === id)
    if (index !== -1) {
      competitors[index].isMonitored = !competitors[index].isMonitored
      competitorStorage.save(competitors)
    }
  },
}

// Trend operations
export const trendStorage = {
  getAll: (): TrendData[] => getFromStorage(STORAGE_KEYS.TRENDS, []),
  
  save: (trends: TrendData[]): void => {
    setToStorage(STORAGE_KEYS.TRENDS, trends)
  },
}

// Saved searches
export const savedSearchStorage = {
  getAll: (): SavedSearch[] => getFromStorage(STORAGE_KEYS.SAVED_SEARCHES, []),
  
  save: (searches: SavedSearch[]): void => {
    setToStorage(STORAGE_KEYS.SAVED_SEARCHES, searches)
  },
  
  add: (search: SavedSearch): void => {
    const searches = savedSearchStorage.getAll()
    searches.push(search)
    savedSearchStorage.save(searches)
  },
  
  delete: (id: string): void => {
    const searches = savedSearchStorage.getAll()
    savedSearchStorage.save(searches.filter(s => s.id !== id))
  },
}

// Favorites
export const favoriteStorage = {
  getAll: (): string[] => getFromStorage(STORAGE_KEYS.FAVORITES, []),
  
  toggle: (productId: string): void => {
    const favorites = favoriteStorage.getAll()
    const index = favorites.indexOf(productId)
    if (index === -1) {
      favorites.push(productId)
    } else {
      favorites.splice(index, 1)
    }
    setToStorage(STORAGE_KEYS.FAVORITES, favorites)
  },
  
  isFavorite: (productId: string): boolean => {
    return favoriteStorage.getAll().includes(productId)
  },
}
