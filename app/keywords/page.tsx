'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { initializeMockData } from '@/lib/mock-data'
import { keywordStorage } from '@/lib/storage'
import { Keyword } from '@/lib/types'
import { exportToCSV, prepareKeywordsForExport } from '@/lib/export'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)
  
  useEffect(() => {
    initializeMockData()
    const allKeywords = keywordStorage.getAll()
    setKeywords(allKeywords)
    setFilteredKeywords(allKeywords)
    if (allKeywords.length > 0) {
      setSelectedKeyword(allKeywords[0])
    }
  }, [])
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredKeywords(
        keywords.filter(k =>
          k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredKeywords(keywords)
    }
  }, [searchQuery, keywords])
  
  const handleExport = () => {
    const exportData = prepareKeywordsForExport(filteredKeywords)
    exportToCSV(exportData, 'pod-keywords')
  }
  
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return 'bg-green-500'
    if (difficulty < 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 40) return 'Easy'
    if (difficulty < 70) return 'Medium'
    return 'Hard'
  }
  
  const trendChartData = selectedKeyword 
    ? selectedKeyword.trend.map((value, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        volume: value,
      }))
    : []
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Keyword Analysis</h1>
            <p className="text-muted-foreground">Research search volume and competition for POD keywords</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keywords</CardTitle>
                  <div className="flex gap-2 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleExport} size="icon" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[calc(100vh-300px)] overflow-auto">
                  <div className="space-y-2">
                    {filteredKeywords.map((keyword) => (
                      <div
                        key={keyword.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedKeyword?.id === keyword.id
                            ? 'bg-primary/10 border border-primary'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                        onClick={() => setSelectedKeyword(keyword)}
                      >
                        <p className="font-medium text-sm mb-2">{keyword.keyword}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">
                            {keyword.searchVolume.toLocaleString()} searches
                          </span>
                          <Badge variant="secondary" className={`${getDifficultyColor(keyword.difficulty)} text-white text-xs`}>
                            {getDifficultyLabel(keyword.difficulty)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              {selectedKeyword ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedKeyword.keyword}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Search Volume</p>
                          <p className="text-2xl font-bold">{selectedKeyword.searchVolume.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                          <p className="text-2xl font-bold">{selectedKeyword.difficulty}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Competition</p>
                          <p className="text-2xl font-bold">{selectedKeyword.competition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">CPC</p>
                          <p className="text-2xl font-bold">${selectedKeyword.cpc?.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">12-Month Trend</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={trendChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="volume" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedKeyword.relatedKeywords.map((related, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                            <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">{related}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Keyword Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">High Search Volume</h4>
                          <p className="text-sm text-muted-foreground">
                            This keyword has strong monthly search volume, indicating consistent demand in the market.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Target className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Competition Level</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedKeyword.competition > 70 
                              ? 'High competition - Consider long-tail variations or unique angles.'
                              : selectedKeyword.competition > 40
                              ? 'Moderate competition - Good opportunity with proper optimization.'
                              : 'Low competition - Excellent opportunity to rank and capture market share.'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Monetization Potential</h4>
                          <p className="text-sm text-muted-foreground">
                            CPC of ${selectedKeyword.cpc?.toFixed(2)} suggests {selectedKeyword.cpc && selectedKeyword.cpc > 2 ? 'strong' : 'moderate'} commercial intent from buyers.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Select a keyword to view detailed analysis</p>
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

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
