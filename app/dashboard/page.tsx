"use client"

import type React from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import ImageUpload from "@/components/image-upload"
import { storageService, ClassificationItem } from "@/lib/storage"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  History,
  Recycle,
  Trash2,
  Zap,
  Leaf,
  FileIcon,
  Lightbulb,
  TreePine,
  BarChart3,
  TrendingUp,
  Camera,
  Droplets,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"

// Mock user data - in real app this would come from auth context
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
}

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

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<ClassificationItem[]>([])
  const [statistics, setStatistics] = useState({
    classificationsToday: 0,
    totalClassifications: 0,
    environmentalImpact: {
      co2Saved: 0,
      treesEquivalent: 0,
      waterConserved: 0
    }
  })

  // Load data from storage service on component mount
  useEffect(() => {
    loadData()
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(loadData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    try {
      const classifications = storageService.getClassifications()
      setHistory(classifications)
      
      const stats = storageService.getStatistics()
      setStatistics(stats)
      
      console.log('Dashboard data loaded:', { classifications: classifications.length, stats })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")
    }
  }



  const handleSubmit = async () => {
    if (!selectedFile && !textInput.trim()) {
      setError("Please upload an image or enter a description")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append("image", selectedFile)
      } else {
        formData.append("text", textInput)
      }

      // Call the real FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Classification failed")
      }

      const data = await response.json()
      
      // Transform the API response to match our UI expectations
      const transformedResult = {
        item: selectedFile ? selectedFile.name : textInput,
        type: data.predictions[0]?.class_name || "Unknown",
        confidence: Math.round((data.predictions[0]?.confidence || 0) * 100),
        predictions: data.predictions,
        message: data.message,
        processingTime: data.processing_time,
        timestamp: new Date().toISOString(),
        // Add disposal suggestions based on waste type
        suggestions: getDisposalSuggestions(data.predictions[0]?.class_name || "Unknown"),
        recyclingTips: getRecyclingTips(data.predictions[0]?.class_name || "Unknown"),
        environmentalImpact: getEnvironmentalImpact(data.predictions[0]?.class_name || "Unknown"),
      }
      
      setResult(transformedResult)

      // Add to storage service
      const newClassification = storageService.addClassification({
        item: transformedResult.item,
        type: transformedResult.type,
        confidence: transformedResult.confidence,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: `${transformedResult.type} waste item`,
        location: "Home",
        disposalMethod: getDefaultDisposalMethod(transformedResult.type)
      })

      console.log('New classification added:', newClassification)
      
      // Reload data to update UI
      loadData()
      
      // Clear form
      setSelectedFile(null)
      
    } catch (err: any) {
      setError(err.message || "Failed to classify waste. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions for waste disposal information
  const getDisposalSuggestions = (wasteType: string) => {
    const suggestions: { [key: string]: string } = {
      "plastic": "Clean the item and place in plastic recycling bin. Remove caps and labels if possible.",
      "organic": "Compost this item or dispose in organic waste bin. Great for home composting!",
      "paper": "Remove any plastic tape or staples, then place in paper recycling bin.",
      "metal": "Clean and place in metal recycling bin. Aluminum and steel are highly recyclable.",
      "glass": "Clean and place in glass recycling bin. Different colors may need separate bins.",
      "general": "Dispose in general waste bin. Check if any parts can be separated for recycling.",
    }
    return suggestions[wasteType.toLowerCase()] || "Dispose according to local waste management guidelines."
  }

  const getRecyclingTips = (wasteType: string) => {
    const tips: { [key: string]: string } = {
      "plastic": "Plastic bottles can be recycled into new bottles, clothing, or carpeting.",
      "organic": "Organic waste creates nutrient-rich compost for gardens and plants.",
      "paper": "Recycled paper can become new paper products, reducing tree harvesting.",
      "metal": "Recycled metal saves energy and reduces mining impact significantly.",
      "glass": "Glass can be recycled infinitely without losing quality.",
      "general": "Consider if this item can be repaired, donated, or repurposed before disposal.",
    }
    return tips[wasteType.toLowerCase()] || "Recycling helps conserve resources and reduce environmental impact."
  }

  const getEnvironmentalImpact = (wasteType: string) => {
    const impacts: { [key: string]: string } = {
      "plastic": "Recycling this plastic saves energy and reduces landfill waste and ocean pollution.",
      "organic": "Composting reduces methane emissions from landfills and creates valuable soil nutrients.",
      "paper": "Paper recycling saves trees, water, and reduces greenhouse gas emissions.",
      "metal": "Metal recycling saves energy and reduces mining impact on natural habitats.",
      "glass": "Glass recycling saves energy and reduces raw material extraction.",
      "general": "Reducing general waste helps minimize landfill burden and environmental impact.",
    }
    return impacts[wasteType.toLowerCase()] || "Proper waste management helps protect our environment and natural resources."
  }

  const getDefaultDisposalMethod = (wasteType: string) => {
    switch (wasteType.toLowerCase()) {
      case "plastic":
        return "Plastic Recycling Bin"
      case "organic":
        return "Compost Bin"
      case "paper":
        return "Paper Recycling Bin"
      case "metal":
        return "Metal Recycling Bin"
      case "glass":
        return "Glass Recycling Bin"
      case "general":
        return "General Waste Bin"
      default:
        return "General Waste Bin"
    }
  }

  // Calculate dynamic statistics
  const classificationsToday = statistics.classificationsToday
  const totalClassifications = statistics.totalClassifications

  // Remove e-waste from waste type colors and icons
  const wasteTypeIcons = {
    "Plastic": Recycle,
    "Organic": Leaf,
    "Paper": FileIcon,
    "Metal": Zap,
    "Glass": Droplets,
    "General": Zap,
  }

  const wasteTypeColors = {
    "Plastic": "from-blue-500 to-cyan-500",
    "Organic": "from-green-500 to-emerald-500",
    "Paper": "from-amber-500 to-orange-500",
    "Metal": "from-gray-500 to-slate-500",
    "Glass": "from-cyan-500 to-blue-500",
    "General": "from-slate-500 to-gray-500",
  }

  return (
    <div className="min-h-screen bg-[#E7E2D7]">
      <Navbar />

      <div className="border-b border-[#007452]/20 bg-[#007452]/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#000000] to-[#007452] bg-clip-text text-transparent">
                Smart Dashboard
              </h1>
              <p className="text-[#000000]/80 mt-2 text-lg">Welcome back, {mockUser.name}</p>
            </div>
            <div className="flex gap-4">
              <Card className="bg-gradient-to-br from-[#007452]/20 to-[#007654]/20 border-[#007452]/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#007452] flex items-center justify-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      {classificationsToday}
                    </div>
                    <div className="text-sm text-[#000000]/70 mt-1">Classifications Today</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#000000]">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#007452] to-[#007654]">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  AI Waste Classification
                </CardTitle>
                <CardDescription className="text-[#000000]/80">
                  Upload an image or describe your waste item to get instant AI-powered classification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="w-full bg-[#007452]/10 border-[#007452]/20">
                    <TabsTrigger
                      value="upload"
                      className="flex items-center gap-2 data-[state=active]:bg-[#007452] data-[state=active]:text-white w-full"
                    >
                      <Camera className="h-4 w-4" />
                      Upload & Camera
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <ImageUpload
                      onImageSelect={(file) => {
                        setSelectedFile(file)
                      }}
                      selectedFile={selectedFile}
                      onClear={() => setSelectedFile(null)}
                    />
                  </TabsContent>


                </Tabs>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#007452] to-[#007654] hover:from-[#007553] hover:to-[#007654] text-white shadow-lg"
                >
                  {isLoading ? "Classifying..." : "Classify Waste"}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card className="mt-6 bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#000000]">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#007452] to-[#007654]">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    Classification Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Result Summary */}
                  <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                      {getWasteTypeIcon(result.type)}
                      <Badge className={getWasteTypeColor(result.type)}>{result.type}</Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{result.item}</p>
                      <p className="text-sm text-slate-400">Confidence: {result.confidence}%</p>
                      <p className="text-sm text-slate-400">{result.message}</p>
                    </div>
                  </div>

                  {/* Detailed Predictions */}
                  {result.predictions && result.predictions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Detected Objects:</h4>
                      {result.predictions.map((prediction: any, index: number) => (
                        <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getWasteTypeColor(prediction.class_name)}>
                                {prediction.class_name}
                              </Badge>
                              <span className="text-sm text-slate-300">
                                Confidence: {Math.round((prediction.confidence || 0) * 100)}%
                              </span>
                            </div>
                            {prediction.bbox && (
                              <span className="text-xs text-slate-400">
                                BBox: ({prediction.bbox.x1}, {prediction.bbox.y1}) - ({prediction.bbox.x2}, {prediction.bbox.y2})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-4">
                    {/* Disposal Instructions */}
                    {result.suggestions && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                          <Recycle className="h-4 w-4" />
                          Disposal Instructions
                        </h4>
                        <p className="text-sm text-green-300">{result.suggestions}</p>
                      </div>
                    )}

                    {/* Recycling Tips */}
                    {result.recyclingTips && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Recycling Tips
                        </h4>
                        <p className="text-sm text-blue-300">{result.recyclingTips}</p>
                      </div>
                    )}

                    {/* Environmental Impact */}
                    {result.environmentalImpact && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <h4 className="font-medium text-emerald-400 mb-2 flex items-center gap-2">
                          <TreePine className="h-4 w-4" />
                          Environmental Impact
                        </h4>
                        <p className="text-sm text-emerald-300">{result.environmentalImpact}</p>
                      </div>
                    )}
                  </div>

                  {/* Processing Info */}
                  {result.processingTime && (
                    <div className="text-xs text-[#000000]/50 text-center">
                      Processed in {result.processingTime}s • {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#000000]">Recent Classifications</h3>
                    <p className="text-sm text-[#000000]/70">Your classification history</p>
                  </div>
                  <Clock className="h-5 w-5 text-[#007452]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[#007452]/10 rounded-lg">
                    <div className="p-2 rounded-lg bg-[#007452]/20">
                      {getWasteTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#000000] truncate">{item.item}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getWasteTypeColor(item.type)} variant="secondary">
                          {item.type}
                        </Badge>
                        <span className="text-xs text-[#000000]/70">{item.confidence}%</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#000000]/70">
                      <div>{item.date}</div>
                      <div>{item.time}</div>
                    </div>
                  </div>
                ))}
                
                <Link href="/history">
                  <Button variant="outline" className="w-full bg-[#007452]/10 border-[#007452] text-[#007452] hover:bg-[#007452] hover:text-white">
                    View All History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      

    </div>
  )
}
