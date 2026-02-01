'use client'

import { Sidebar } from '@/components/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">Generate and export detailed reports</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">Report generation coming soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
