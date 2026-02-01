'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, TrendingDown, Minus, Bookmark, ExternalLink, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Product, FilterOptions } from '@/lib/types'
import { generateMockProducts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  searchQuery: string
  filters: FilterOptions
}

export function ProductGrid({ searchQuery, filters }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState<string>('score')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let allProducts = generateMockProducts(50)
      
      // Apply search filter
      if (searchQuery) {
        allProducts = allProducts.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Apply filters
      allProducts = allProducts.filter(p => {
        if (filters.platform.length > 0 && !filters.platform.includes(p.platform)) return false
        if (filters.category.length > 0 && !filters.category.includes(p.category)) return false
        if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false
        if (p.reviewCount < filters.reviewRange[0] || p.reviewCount > filters.reviewRange[1]) return false
        if (p.winningScore < filters.minScore) return false
        return true
      })
      
      // Apply sorting
      allProducts.sort((a, b) => {
        switch (sortBy) {
          case 'score':
            return b.winningScore - a.winningScore
          case 'sales':
            return b.estimatedSales - a.estimatedSales
          case 'reviews':
            return b.reviewCount - a.reviewCount
          case 'price':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          default:
            return 0
        }
      })
      
      setProducts(allProducts)
      setLoading(false)
    }, 500)
  }, [searchQuery, filters, sortBy])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-secondary" />
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-secondary rounded" />
              <div className="h-4 bg-secondary rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {products.length} products
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Winning Score</SelectItem>
            <SelectItem value="sales">Estimated Sales</SelectItem>
            <SelectItem value="reviews">Review Count</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-secondary">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur">
                {product.platform}
              </Badge>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="font-medium line-clamp-2 text-sm leading-tight">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{product.seller}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">${product.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Winning Score</span>
                  <span className={cn('font-bold', getScoreColor(product.winningScore))}>
                    {product.winningScore}/100
                  </span>
                </div>
                <Progress value={product.winningScore} className="h-1" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                <div>
                  <p className="text-muted-foreground">Est. Sales</p>
                  <p className="font-medium">{product.estimatedSales.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    Trend {getTrendIcon(product.trend)}
                  </p>
                  <p className="font-medium">{product.listingAge}d old</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
