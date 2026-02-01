'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { FilterOptions } from '@/lib/types'
import { RotateCcw } from 'lucide-react'

const platforms = ['Etsy', 'Amazon', 'Redbubble', 'Teespring']
const categories = ['Apparel', 'Home Decor', 'Accessories', 'Stationery', 'Mugs', 'Phone Cases', 'Wall Art', 'Stickers']
const competitionLevels = ['Low', 'Medium', 'High']

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
}

export function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }
  
  const handleReviewChange = (value: number[]) => {
    onFiltersChange({ ...filters, reviewRange: [value[0], value[1]] })
  }
  
  const handleScoreChange = (value: number[]) => {
    onFiltersChange({ ...filters, minScore: value[0] })
  }
  
  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platform.includes(platform)
      ? filters.platform.filter(p => p !== platform)
      : [...filters.platform, platform]
    onFiltersChange({ ...filters, platform: newPlatforms })
  }
  
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category]
    onFiltersChange({ ...filters, category: newCategories })
  }
  
  const handleCompetitionToggle = (level: string) => {
    const newLevels = filters.competitionLevel.includes(level)
      ? filters.competitionLevel.filter(l => l !== level)
      : [...filters.competitionLevel, level]
    onFiltersChange({ ...filters, competitionLevel: newLevels })
  }

  const handleReset = () => {
    onFiltersChange({
      priceRange: [0, 100],
      reviewRange: [0, 5000],
      platform: [],
      category: [],
      competitionLevel: [],
      minScore: 0
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm mb-3 block">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={200}
            step={5}
            className="mb-2"
          />
        </div>
        
        <div>
          <Label className="text-sm mb-3 block">Review Count: {filters.reviewRange[0]} - {filters.reviewRange[1]}</Label>
          <Slider
            value={filters.reviewRange}
            onValueChange={handleReviewChange}
            min={0}
            max={10000}
            step={100}
            className="mb-2"
          />
        </div>
        
        <div>
          <Label className="text-sm mb-3 block">Min. Winning Score: {filters.minScore}</Label>
          <Slider
            value={[filters.minScore]}
            onValueChange={handleScoreChange}
            min={0}
            max={100}
            step={5}
            className="mb-2"
          />
        </div>
        
        <div>
          <Label className="text-sm mb-3 block">Platform</Label>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={filters.platform.includes(platform)}
                  onCheckedChange={() => handlePlatformToggle(platform)}
                />
                <label
                  htmlFor={`platform-${platform}`}
                  className="text-sm cursor-pointer"
                >
                  {platform}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm mb-3 block">Category</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm mb-3 block">Competition Level</Label>
          <div className="space-y-2">
            {competitionLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`competition-${level}`}
                  checked={filters.competitionLevel.includes(level)}
                  onCheckedChange={() => handleCompetitionToggle(level)}
                />
                <label
                  htmlFor={`competition-${level}`}
                  className="text-sm cursor-pointer"
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
