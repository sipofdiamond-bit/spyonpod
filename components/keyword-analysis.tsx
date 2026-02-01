'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Bookmark, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Keyword } from '@/lib/types'
import { generateMockKeywords } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface KeywordAnalysisProps {
  searchQuery: string
}

export function KeywordAnalysis({ searchQuery }: KeywordAnalysisProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchQuery) {
      setLoading(true)
      setTimeout(() => {
        const mockKeywords = generateMockKeywords(15)
        setKeywords(mockKeywords)
        setSelectedKeyword(mockKeywords[0])
        setLoading(false)
      }, 600)
    }
  }, [searchQuery])

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return 'text-red-500'
    if (difficulty >= 40) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 70) return 'Hard'
    if (difficulty >= 40) return 'Medium'
    return 'Easy'
  }

  const formatChartData = (trend: number[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return trend.map((value, index) => ({
      month: months[index],
      volume: value
    }))
  }

  if (!searchQuery && keywords.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Start Keyword Analysis</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Enter a keyword or niche in the search bar above to analyze search volume, competition, and trends
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <div className="h-64 bg-secondary" />
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {selectedKeyword && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedKeyword.keyword}</CardTitle>
                    <p className="text-muted-foreground mt-1">Keyword Performance Metrics</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Search Volume</p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedKeyword.searchVolume.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Competition</p>
                    <p className="text-2xl font-bold">
                      {selectedKeyword.competition.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">listings</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className={cn('text-2xl font-bold', getDifficultyColor(selectedKeyword.difficulty))}>
                      {selectedKeyword.difficulty}/100
                    </p>
                    <Badge variant="outline" className={getDifficultyColor(selectedKeyword.difficulty)}>
                      {getDifficultyLabel(selectedKeyword.difficulty)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CPC</p>
                    <p className="text-2xl font-bold text-accent">
                      ${selectedKeyword.cpc?.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">avg cost/click</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Search Trend (12 Months)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={formatChartData(selectedKeyword.trend)}>
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
                        dataKey="volume"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedKeyword.relatedKeywords.map((related, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{related}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Keywords</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {keywords.map((keyword) => (
              <button
                key={keyword.id}
                onClick={() => setSelectedKeyword(keyword)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border transition-colors',
                  selectedKeyword?.id === keyword.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-secondary/50'
                )}
              >
                <div className="space-y-1">
                  <p className="font-medium text-sm">{keyword.keyword}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {keyword.searchVolume.toLocaleString()} vol
                    </span>
                    <span className={getDifficultyColor(keyword.difficulty)}>
                      {keyword.difficulty} diff
                    </span>
                  </div>
                  <Progress value={100 - keyword.difficulty} className="h-1" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
