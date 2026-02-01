'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ProductCard } from '@/components/product-card'
import { favoriteStorage, productStorage } from '@/lib/storage'
import { Product } from '@/lib/types'
import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  
  useEffect(() => {
    loadFavorites()
  }, [])
  
  const loadFavorites = () => {
    const favorites = favoriteStorage.getAll()
    const allProducts = productStorage.getAll()
    const filtered = allProducts.filter(p => favorites.includes(p.id))
    setFavoriteProducts(filtered)
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Favorites</h1>
            <p className="text-muted-foreground">Your saved products for quick access</p>
          </div>
          
          {favoriteProducts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No favorites yet. Start adding products!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} onToggleFavorite={loadFavorites} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
