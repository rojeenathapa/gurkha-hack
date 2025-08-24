"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Recycle,
  Leaf,
  Zap,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Brain,
  BarChart3,
  Camera,
} from "lucide-react"
import Navbar from "@/components/navbar"

import Link from "next/link"
import { storageService } from "@/lib/storage"

type ClassificationResult = {
  type: string
  confidence: number
  message: string
  processingTime?: number
  timestamp?: string
}

const wasteTypeIcons = {
  "Plastic Waste": Recycle,
  "Organic Waste": Leaf,
  "General Waste": Zap,
}

const wasteTypeColors = {
  "Plastic Waste": "from-blue-500 to-cyan-500",
  "Organic Waste": "from-green-500 to-emerald-500",
  "General Waste": "from-gray-500 to-slate-500",
}

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please provide an image")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

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
        type: data.predictions[0]?.class_name || "Unknown",
        confidence: Math.round((data.predictions[0]?.confidence || 0) * 100),
        message: data.message,
        processingTime: data.processing_time,
        timestamp: new Date().toISOString(),
      }
      
      setResult(transformedResult)

      // Add to storage service
      const newClassification = storageService.addClassification({
        item: selectedFile.name,
        type: transformedResult.type,
        confidence: transformedResult.confidence,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: `${transformedResult.type} waste item`,
        location: "Home",
        disposalMethod: getDefaultDisposalMethod(transformedResult.type)
      })

      console.log('New classification added from main page:', newClassification)

    } catch (err: any) {
      setError(err.message || "Failed to classify waste. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

  const resetForm = () => {
    setSelectedFile(null)
    setTextDescription("")
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#E7E2D7] text-[#000000]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#007452]/20 via-[#007553]/30 to-[#007654]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,116,82,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,118,84,0.1),transparent_50%)]" />

        <div className="relative container mx-auto px-4 py-32 text-center">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-6">
              <Badge className="bg-[#007452]/20 text-[#007452] border-[#007452]/30 px-4 py-2 text-sm font-medium">
                AI-POWERED PLATFORM
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                Everything you need to build{" "}
                <span className="bg-gradient-to-r from-[#007452] via-[#007553] to-[#007654] bg-clip-text text-transparent">
                  smart waste solutions
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[#000000]/80 max-w-4xl mx-auto leading-relaxed">
                From AI-powered waste classification to intelligent analytics, Litterly provides the complete
                infrastructure for modern waste management. Classify faster, track effortlessly, focus on what matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-4 bg-[#007452] hover:bg-[#007553] text-white shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start for Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-[#007452] text-[#007452] hover:bg-[#007452]/10"
                onClick={() => document.getElementById("classification-tool")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Camera className="mr-2 h-5 w-5" />
                Try Camera
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2 text-sm font-medium mb-6">
            PLATFORM FEATURES
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Everything you need to build{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              next-generation waste management
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            From AI-powered classification to enterprise-grade analytics, Litterly provides the complete infrastructure
            stack for modern applications. Ship faster, scale effortlessly, focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI-Powered Classification */}
          <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Most Popular</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">AI-Powered Waste Classification</CardTitle>
              <CardDescription className="text-slate-400 text-base leading-relaxed">
                Transform natural language into production-ready waste identification with automatic validation,
                documentation, and testing suites.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium">99.5% Accuracy</span>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  Try Classification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Camera Integration */}
          <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">New Feature</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Instant Camera Capture</CardTitle>
              <CardDescription className="text-slate-400 text-base leading-relaxed">
                Take photos directly in the app for instant waste classification. No need to upload - just point and shoot!
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 font-medium">Real-time Processing</span>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  Try Camera
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  Enterprise Ready
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Smart Waste Analytics</CardTitle>
              <CardDescription className="text-slate-400 text-base leading-relaxed">
                Auto-scaling insights with intelligent tracking, real-time monitoring, and automated pattern
                recognition.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Real-time Insights</span>
              </div>
              <Link href="/history">
                <Button variant="ghost" className="text-slate-400 hover:text-white p-0 h-auto font-normal">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Global Impact Tracking */}
          <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">Global Scale</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Global Impact Tracking</CardTitle>
              <CardDescription className="text-slate-400 text-base leading-relaxed">
                Lightning-fast environmental impact analysis, automatic sustainability optimization, and global carbon
                footprint distribution across 200+ metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 font-medium">Carbon Neutral</span>
              </div>
              <Link href="/faq">
                <Button variant="ghost" className="text-slate-400 hover:text-white p-0 h-auto font-normal">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Classification Tool */}
      <section id="classification-tool" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge className="bg-[#007452]/20 text-[#007452] border-[#007452]/30 px-4 py-2 text-sm font-medium mb-6">
              TRY IT NOW
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#000000] mb-6">Experience AI-Powered Classification</h2>
            <p className="text-xl text-[#000000]/80 max-w-2xl mx-auto">
              Upload an image or describe your waste item for instant AI-powered classification and disposal guidance.
            </p>
          </div>

          {/* Terminal-style Interface */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl blur-xl" />
            <Card className="relative bg-white/90 border-[#007452]/20 backdrop-blur-sm overflow-hidden shadow-xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-[#007452]/20 bg-[#007452]/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span className="text-[#007452] text-sm ml-4 font-medium">litterly.ai/classify</span>
              </div>

              <CardContent className="p-8 space-y-6">


                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#000000] text-sm font-medium">Waste Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-2 bg-white border-[#007452]/30 text-[#000000] file:bg-[#007452]/10 file:text-[#007452] file:border-0 file:font-medium"
                    />
                    {selectedFile && <p className="mt-2 text-sm text-[#000000]/70">Selected: {selectedFile.name}</p>}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !selectedFile}
                    className="w-full bg-gradient-to-r from-[#007452] to-[#007654] hover:from-[#007553] hover:to-[#007654] text-white shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing requirements...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Classify Waste
                      </>
                    )}
                  </Button>
                </div>

                {/* Error Display */}
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Results Display */}
                {result && (
                  <div className="space-y-4 p-6 bg-[#007452]/10 rounded-xl border border-[#007452]/20">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${wasteTypeColors[result.type as keyof typeof wasteTypeColors] || wasteTypeColors["General Waste"]}`}
                      >
                        {(() => {
                          const IconComponent = wasteTypeIcons[result.type as keyof typeof wasteTypeIcons] || Zap
                          return <IconComponent className="h-6 w-6 text-white" />
                        })()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#000000]">{result.type}</h3>
                        <p className="text-[#000000]/80">{result.message}</p>
                      </div>
                    </div>

                    {result.confidence && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#000000]/70">Confidence Level</span>
                          <span className="text-[#007452] font-medium">{result.confidence}%</span>
                        </div>
                        <div className="w-full bg-[#007452]/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#007452] to-[#007654] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Processing Time */}
                    {result.processingTime && (
                      <div className="text-center">
                        <p className="text-xs text-slate-400">
                          Processed in {result.processingTime}s
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        Classify Another Item
                      </Button>
                      <Link href="/dashboard" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                          Go to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
