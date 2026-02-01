'use client'

import { Product } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, TrendingUp, TrendingDown, Minus, ExternalLink, Star } from 'lucide-react'
import { favoriteStorage } from '@/lib/storage'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onToggleFavorite?: () => void
}

export function ProductCard({ product, onToggleFavorite }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(favoriteStorage.isFavorite(product.id))
  
  const handleToggleFavorite = () => {
    favoriteStorage.toggle(product.id)
    setIsFavorite(favoriteStorage.isFavorite(product.id))
    onToggleFavorite?.()
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-orange-500'
  }
  
  const getTrendIcon = () => {
    if (product.trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />
    if (product.trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-secondary">
        <img 
          src={product.imageUrl || "/placeholder.svg"} 
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
            isFavorite && "text-red-500"
          )}
          onClick={handleToggleFavorite}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
        <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm">
          {product.platform}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount} reviews)
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-semibold">${product.price}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Est. Sales</p>
            <p className="font-semibold">{product.estimatedSales.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Seller</p>
            <p className="font-medium truncate">{product.seller}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Age</p>
            <p className="font-medium">{product.listingAge}d</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Winning Score</p>
            <p className={cn("text-2xl font-bold", getScoreColor(product.winningScore))}>
              {product.winningScore}
            </p>
          </div>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
