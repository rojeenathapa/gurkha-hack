"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Recycle,
  Leaf,
  FileText,
  Zap,
  Trash2,
  Droplets,
  Download,
  Trash,
  Eye,
} from "lucide-react"
import { storageService, ClassificationItem } from "@/lib/storage"

const getWasteTypeIcon = (type: string) => {
  switch (type) {
    case "Plastic":
      return <Recycle className="h-4 w-4" />
    case "Organic":
      return <Leaf className="h-4 w-4" />
    case "Paper":
      return <FileText className="h-4 w-4" />
    case "Metal":
      return <Zap className="h-4 w-4" />
    case "Glass":
      return <Droplets className="h-4 w-4" />
    case "General":
      return <Trash2 className="h-4 w-4" />
    default:
      return <Trash2 className="h-4 w-4" />
  }
}

const getWasteTypeColor = (type: string) => {
  switch (type) {
    case "Plastic":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Organic":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "Paper":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "Metal":
      return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    case "Glass":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    case "General":
      return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30"
  }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ClassificationItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ClassificationItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDate, setSelectedDate] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Load history from storage service on component mount
  useEffect(() => {
    loadHistory()
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(loadHistory, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadHistory = () => {
    try {
      const classifications = storageService.getClassifications()
      setHistory(classifications)
      console.log('History loaded:', classifications.length, 'items')
    } catch (error) {
      console.error('Error loading history:', error)
      setHistory([])
    }
  }

  // Filter and search functionality
  useEffect(() => {
    let filtered = history

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by waste type
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Filter by date
    if (selectedDate !== "all") {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date)
        switch (selectedDate) {
          case "today":
            return itemDate.toDateString() === today.toDateString()
          case "yesterday":
            return itemDate.toDateString() === yesterday.toDateString()
          case "lastWeek":
            return itemDate >= lastWeek
          case "lastMonth":
            return itemDate >= lastMonth
          default:
            return true
        }
      })
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "confidence":
          return b.confidence - a.confidence
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

    setFilteredHistory(filtered)
  }, [history, searchTerm, selectedType, selectedDate, sortBy])

  const handleDelete = (id: number) => {
    storageService.removeClassification(id)
    loadHistory() // Reload data after deletion
  }

  const exportHistory = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Item,Type,Confidence,Date,Time,Description,Location,Disposal Method\n" +
      filteredHistory.map(item => 
        `${item.id},"${item.item}","${item.type}",${item.confidence},"${item.date}","${item.time}","${item.description || ''}","${item.location || ''}","${item.disposalMethod || ''}"`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "waste_classification_history.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStats = () => {
    const total = filteredHistory.length
    const types = filteredHistory.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const avgConfidence = filteredHistory.length > 0 
      ? Math.round(filteredHistory.reduce((sum, item) => sum + item.confidence, 0) / filteredHistory.length)
      : 0

    return { total, types, avgConfidence }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-[#E7E2D7]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-[#000000]/70 hover:text-[#007452] mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#000000] mb-2">Classification History</h1>
              <p className="text-[#000000]/80">Track your waste classification journey and environmental impact</p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={exportHistory} variant="outline" className="border-[#007452] text-[#007452] hover:bg-[#007452]/10">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#000000]/70">Total Classifications</p>
                  <p className="text-3xl font-bold text-[#000000]">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#007452]/20">
                  <Recycle className="h-8 w-8 text-[#007452]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#000000]/70">Average Confidence</p>
                  <p className="text-3xl font-bold text-[#000000]">{stats.avgConfidence}%</p>
                </div>
                <div className="p-3 rounded-lg bg-[#007452]/20">
                  <Leaf className="h-8 w-8 text-[#007452]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#000000]/70">Waste Types</p>
                  <p className="text-3xl font-bold text-[#000000]">{Object.keys(stats.types).length}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#007452]/20">
                  <FileText className="h-8 w-8 text-[#007452]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#007452]" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-[#007452]/30 text-[#000000] placeholder:text-[#000000]/50"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white border-[#007452]/30 text-[#000000]">
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#007452]/30">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                  <SelectItem value="Paper">Paper</SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                  <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="confidence">Confidence (High-Low)</SelectItem>
                  <SelectItem value="type">Type (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-slate-400 mb-4">
                  <Recycle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No classifications found</h3>
                <p className="text-slate-400 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={() => {
                  setSearchTerm("")
                  setSelectedType("all")
                  setSelectedDate("all")
                }} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center">
                      {getWasteTypeIcon(item.type)}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{item.item}</h3>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getWasteTypeColor(item.type)} variant="secondary">
                            {item.type}
                          </Badge>
                          <span className="text-sm text-slate-400">{item.confidence}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Location:</span>
                          <p className="text-white">{item.location}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Disposal:</span>
                          <p className="text-white">{item.disposalMethod}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Date:</span>
                          <p className="text-white">{item.date}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Time:</span>
                          <p className="text-white">{item.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination Info */}
        {filteredHistory.length > 0 && (
          <div className="mt-8 text-center text-slate-400">
            Showing {filteredHistory.length} of {history.length} classifications
          </div>
        )}
      </main>

    </div>
  )
}
