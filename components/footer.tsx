import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Litterly</span>
            </div>
            <p className="text-sm text-slate-400">
              AI-powered waste classification infrastructure for modern applications. Ship faster, scale effortlessly,
              focus on what matters.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Platform</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-slate-400 hover:text-white transition-colors">
                AI Classification
              </Link>
              <Link href="/dashboard" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Analytics
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                API Reference
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Integrations
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Resources</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Community
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Company</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2024 Litterly. All rights reserved. Built for sustainable infrastructure.
          </p>
        </div>
      </div>
    </footer>
  )
}
