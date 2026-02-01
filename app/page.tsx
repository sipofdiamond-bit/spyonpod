'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Eye, BarChart3, Download, Bookmark, Filter, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sidebar } from '@/components/sidebar'
import { ProductGrid } from '@/components/product-grid'
import { KeywordAnalysis } from '@/components/keyword-analysis'
import { TrendingNiches } from '@/components/trending-niches'
import { CompetitorTracking } from '@/components/competitor-tracking'
import { FilterPanel } from '@/components/filter-panel'
import { DashboardStats } from '@/components/dashboard-stats'
import { initializeMockData } from '@/lib/mock-data'
import { FilterOptions } from '@/lib/types'

export default function PODSpyTool() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100],
    reviewRange: [0, 5000],
    platform: [],
    category: [],
    competitionLevel: [],
    minScore: 0
  })

  useEffect(() => {
    initializeMockData()
  }, [])

  const handleSearch = () => {
    // Search functionality handled by child components
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, keywords, or niches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-background"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {showFilters && (
            <div className="mb-6">
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Target className="h-4 w-4" />
                Product Research
              </TabsTrigger>
              <TabsTrigger value="keywords" className="gap-2">
                <Search className="h-4 w-4" />
                Keyword Analysis
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Niches
              </TabsTrigger>
              <TabsTrigger value="competitors" className="gap-2">
                <Eye className="h-4 w-4" />
                Competitor Spy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <DashboardStats />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Product Research</h2>
                  <p className="text-muted-foreground">
                    Discover winning POD products from top marketplaces
                  </p>
                </div>
              </div>
              <ProductGrid searchQuery={searchQuery} filters={filters} />
            </TabsContent>

            <TabsContent value="keywords" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Keyword Analysis</h2>
                  <p className="text-muted-foreground">
                    Analyze search volume, competition, and trends
                  </p>
                </div>
              </div>
              <KeywordAnalysis searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Trending Niches</h2>
                  <p className="text-muted-foreground">
                    Identify hot niches with growing demand
                  </p>
                </div>
              </div>
              <TrendingNiches />
            </TabsContent>

            <TabsContent value="competitors" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Competitor Tracking</h2>
                  <p className="text-muted-foreground">
                    Monitor competitor shops and products
                  </p>
                </div>
              </div>
              <CompetitorTracking />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
