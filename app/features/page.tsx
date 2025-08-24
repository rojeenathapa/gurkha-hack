"use client"

import Navbar from "@/components/navbar"
import ImageUpload from "@/components/image-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  FileText,
  BarChart3,
  History,
  Zap,
  Shield,
  Globe,
  Recycle,
  Leaf,
  Trash2,
  Target,
  Award,
  TrendingUp,
  Lightbulb,
  TreePine,
  Upload,
} from "lucide-react"
import { useState } from "react"

export default function FeaturesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleDemoUpload = (file: File) => {
    setSelectedFile(file)
    setIsDemoMode(true)
  }

  const clearDemo = () => {
    setSelectedFile(null)
    setIsDemoMode(false)
  }

  const coreFeatures = [
    {
      icon: Camera,
      title: "AI-Powered Image Classification",
      description: "Upload photos of waste items and get instant, accurate classification with 95%+ precision",
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular",
    },
    {
      icon: FileText,
      title: "Text-Based Classification",
      description: "Describe your waste item in natural language and receive detailed classification results",
      color: "from-purple-500 to-pink-500",
      badge: "Smart AI",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track your environmental impact with detailed insights and personalized recommendations",
      color: "from-green-500 to-emerald-500",
      badge: "Insights",
    },
    {
      icon: History,
      title: "Classification History",
      description: "Keep track of all your classifications with searchable history and export capabilities",
      color: "from-orange-500 to-red-500",
      badge: "Track Progress",
    },
  ]

  const wasteTypes = [
    {
      icon: Recycle,
      title: "Plastic Waste",
      description: "Bottles, containers, packaging materials",
      color: "bg-blue-500",
      examples: ["Water bottles", "Food containers", "Plastic bags", "Packaging"],
    },
    {
      icon: Leaf,
      title: "Organic Waste",
      description: "Food scraps, biodegradable materials",
      color: "bg-green-500",
      examples: ["Food scraps", "Garden waste", "Paper towels", "Compostables"],
    },
    {
      icon: Zap,
      title: "E-Waste",
      description: "Electronics, batteries, circuits",
      color: "bg-purple-500",
      examples: ["Old phones", "Batteries", "Cables", "Circuit boards"],
    },
    {
      icon: Trash2,
      title: "General Waste",
      description: "Mixed materials, non-recyclables",
      color: "bg-orange-500",
      examples: ["Mixed materials", "Contaminated items", "Non-recyclables", "Composite materials"],
    },
  ]

  const advancedFeatures = [
    {
      icon: Target,
      title: "95%+ Accuracy Rate",
      description: "Our AI model is continuously trained on millions of waste images for maximum precision",
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Get classification results in under 2 seconds with our optimized AI infrastructure",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption and secure data handling with automatic image deletion options",
    },
    {
      icon: Globe,
      title: "Environmental Impact",
      description: "Calculate your carbon footprint reduction and track your positive environmental impact",
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Unlock badges and milestones as you make progress in sustainable waste management",
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Visualize your waste patterns over time with detailed charts and insights",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Lightbulb className="h-4 w-4" />
              Platform Features
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything you need for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                smart waste management
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Discover all the powerful features that make Litterly the most advanced waste classification platform
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Try It Now
            </Button>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Features</h2>
          <p className="text-xl text-slate-300">Powerful AI-driven tools for waste classification</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-300 text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Try It Yourself</h2>
          <p className="text-xl text-slate-300">Experience the power of Litterly with our interactive demo</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl mb-2">Upload & Camera Demo</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Test our image upload and camera functionality right here
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700 mb-6">
                  <TabsTrigger
                    value="upload"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </TabsTrigger>
                  <TabsTrigger
                    value="camera"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Camera className="h-4 w-4" />
                    Use Camera
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <ImageUpload
                    onImageSelect={handleDemoUpload}
                    selectedFile={selectedFile}
                    onClear={clearDemo}
                  />
                </TabsContent>

                <TabsContent value="camera" className="space-y-4">
                  <ImageUpload
                    onImageSelect={handleDemoUpload}
                    selectedFile={selectedFile}
                    onClear={clearDemo}
                  />
                </TabsContent>
              </Tabs>

              {isDemoMode && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-center">
                    <Lightbulb className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-medium text-green-400 mb-2">Demo Mode Active!</h4>
                    <p className="text-sm text-green-300">
                      You've successfully uploaded an image. In the full app, this would be classified using our AI.
                    </p>
                    <Button
                      onClick={clearDemo}
                      variant="outline"
                      size="sm"
                      className="mt-3 border-green-500/30 text-green-400 hover:bg-green-500/20"
                    >
                      Try Another Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Waste Types */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supported Waste Types</h2>
          <p className="text-xl text-slate-300">Comprehensive classification across all major waste categories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {wasteTypes.map((type, index) => {
            const Icon = type.icon
            return (
              <Card key={index} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${type.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{type.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{type.description}</p>
                  <div className="space-y-1">
                    {type.examples.map((example, idx) => (
                      <div key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                        <div className="w-1 h-1 bg-slate-500 rounded-full" />
                        {example}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Advanced Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Advanced Capabilities</h2>
          <p className="text-xl text-slate-300">Enterprise-grade features for professional waste management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {advancedFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-500/20 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
                <TreePine className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Make a Real Impact</h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of users who have already classified over 2.8 million waste items and saved 156+ tons of
                CO₂ equivalent through better waste management
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">2.8M+</div>
                  <div className="text-slate-300">Items Classified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">156T</div>
                  <div className="text-slate-300">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">78%</div>
                  <div className="text-slate-300">Recycling Rate</div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Start Your Impact
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
