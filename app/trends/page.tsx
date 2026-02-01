'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import { initializeMockData } from '@/lib/mock-data'
import { trendStorage } from '@/lib/storage'
import { TrendData } from '@/lib/types'
import { ProductCard } from '@/components/product-card'

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([])
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null)
  
  useEffect(() => {
    initializeMockData()
    const allTrends = trendStorage.getAll()
    setTrends(allTrends)
    if (allTrends.length > 0) {
      setSelectedTrend(allTrends[0])
    }
  }, [])
  
  const getTrendIcon = (direction: string) => {
    if (direction === 'rising') return <TrendingUp className="h-5 w-5 text-green-500" />
    if (direction === 'falling') return <TrendingDown className="h-5 w-5 text-red-500" />
    return <Minus className="h-5 w-5 text-muted-foreground" />
  }
  
  const getTrendColor = (direction: string) => {
    if (direction === 'rising') return 'text-green-500 bg-green-500/10'
    if (direction === 'falling') return 'text-red-500 bg-red-500/10'
    return 'text-muted-foreground bg-secondary'
  }
  
  const getGrowthColor = (growth: number) => {
    if (growth > 50) return 'text-green-500'
    if (growth > 0) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  const risingTrends = trends.filter(t => t.trendDirection === 'rising').length
  const avgGrowth = Math.round(
    trends.reduce((acc, t) => acc + t.growthRate, 0) / trends.length || 0
  )
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Trending Niches</h1>
            <p className="text-muted-foreground">Discover emerging opportunities in POD markets</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rising Trends
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{risingTrends}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Niches with growth
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Growth Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgGrowth}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all niches
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Niches
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trends.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Being tracked
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Niche Trends</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[calc(100vh-400px)] overflow-auto">
                  {trends.map((trend) => (
                    <div
                      key={trend.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedTrend?.id === trend.id
                          ? 'bg-primary/10 border border-primary'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => setSelectedTrend(trend)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{trend.niche}</h3>
                        {getTrendIcon(trend.trendDirection)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Growth Rate</span>
                          <span className={`font-bold ${getGrowthColor(trend.growthRate)}`}>
                            {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Search Demand</span>
                          <span className="font-medium">{trend.searchDemand.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Competition</span>
                          <Badge variant="secondary" className="text-xs">
                            {trend.competitionLevel < 40 ? 'Low' : trend.competitionLevel < 70 ? 'Medium' : 'High'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {selectedTrend ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3">
                            {selectedTrend.niche}
                            <Badge className={getTrendColor(selectedTrend.trendDirection)}>
                              {selectedTrend.trendDirection}
                            </Badge>
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Growth Rate</p>
                          <p className={`text-2xl font-bold ${getGrowthColor(selectedTrend.growthRate)}`}>
                            {selectedTrend.growthRate > 0 ? '+' : ''}{selectedTrend.growthRate}%
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Search Demand</p>
                          <p className="text-2xl font-bold">{selectedTrend.searchDemand.toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Competition</p>
                          <p className="text-2xl font-bold">{selectedTrend.competitionLevel}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Seasonality</p>
                          <p className="text-2xl font-bold">{selectedTrend.seasonalityScore}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Trending Products</CardTitle>
                        <Button variant="ghost" size="sm">
                          View All
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTrend.products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trend Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedTrend.growthRate > 50 && (
                        <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm mb-1 text-green-500">Rapid Growth</h4>
                            <p className="text-sm text-muted-foreground">
                              This niche is experiencing exceptional growth. Early entry could capture significant market share.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedTrend.competitionLevel < 50 && (
                        <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm mb-1 text-primary">Low Competition</h4>
                            <p className="text-sm text-muted-foreground">
                              Relatively low competition makes this an attractive opportunity for new sellers.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedTrend.seasonalityScore > 70 && (
                        <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <Calendar className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm mb-1 text-yellow-500">Seasonal Opportunity</h4>
                            <p className="text-sm text-muted-foreground">
                              High seasonality score suggests timing is important. Plan inventory and marketing accordingly.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Recommendation</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedTrend.growthRate > 20 && selectedTrend.competitionLevel < 60
                              ? 'Strong opportunity! High growth with manageable competition. Consider entering this niche soon.'
                              : selectedTrend.growthRate > 50
                              ? 'Hot trend! Act quickly to capitalize on this rapidly growing market.'
                              : selectedTrend.competitionLevel < 40
                              ? 'Good entry point with low competition. Focus on unique designs to stand out.'
                              : 'Monitor this niche closely. Look for specific sub-niches with less competition.'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Select a niche to view trend details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
