// Storage service for Litterly waste classification app
export interface ClassificationItem {
  id: number
  item: string
  type: string
  confidence: number
  date: string
  time: string
  image?: string
  description?: string
  location?: string
  disposalMethod?: string
}

class StorageService {
  private readonly STORAGE_KEY = 'litterly-classification-history'
  private readonly MAX_ITEMS = 1000 // Prevent localStorage from getting too large

  // Get all classifications from localStorage
  getClassifications(): ClassificationItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []
      
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  }

  // Save classifications to localStorage
  saveClassifications(classifications: ClassificationItem[]): void {
    try {
      // Limit the number of items to prevent localStorage from getting too large
      const limitedClassifications = classifications.slice(0, this.MAX_ITEMS)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedClassifications))
      console.log(`Saved ${limitedClassifications.length} classifications to localStorage`)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Add a new classification
  addClassification(classification: Omit<ClassificationItem, 'id'>): ClassificationItem {
    const classifications = this.getClassifications()
    const newClassification: ClassificationItem = {
      ...classification,
      id: Date.now()
    }
    
    // Add to beginning of array (most recent first)
    classifications.unshift(newClassification)
    this.saveClassifications(classifications)
    
    return newClassification
  }

  // Remove a classification by ID
  removeClassification(id: number): void {
    const classifications = this.getClassifications()
    const filtered = classifications.filter(item => item.id !== id)
    this.saveClassifications(filtered)
  }

  // Clear all classifications
  clearClassifications(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  // Get classifications for a specific date
  getClassificationsByDate(date: string): ClassificationItem[] {
    const classifications = this.getClassifications()
    return classifications.filter(item => item.date === date)
  }

  // Get classifications for today
  getClassificationsToday(): ClassificationItem[] {
    const today = new Date().toLocaleDateString()
    return this.getClassificationsByDate(today)
  }

  // Get total count of classifications
  getTotalClassifications(): number {
    return this.getClassifications().length
  }

  // Get classifications by waste type
  getClassificationsByType(type: string): ClassificationItem[] {
    const classifications = this.getClassifications()
    return classifications.filter(item => 
      item.type.toLowerCase() === type.toLowerCase()
    )
  }

  // Get statistics
  getStatistics() {
    const classifications = this.getClassifications()
    const today = new Date().toLocaleDateString()
    
    const classificationsToday = classifications.filter(item => item.date === today).length
    const totalClassifications = classifications.length
    
    // Calculate waste type breakdown
    const typeBreakdown = classifications.reduce((acc, item) => {
      const type = item.type.toLowerCase()
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate environmental impact
    const environmentalImpact = {
      co2Saved: Math.round(totalClassifications * 0.5),
      treesEquivalent: Math.round(totalClassifications * 0.3),
      waterConserved: Math.round(totalClassifications * 2.5)
    }

    return {
      classificationsToday,
      totalClassifications,
      typeBreakdown,
      environmentalImpact
    }
  }

  // Check if localStorage is available
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  // Initialize with default data if empty
  initializeWithDefaultData(): void {
    const classifications = this.getClassifications()
    if (classifications.length === 0) {
      const defaultData: ClassificationItem[] = [
        {
          id: Date.now() - 5,
          item: "Plastic Water Bottle",
          type: "Plastic",
          confidence: 95,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "10:30 AM",
          description: "500ml clear plastic water bottle",
          location: "Home",
          disposalMethod: "Plastic Recycling Bin"
        },
        {
          id: Date.now() - 4,
          item: "Apple Core",
          type: "Organic",
          confidence: 98,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "09:15 AM",
          description: "Red apple core with seeds",
          location: "Kitchen",
          disposalMethod: "Compost Bin"
        },
        {
          id: Date.now() - 3,
          item: "Coffee Cup",
          type: "General",
          confidence: 87,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "03:45 PM",
          description: "Paper coffee cup with plastic lid",
          location: "Office",
          disposalMethod: "General Waste"
        },
        {
          id: Date.now() - 2,
          item: "Aluminum Can",
          type: "Metal",
          confidence: 94,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "11:20 AM",
          description: "Soda can, 330ml",
          location: "Park",
          disposalMethod: "Metal Recycling"
        },
        {
          id: Date.now() - 1,
          item: "Glass Bottle",
          type: "Glass",
          confidence: 96,
          date: new Date().toLocaleDateString(),
          time: "02:10 PM",
          description: "Clear glass wine bottle",
          location: "Restaurant",
          disposalMethod: "Glass Recycling"
        }
      ]
      
      this.saveClassifications(defaultData)
      console.log('Initialized with default data')
    }
  }
}

// Create a singleton instance
export const storageService = new StorageService()

// Initialize with default data if needed
if (typeof window !== 'undefined') {
  storageService.initializeWithDefaultData()
}

