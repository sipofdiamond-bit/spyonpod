'use client'

import { Sidebar } from '@/components/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure your POD Spy preferences</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <SettingsIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">Settings panel coming soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
