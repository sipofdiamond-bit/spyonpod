'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, EyeOff, ExternalLink, Star, Package, DollarSign } from 'lucide-react'
import { initializeMockData } from '@/lib/mock-data'
import { competitorStorage } from '@/lib/storage'
import { CompetitorShop } from '@/lib/types'

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorShop[]>([])
  const [filteredCompetitors, setFilteredCompetitors] = useState<CompetitorShop[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    initializeMockData()
    loadCompetitors()
  }, [])
  
  const loadCompetitors = () => {
    const allCompetitors = competitorStorage.getAll()
    setCompetitors(allCompetitors)
    setFilteredCompetitors(allCompetitors)
  }
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredCompetitors(
        competitors.filter(c =>
          c.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.platform.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredCompetitors(competitors)
    }
  }, [searchQuery, competitors])
  
  const handleToggleMonitor = (id: string) => {
    competitorStorage.toggleMonitor(id)
    loadCompetitors()
  }
  
  const monitoredCount = competitors.filter(c => c.isMonitored).length
  const avgRevenue = Math.round(
    competitors.reduce((acc, c) => acc + c.estimatedRevenue, 0) / competitors.length || 0
  )
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Competitor Spy</h1>
            <p className="text-muted-foreground">Monitor and analyze competitor shops across platforms</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Competitors
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{competitors.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all platforms
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monitored Shops
                </CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitoredCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active monitoring
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${avgRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated monthly
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Competitor Shops</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shops or platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCompetitors.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{competitor.shopName}</h3>
                        <Badge variant="secondary">{competitor.platform}</Badge>
                        {competitor.isMonitored && (
                          <Badge className="bg-primary/10 text-primary">Monitoring</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Products
                          </p>
                          <p className="font-semibold">{competitor.productsCount}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Rating
                          </p>
                          <p className="font-semibold">{competitor.avgRating} ⭐</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Reviews</p>
                          <p className="font-semibold">{competitor.totalReviews.toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Revenue
                          </p>
                          <p className="font-semibold">${competitor.estimatedRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={competitor.isMonitored ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleMonitor(competitor.id)}
                      >
                        {competitor.isMonitored ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Unmonitor
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Monitor
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredCompetitors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No competitors found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
