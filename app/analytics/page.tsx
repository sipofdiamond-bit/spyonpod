'use client'

import { Sidebar } from '@/components/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { LineChart } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Deep dive into your research data</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">Advanced analytics coming soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
