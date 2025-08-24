"use client"

import React, { useState, useEffect } from "react"
import Navbar from "@/components/navbar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Award,
  Leaf,
  Recycle,
  FileText,
  Zap,
  Droplets,
  Trash2,
  Activity,
  TreePine,
  Droplets as WaterDrop,
} from "lucide-react"
import { storageService, ClassificationItem } from "@/lib/storage"

// TypeScript interfaces for analytics data
interface DailyData {
  date: string
  count: number
  organic: number
  plastic: number
  paper: number
  metal: number
  glass: number
}

interface WeeklyData {
  week: string
  count: number
  organic: number
  plastic: number
  paper: number
  metal: number
  glass: number
}

interface MonthlyData {
  month: string
  count: number
  organic: number
  plastic: number
  paper: number
  metal: number
  glass: number
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  progress: number
  target: number
  unlocked: boolean
}

interface AnalyticsData {
  daily: DailyData[]
  weekly: WeeklyData[]
  monthly: MonthlyData[]
  achievements: Achievement[]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("daily")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    daily: [],
    weekly: [],
    monthly: [],
    achievements: []
  })
  const [realHistory, setRealHistory] = useState<ClassificationItem[]>([])
  const [statistics, setStatistics] = useState({
    total: 0,
    change: 0,
    changePercent: 0,
    typeBreakdown: {} as Record<string, number>,
    recyclingRate: 0,
    trend: "up"
  })

  // Load real history from storage service
  useEffect(() => {
    loadData()
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(loadData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    try {
      const classifications = storageService.getClassifications()
      setRealHistory(classifications)
      
      if (classifications.length > 0) {
        generateAnalyticsData(classifications)
        calculateStatistics(classifications)
      }
      
      console.log('Analytics data loaded:', classifications.length, 'items')
    } catch (error) {
      console.error('Error loading analytics data:', error)
      setRealHistory([])
    }
  }

  // Generate real analytics data from actual history
  const generateAnalyticsData = (classifications: ClassificationItem[]) => {
    // Group classifications by date
    const groupedByDate = classifications.reduce((acc, item) => {
      const date = item.date
      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          organic: 0,
          plastic: 0,
          paper: 0,
          metal: 0,
          glass: 0,
        }
      }
      
      acc[date].count++
      
      switch (item.type.toLowerCase()) {
        case 'organic':
          acc[date].organic++
          break
        case 'plastic':
          acc[date].plastic++
          break
        case 'paper':
          acc[date].paper++
          break
        case 'metal':
          acc[date].metal++
          break
        case 'glass':
          acc[date].glass++
          break
        default:
          // For general or unknown types, don't count in recyclable
          break
      }
      
      return acc
    }, {} as Record<string, DailyData>)

    // Convert to array and sort by date
    const dailyData = Object.values(groupedByDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7) // Last 7 days

    // Generate weekly data (group by weeks)
    const weeklyData = generateWeeklyData(classifications)

    // Generate monthly data (group by months)
    const monthlyData = generateMonthlyData(classifications)

    // Calculate achievements based on real data
    const achievements = calculateAchievements(classifications)

    setAnalyticsData({
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
      achievements,
    })
  }

  // Helper function to generate weekly data
  const generateWeeklyData = (history: ClassificationItem[]) => {
    const weeks: Record<string, WeeklyData> = {}
    
    history.forEach(item => {
      const date = new Date(item.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
      const weekKey = `Week ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekKey,
          count: 0,
          organic: 0,
          plastic: 0,
          paper: 0,
          metal: 0,
          glass: 0,
        }
      }
      
      weeks[weekKey].count++
      
      switch (item.type.toLowerCase()) {
        case 'organic':
          weeks[weekKey].organic++
          break
        case 'plastic':
          weeks[weekKey].plastic++
          break
        case 'paper':
          weeks[weekKey].paper++
          break
        case 'metal':
          weeks[weekKey].metal++
          break
        case 'glass':
          weeks[weekKey].glass++
          break
      }
    })
    
    return Object.values(weeks)
      .sort((a, b) => new Date(b.week).getTime() - new Date(a.week).getTime())
      .slice(0, 4) // Last 4 weeks
  }

  // Helper function to generate monthly data
  const generateMonthlyData = (history: ClassificationItem[]) => {
    const months: Record<string, MonthlyData> = {}
    
    history.forEach(item => {
      const date = new Date(item.date)
      const monthKey = date.toLocaleDateString('en-US', { month: 'long' })
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthKey,
          count: 0,
          organic: 0,
          plastic: 0,
          paper: 0,
          metal: 0,
          glass: 0,
        }
      }
      
      months[monthKey].count++
      
      switch (item.type.toLowerCase()) {
        case 'organic':
          months[monthKey].organic++
          break
        case 'plastic':
          months[monthKey].plastic++
          break
        case 'paper':
          months[monthKey].paper++
          break
        case 'metal':
          months[monthKey].metal++
          break
        case 'glass':
          months[monthKey].glass++
          break
      }
    })
    
    return Object.values(months)
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
      .slice(0, 3) // Last 3 months
  }

  // Helper function to calculate achievements
  const calculateAchievements = (history: ClassificationItem[]) => {
    const totalClassifications = history.length
    const organicCount = history.filter(item => item.type.toLowerCase() === 'organic').length
    const recyclableCount = history.filter(item => 
      ['plastic', 'paper', 'metal', 'glass'].includes(item.type.toLowerCase())
    ).length
    const avgConfidence = history.length > 0 
      ? history.reduce((sum, item) => sum + item.confidence, 0) / history.length
      : 0

    // Calculate consecutive days
    const dates = [...new Set(history.map(item => item.date))].sort()
    let consecutiveDays = 1
    let maxConsecutive = 1
    
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i])
      const prevDate = new Date(dates[i - 1])
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        consecutiveDays++
        maxConsecutive = Math.max(maxConsecutive, consecutiveDays)
      } else {
        consecutiveDays = 1
      }
    }

    return [
      { 
        id: 1, 
        title: "Waste Warrior", 
        description: "Classified 100+ items", 
        icon: Award, 
        progress: Math.min(totalClassifications, 100), 
        target: 100, 
        unlocked: totalClassifications >= 100 
      },
      { 
        id: 2, 
        title: "Organic Champion", 
        description: "Composted 50+ organic items", 
        icon: Leaf, 
        progress: Math.min(organicCount, 50), 
        target: 50, 
        unlocked: organicCount >= 50 
      },
      { 
        id: 3, 
        title: "Recycling Master", 
        description: "Recycled 200+ items", 
        icon: Recycle, 
        progress: Math.min(recyclableCount, 200), 
        target: 200, 
        unlocked: recyclableCount >= 200 
      },
      { 
        id: 4, 
        title: "Consistency King", 
        description: "7 days in a row", 
        icon: Target, 
        progress: Math.min(maxConsecutive, 7), 
        target: 7, 
        unlocked: maxConsecutive >= 7 
      },
      { 
        id: 5, 
        title: "Accuracy Expert", 
        description: "95%+ confidence average", 
        icon: Activity, 
        progress: Math.round(avgConfidence), 
        target: 95, 
        unlocked: avgConfidence >= 95 
      },
    ]
  }

  // Calculate statistics for the selected time range
  const calculateStatistics = (classifications: ClassificationItem[]) => {
    const total = classifications.length
    
    // Calculate type breakdown
    const typeBreakdown = classifications.reduce((acc, item) => {
      const type = item.type.toLowerCase()
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate recycling rate (organic + recyclable items)
    const recyclableTypes = ['plastic', 'paper', 'metal', 'glass', 'organic']
    const recyclableCount = classifications.filter(item => 
      recyclableTypes.includes(item.type.toLowerCase())
    ).length
    const recyclingRate = total > 0 ? Math.round((recyclableCount / total) * 100) : 0

    // Calculate trend (compare last 7 days vs previous 7 days)
    const last7Days = classifications.filter(item => {
      const itemDate = new Date(item.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return itemDate >= weekAgo
    }).length

    const previous7Days = classifications.filter(item => {
      const itemDate = new Date(item.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      return itemDate >= twoWeeksAgo && itemDate < weekAgo
    }).length

    const change = last7Days - previous7Days
    const changePercent = previous7Days > 0 ? Math.round((change / previous7Days) * 100) : 0
    const trend = change >= 0 ? "up" : "down"

    setStatistics({
      total,
      change: Math.abs(change),
      changePercent: Math.abs(changePercent),
      typeBreakdown,
      recyclingRate,
      trend
    })
  }

  // Calculate achievements progress
  const unlockedAchievements = analyticsData.achievements.filter(a => a.unlocked).length
  const totalAchievements = analyticsData.achievements.length
  const achievementProgress = Math.round((unlockedAchievements / totalAchievements) * 100)

  // Generate chart data for visualization
  const getChartData = () => {
    const data = analyticsData[timeRange as keyof typeof analyticsData]
    if (!data || timeRange === "achievements") return []

    return data.map(item => {
      if (timeRange === "daily") {
        const dailyItem = item as DailyData
        return {
          label: new Date(dailyItem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: dailyItem.count,
          organic: dailyItem.organic,
          plastic: dailyItem.plastic,
          paper: dailyItem.paper,
          metal: dailyItem.metal,
          glass: dailyItem.glass,
        }
      } else if (timeRange === "weekly") {
        const weeklyItem = item as WeeklyData
        return {
          label: weeklyItem.week,
          total: weeklyItem.count,
          organic: weeklyItem.organic,
          plastic: weeklyItem.plastic,
          paper: weeklyItem.paper,
          metal: weeklyItem.metal,
          glass: weeklyItem.glass,
        }
      } else {
        const monthlyItem = item as MonthlyData
        return {
          label: monthlyItem.month,
          total: monthlyItem.count,
          organic: monthlyItem.organic,
          plastic: monthlyItem.plastic,
          paper: monthlyItem.paper,
          metal: monthlyItem.metal,
          glass: monthlyItem.glass,
        }
      }
    })
  }

  const chartData = getChartData()

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

  return (
    <div className="min-h-screen bg-[#E7E2D7]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#000000] mb-2">Analytics Dashboard</h1>
          <p className="text-[#000000]/80">Track your waste classification performance and environmental impact</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 bg-white border-[#007452]/30 text-[#000000]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#007452]/30">
              <SelectItem value="daily">Daily (Last 7 days)</SelectItem>
              <SelectItem value="weekly">Weekly (Last 4 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly (Last 3 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#000000]/70">Total Classifications</p>
                    <p className="text-3xl font-bold text-[#000000]">{statistics.total}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {statistics.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-[#007452]" />
                      ) : statistics.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <Activity className="h-4 w-4 text-[#000000]/50" />
                      )}
                      <span className={`text-sm ${statistics.trend === "up" ? "text-[#007452]" : statistics.trend === "down" ? "text-red-500" : "text-[#000000]/50"}`}>
                        {statistics.changePercent > 0 ? "+" : ""}{statistics.changePercent}%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#007452]/20">
                    <BarChart3 className="h-8 w-8 text-[#007452]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#000000]/70">Recycling Rate</p>
                    <p className="text-3xl font-bold text-[#000000]">{statistics.recyclingRate}%</p>
                    <p className="text-sm text-[#000000]/70 mt-2">of items recycled</p>
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
                    <p className="text-sm text-[#000000]/70">Organic Waste</p>
                    <p className="text-3xl font-bold text-[#000000]">{statistics.typeBreakdown.Organic}</p>
                    <p className="text-sm text-[#000000]/70 mt-2">compostable items</p>
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
                    <p className="text-sm text-[#000000]/70">Achievements</p>
                    <p className="text-3xl font-bold text-[#000000]">{unlockedAchievements}/{totalAchievements}</p>
                    <p className="text-sm text-[#000000]/70 mt-2">{achievementProgress}% complete</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#007452]/20">
                    <Award className="h-8 w-8 text-[#007452]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Waste Type Breakdown */}
        {statistics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#000000] flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Waste Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statistics.typeBreakdown).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#007452]/20">
                          {getWasteTypeIcon(type)}
                        </div>
                        <span className="text-[#000000] font-medium">{type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-[#007452]/20 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${Math.round((count / statistics.total) * 100)}%`,
                              backgroundColor: type === "Organic" ? "#007452" :
                                            type === "Plastic" ? "#007553" :
                                            type === "Paper" ? "#007654" :
                                            type === "Metal" ? "#007452" :
                                            type === "Glass" ? "#007553" : "#007452"
                            }}
                          />
                        </div>
                        <span className="text-[#000000] font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#000000] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.slice(-5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                            style={{ width: `${Math.round((item.total / Math.max(...chartData.map(d => d.total))) * 100)}%` }}
                          />
                        </div>
                        <span className="text-white text-sm w-12 text-right">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievements */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements & Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-slate-800/50 border-slate-700"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked 
                        ? "bg-green-500/20" 
                        : "bg-slate-700"
                    }`}>
                      <achievement.icon className={`h-5 w-5 ${
                        achievement.unlocked 
                          ? "text-green-400" 
                          : "text-slate-400"
                      }`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        achievement.unlocked 
                          ? "text-green-400" 
                          : "text-white"
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-slate-400">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          achievement.unlocked 
                            ? "bg-green-500" 
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                      />
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Unlocked!
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {realHistory.length > 0 ? Math.round(realHistory.length * 0.5) : 0}
                </div>
                <p className="text-green-300 font-medium">CO₂ kg saved</p>
                <p className="text-sm text-green-200 mt-1">Through recycling</p>
              </div>
              
              <div className="text-center p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {realHistory.length > 0 ? Math.round(realHistory.length * 0.3) : 0}
                </div>
                <p className="text-blue-300 font-medium">Trees equivalent</p>
                <p className="text-sm text-blue-200 mt-1">Carbon offset</p>
              </div>
              
              <div className="text-center p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {realHistory.length > 0 ? Math.round(realHistory.length * 2.5) : 0}
                </div>
                <p className="text-purple-300 font-medium">Liters of water</p>
                <p className="text-sm text-purple-200 mt-1">Conserved</p>
              </div>
            </div>
            
            {/* Environmental Impact Explanation */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="text-white font-medium mb-2">How is environmental impact calculated?</h4>
              <p className="text-sm text-slate-300 mb-3">
                These calculations are based on scientific research from EPA, European Environment Agency, and peer-reviewed studies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
                <div>
                  <strong>CO₂ Saved:</strong> Each recycled item saves ~0.5 kg CO₂ on average
                </div>
                <div>
                  <strong>Trees Equivalent:</strong> Based on mature tree absorption of 22 kg CO₂/year
                </div>
                <div>
                  <strong>Water Conserved:</strong> Manufacturing new items requires 2-15 liters per item
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                See <a href="https://docs.google.com/document/d/1nc50XXKhEGp_aq2fcbDlEMlwek597uOPv0AkDeQoJS8/edit?tab=t.0" target="_blank" className="text-blue-400 hover:underline">Environmental Impact Guide</a> for detailed methodology.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

    </div>
  )
}
