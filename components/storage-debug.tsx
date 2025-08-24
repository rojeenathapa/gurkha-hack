"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storageService, ClassificationItem } from "@/lib/storage"

export default function StorageDebug() {
  const [debugInfo, setDebugInfo] = useState({
    totalItems: 0,
    todayItems: 0,
    localStorageAvailable: false,
    lastUpdate: new Date().toLocaleTimeString(),
    sampleData: [] as ClassificationItem[]
  })

  const refreshDebugInfo = () => {
    try {
      const totalItems = storageService.getClassifications().length
      const todayItems = storageService.getClassificationsToday().length
      const localStorageAvailable = storageService.isAvailable()
      const sampleData = storageService.getClassifications().slice(0, 3)
      
      setDebugInfo({
        totalItems,
        todayItems,
        localStorageAvailable,
        lastUpdate: new Date().toLocaleTimeString(),
        sampleData
      })
    } catch (error) {
      console.error('Error refreshing debug info:', error)
    }
  }

  const addTestItem = () => {
    try {
      const testItem = storageService.addClassification({
        item: `Test Item ${Date.now()}`,
        type: "Plastic",
        confidence: Math.floor(Math.random() * 20) + 80,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: "Test item for debugging",
        location: "Debug Location",
        disposalMethod: "Test Disposal"
      })
      
      console.log('Added test item:', testItem)
      refreshDebugInfo()
    } catch (error) {
      console.error('Error adding test item:', error)
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        storageService.clearClassifications()
        refreshDebugInfo()
        console.log('All data cleared')
      } catch (error) {
        console.error('Error clearing data:', error)
      }
    }
  }

  useEffect(() => {
    refreshDebugInfo()
    
    // Refresh every 2 seconds
    const interval = setInterval(refreshDebugInfo, 2000)
    return () => clearInterval(interval)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-red-900/90 border-red-700 backdrop-blur-sm z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-200">🔧 Storage Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-red-300 space-y-1">
          <div>Total Items: {debugInfo.totalItems}</div>
          <div>Today: {debugInfo.todayItems}</div>
          <div>localStorage: {debugInfo.localStorageAvailable ? '✅' : '❌'}</div>
          <div>Updated: {debugInfo.lastUpdate}</div>
        </div>
        
        <div className="space-y-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={addTestItem}
            className="w-full text-xs h-7"
          >
            Add Test Item
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshDebugInfo}
            className="w-full text-xs h-7"
          >
            Refresh
          </Button>
          
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={clearAllData}
            className="w-full text-xs h-7"
          >
            Clear All Data
          </Button>
        </div>
        
        {debugInfo.sampleData.length > 0 && (
          <div className="text-xs text-red-300">
            <div className="font-medium mb-1">Sample Data:</div>
            {debugInfo.sampleData.map((item, index) => (
              <div key={index} className="text-red-400">
                {item.item} ({item.type})
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

