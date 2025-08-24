"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Sparkles, Zap, Shield, Globe, Camera, Brain, Recycle, Leaf, Users, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#E7E2D7]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#007452]/20 via-[#007553]/15 to-[#007654]/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007452]/20 border border-[#007452]/30 text-[#007452] text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              About Litterly
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#000000] mb-6">
              Revolutionizing waste management with{" "}
              <span className="bg-gradient-to-r from-[#007452] to-[#007654] bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <p className="text-xl text-[#000000]/80 leading-relaxed mb-4">
              Litterly is an AI-powered platform that helps individuals and businesses make smarter waste disposal decisions, 
              contributing to a cleaner, more sustainable future.
            </p>
            <p className="text-lg text-[#000000]/70 leading-relaxed">
              Built with cutting-edge YOLOv8 technology for 95%+ accuracy in waste classification
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-4">Our Mission</h2>
            <p className="text-xl text-[#000000]/80">Empowering everyone to make a positive environmental impact</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#000000] mb-6">Making Waste Management Simple</h3>
              <p className="text-[#000000]/80 text-lg leading-relaxed mb-6">
                Every year, millions of tons of waste end up in landfills because people aren't sure how to properly dispose of items. 
                Litterly solves this problem by using advanced AI to instantly identify waste types and provide clear disposal instructions.
              </p>
              <p className="text-[#000000]/80 text-lg leading-relaxed mb-6">
                For AI models, the foundation is data. Messy, unsorted data creates an inaccurate model. For the environment, the foundation is sorted waste. 
                A single wrong item can contaminate an entire bin, making it unusable and sending it to a landfill.
              </p>
              <p className="text-[#000000]/80 text-lg leading-relaxed">
                <strong>Our Solution is the "Data Preparation" for the planet.</strong> We use AI to provide instant classification, ensuring a clean base for efficient recycling and a healthier environment.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#007452]/20 to-[#007654]/20 rounded-2xl blur-xl" />
              <Card className="relative bg-white/90 border-[#007452]/20 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-[#007452] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-[#000000] mb-2">Environmental Impact</h4>
                    <p className="text-[#000000]/80">
                      Every correct classification helps reduce landfill waste and promotes recycling, 
                      creating a ripple effect for our planet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000000] mb-6">How Litterly Works</h2>
            <p className="text-xl md:text-2xl text-[#000000]/80 max-w-3xl mx-auto leading-relaxed">
              Simple steps to smarter waste management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <Card className="bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#007452] to-[#007654] mb-8 shadow-lg">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#000000] mb-6">1. Capture</h3>
                <p className="text-[#000000]/80 text-lg leading-relaxed">
                  Take a photo of your waste item using your phone's camera or upload an existing image
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#007452] to-[#007654] mb-8 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#000000] mb-6">2. Analyze</h3>
                <p className="text-[#000000]/80 text-lg leading-relaxed">
                  Our AI instantly analyzes the image and identifies the waste type with high accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#007452] to-[#007654] mb-8 shadow-lg">
                  <Recycle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#000000] mb-6">3. Dispose</h3>
                <p className="text-[#000000]/80 text-lg leading-relaxed">
                  Get clear instructions on how to properly dispose of or recycle your waste item
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000000] mb-6">Powered by Advanced AI</h2>
            <p className="text-xl md:text-2xl text-[#000000]/80 max-w-3xl mx-auto leading-relaxed">
              State-of-the-art machine learning for accurate waste classification
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#007452]/20 to-[#007654]/20 rounded-2xl blur-xl" />
              <Card className="relative bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-10">
                  <div className="text-center">
                    <Target className="h-20 w-20 text-[#007452] mx-auto mb-6" />
                    <h4 className="text-2xl font-bold text-[#000000] mb-4">YOLOv8 Technology</h4>
                    <p className="text-[#000000]/80 text-lg leading-relaxed">
                      Built on the latest YOLOv8 segmentation models, providing industry-leading accuracy 
                      in object detection and classification.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#000000] mb-6">Continuous Learning</h3>
              <p className="text-[#000000]/80 text-lg leading-relaxed mb-6">
                Our AI models are trained on millions of waste images and continuously improve through user feedback. 
                This ensures that Litterly gets smarter and more accurate over time.
              </p>
              <p className="text-[#000000]/80 text-lg leading-relaxed">
                We support multiple waste categories including plastic, organic, paper, metal, glass, and general waste, 
                with specialized models for each type to ensure maximum accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000000] mb-6">Our Impact</h2>
            <p className="text-xl md:text-2xl text-[#000000]/80 max-w-3xl mx-auto leading-relaxed">
              Making a difference in waste management worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card className="bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#007452] to-[#007654] mb-8 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#000000] mb-6">Global Community</h3>
                <p className="text-[#000000]/80 text-lg leading-relaxed">
                  Thousands of users worldwide are already using Litterly to make smarter waste decisions, 
                  creating a ripple effect of environmental consciousness.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#007452] to-[#007654] mb-8 shadow-lg">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#000000] mb-6">Environmental Benefits</h3>
                <p className="text-[#000000]/80 text-lg leading-relaxed">
                  Promoting recycling and proper waste disposal to reduce landfill impact and pollution, 
                  contributing to a healthier planet for future generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/95 border-[#007452]/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#000000] mb-6">Join the Revolution</h2>
              <p className="text-xl md:text-2xl text-[#000000]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Be part of the solution. Start using Litterly today and help create a cleaner, more sustainable world.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#007452] to-[#007654] hover:from-[#007553] hover:to-[#007654] text-white px-8 py-3 text-lg shadow-lg"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Start Classifying Waste
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
