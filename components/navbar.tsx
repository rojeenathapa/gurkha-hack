"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b border-[#007452]/20 bg-[#E7E2D7]/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#007452] to-[#007654]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#000000]">Litterly</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/faq" className="text-[#000000]/80 hover:text-[#007452] transition-colors font-medium">
              About
            </Link>
            <Link href="/" className="text-[#000000]/80 hover:text-[#007452] transition-colors font-medium">
              Homepage
            </Link>
            <Link href="/dashboard" className="text-[#000000]/80 hover:text-[#007452] transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-[#000000]/80 hover:text-[#007452] transition-colors font-medium">
              Analytics
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#007452] hover:bg-[#007553] text-white px-6 shadow-lg">Get Started</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="sm" className="bg-[#007452] hover:bg-[#007553] text-white shadow-lg">
                Start
              </Button>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#000000]/80 hover:text-[#007452] transition-colors p-2 rounded-lg hover:bg-[#007452]/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 border-t border-[#007452]/20 bg-[#E7E2D7]/98 backdrop-blur-sm shadow-xl">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/faq"
                className="block text-[#000000]/80 hover:text-[#007452] hover:bg-[#007452]/10 transition-all font-medium py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/"
                className="block text-[#000000]/80 hover:text-[#007452] hover:bg-[#000000]/80 hover:bg-[#007452]/10 transition-all font-medium py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Homepage
              </Link>
              <Link
                href="/dashboard"
                className="block text-[#000000]/80 hover:text-[#007452] hover:bg-[#007452]/10 transition-all font-medium py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/analytics"
                className="block text-[#000000]/80 hover:text-[#007452] hover:bg-[#007452]/10 transition-all font-medium py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
              <div className="pt-2">
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#007452] hover:bg-[#007553] text-white shadow-lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
