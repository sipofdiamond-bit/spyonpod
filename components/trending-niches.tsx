'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Flame, DollarSign, Target, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { TrendData } from '@/lib/types'
import { generateMockTrends } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function TrendingNiches() {
  const [trends, setTrends] = useState<TrendData[]>([])
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockTrends = generateMockTrends(12)
      setTrends(mockTrends)
      setSelectedTrend(mockTrends[0])
      setLoading(false)
    }, 500)
  }, [])

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'rising':
        return 'text-green-500'
      case 'falling':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'rising':
        return <TrendingUp className="h-4 w-4" />
      case 'falling':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Flame className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-secondary rounded w-2/3" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-3 bg-secondary rounded" />
              <div className="h-3 bg-secondary rounded w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map((trend) => (
          <Card
            key={trend.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedTrend(trend)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{trend.niche}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={getTrendColor(trend.trendDirection)}
                    >
                      {getTrendIcon(trend.trendDirection)}
                      <span className="ml-1 capitalize">{trend.trendDirection}</span>
                    </Badge>
                  </div>
                </div>
                <div className={cn('font-bold text-xl', getTrendColor(trend.trendDirection))}>
                  {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Search Demand</p>
                  <p className="text-sm font-bold">
                    {trend.searchDemand.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Price</p>
                  <p className="text-sm font-bold">${trend.avgPrice.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Competition</span>
                  <span className="font-medium">{trend.competitionLevel}/100</span>
                </div>
                <Progress value={trend.competitionLevel} className="h-1" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Seasonality</span>
                  <span className="font-medium">{trend.seasonalityScore}/100</span>
                </div>
                <Progress value={trend.seasonalityScore} className="h-1" />
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Products
                </span>
                <span className="font-medium">{trend.products.length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTrend && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedTrend.niche} - Deep Dive</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Detailed analysis and top products in this niche
                </p>
              </div>
              <Button>Export Report</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Growth Rate
                </p>
                <p className="text-2xl font-bold text-primary">
                  {selectedTrend.growthRate > 0 ? '+' : ''}{selectedTrend.growthRate}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Search Demand
                </p>
                <p className="text-2xl font-bold">
                  {selectedTrend.searchDemand.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Avg Price
                </p>
                <p className="text-2xl font-bold text-accent">
                  ${selectedTrend.avgPrice.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Total Products
                </p>
                <p className="text-2xl font-bold">
                  {selectedTrend.products.length}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Top Products in This Niche</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTrend.products.slice(0, 6).map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-32 bg-secondary relative">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur">
                        {product.platform}
                      </Badge>
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <p className="font-medium text-sm line-clamp-2">{product.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">${product.price}</span>
                        <Badge variant="outline" className="text-xs">
                          Score: {product.winningScore}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
