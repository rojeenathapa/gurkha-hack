// Test file for storage service
// Run this in browser console to test localStorage functionality

export function testStorageService() {
  console.log('🧪 Testing Storage Service...')
  
  // Test if localStorage is available
  if (typeof window === 'undefined') {
    console.log('❌ Not in browser environment')
    return
  }

  try {
    // Test basic localStorage operations
    const testKey = '__test_key__'
    const testValue = 'test_value'
    
    localStorage.setItem(testKey, testValue)
    const retrieved = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    
    if (retrieved === testValue) {
      console.log('✅ localStorage is working correctly')
    } else {
      console.log('❌ localStorage test failed')
      return
    }
  } catch (error) {
    console.log('❌ localStorage error:', error)
    return
  }

  // Test storage service
  const { storageService } = require('./storage')
  
  console.log('📊 Testing Storage Service Methods...')
  
  // Test getClassifications (should return empty array initially)
  const initialClassifications = storageService.getClassifications()
  console.log('Initial classifications:', initialClassifications.length)
  
  // Test addClassification
  const newClassification = storageService.addClassification({
    item: "Test Plastic Bottle",
    type: "Plastic",
    confidence: 95,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    description: "Test item for storage service",
    location: "Test Location",
    disposalMethod: "Test Disposal"
  })
  
  console.log('Added classification:', newClassification)
  
  // Test getClassifications again (should return 1 item)
  const updatedClassifications = storageService.getClassifications()
  console.log('Updated classifications:', updatedClassifications.length)
  
  // Test getStatistics
  const stats = storageService.getStatistics()
  console.log('Statistics:', stats)
  
  // Test getClassificationsToday
  const todayClassifications = storageService.getClassificationsToday()
  console.log('Today classifications:', todayClassifications.length)
  
  // Test removeClassification
  storageService.removeClassification(newClassification.id)
  const finalClassifications = storageService.getClassifications()
  console.log('After removal:', finalClassifications.length)
  
  console.log('🎉 Storage Service Test Complete!')
  
  return {
    initial: initialClassifications.length,
    afterAdd: updatedClassifications.length,
    afterRemove: finalClassifications.length,
    statistics: stats
  }
}

// Auto-run test if in browser
if (typeof window !== 'undefined') {
  // Wait for page to load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🚀 Auto-running storage service test...')
      testStorageService()
    }, 1000)
  })
}

