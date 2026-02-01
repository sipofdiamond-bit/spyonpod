'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, TrendingUp, Star, Package, DollarSign, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CompetitorShop } from '@/lib/types'
import { generateMockCompetitors } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function CompetitorTracking() {
  const [competitors, setCompetitors] = useState<CompetitorShop[]>([])
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorShop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockCompetitors = generateMockCompetitors(20)
      setCompetitors(mockCompetitors)
      setSelectedCompetitor(mockCompetitors[0])
      setLoading(false)
    }, 500)
  }, [])

  const toggleMonitoring = (shopId: string) => {
    setCompetitors(competitors.map(comp =>
      comp.id === shopId ? { ...comp, isMonitored: !comp.isMonitored } : comp
    ))
  }

  const performanceData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 20000) + 5000,
    products: Math.floor(Math.random() * 50) + 20,
  }))

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
        {competitors.map((competitor) => (
          <Card
            key={competitor.id}
            className={cn(
              'cursor-pointer hover:shadow-lg transition-shadow',
              competitor.isMonitored && 'border-primary'
            )}
            onClick={() => setSelectedCompetitor(competitor)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{competitor.shopName}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {competitor.platform}
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant={competitor.isMonitored ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMonitoring(competitor.id)
                  }}
                >
                  {competitor.isMonitored ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Products
                  </p>
                  <p className="text-sm font-bold">{competitor.productsCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Rating
                  </p>
                  <p className="text-sm font-bold">{competitor.avgRating.toFixed(1)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3" />
                  Est. Revenue
                </p>
                <p className="text-lg font-bold text-accent">
                  ${competitor.estimatedRevenue.toLocaleString()}
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Reviews</span>
                  <span className="font-medium">{competitor.totalReviews.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCompetitor && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedCompetitor.shopName} - Analytics</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Performance metrics and product insights
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Shop
                </Button>
                <Button
                  variant={selectedCompetitor.isMonitored ? 'default' : 'outline'}
                  onClick={() => toggleMonitoring(selectedCompetitor.id)}
                >
                  {selectedCompetitor.isMonitored ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Monitoring
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Monitor
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Total Products
                </p>
                <p className="text-2xl font-bold">{selectedCompetitor.productsCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Avg Rating
                </p>
                <p className="text-2xl font-bold">{selectedCompetitor.avgRating.toFixed(1)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Total Reviews
                </p>
                <p className="text-2xl font-bold">{selectedCompetitor.totalReviews.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Est. Revenue
                </p>
                <p className="text-2xl font-bold text-accent">
                  ${selectedCompetitor.estimatedRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Revenue Trend (12 Months)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Key Metrics</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Customer Satisfaction</span>
                      <span className="font-medium">
                        {Math.round((selectedCompetitor.avgRating / 5) * 100)}%
                      </span>
                    </div>
                    <Progress value={(selectedCompetitor.avgRating / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Market Penetration</span>
                      <span className="font-medium">
                        {Math.round((selectedCompetitor.productsCount / 500) * 100)}%
                      </span>
                    </div>
                    <Progress value={(selectedCompetitor.productsCount / 500) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Competitive Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-muted-foreground">Avg Product Price</span>
                    <span className="font-medium">$29.99</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-muted-foreground">Review Rate</span>
                    <span className="font-medium">
                      {(selectedCompetitor.totalReviews / selectedCompetitor.productsCount).toFixed(1)} / product
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-muted-foreground">Revenue / Product</span>
                    <span className="font-medium">
                      ${Math.round(selectedCompetitor.estimatedRevenue / selectedCompetitor.productsCount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
