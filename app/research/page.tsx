'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ProductCard } from '@/components/product-card'
import { FilterPanel } from '@/components/filter-panel'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Download, Grid, List } from 'lucide-react'
import { initializeMockData } from '@/lib/mock-data'
import { productStorage } from '@/lib/storage'
import { Product, FilterOptions } from '@/lib/types'
import { exportToCSV, prepareProductsForExport } from '@/lib/export'

const defaultFilters: FilterOptions = {
  priceRange: [0, 200],
  reviewRange: [0, 10000],
  platform: [],
  category: [],
  competitionLevel: [],
  minScore: 0,
}

export default function ResearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('score')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  useEffect(() => {
    initializeMockData()
    const allProducts = productStorage.getAll()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
  }, [])
  
  useEffect(() => {
    applyFilters()
  }, [filters, searchQuery, sortBy, products])
  
  const applyFilters = () => {
    let filtered = [...products]
    
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    filtered = filtered.filter(p =>
      p.price >= filters.priceRange[0] &&
      p.price <= filters.priceRange[1] &&
      p.reviewCount >= filters.reviewRange[0] &&
      p.reviewCount <= filters.reviewRange[1] &&
      p.winningScore >= filters.minScore
    )
    
    if (filters.platform.length > 0) {
      filtered = filtered.filter(p => filters.platform.includes(p.platform))
    }
    
    if (filters.category.length > 0) {
      filtered = filtered.filter(p => filters.category.includes(p.category))
    }
    
    switch (sortBy) {
      case 'score':
        filtered.sort((a, b) => b.winningScore - a.winningScore)
        break
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'sales':
        filtered.sort((a, b) => b.estimatedSales - a.estimatedSales)
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => a.listingAge - b.listingAge)
        break
    }
    
    setFilteredProducts(filtered)
  }
  
  const handleExport = () => {
    const exportData = prepareProductsForExport(filteredProducts)
    exportToCSV(exportData, 'pod-products')
  }
  
  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setSearchQuery('')
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Product Research</h1>
            <p className="text-muted-foreground">Discover winning POD products across marketplaces</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />
            </aside>
            
            <div className="flex-1">
              <div className="mb-6 space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products, sellers, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleExport} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Highest Score</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                        <SelectItem value="sales">Most Sales</SelectItem>
                        <SelectItem value="price-low">Lowest Price</SelectItem>
                        <SelectItem value="price-high">Highest Price</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <p className="text-sm text-muted-foreground">
                      {filteredProducts.length} products found
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your filters</p>
                  <Button onClick={handleResetFilters} className="mt-4 bg-transparent" variant="outline">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
