import { type NextRequest, NextResponse } from "next/server"

// Enhanced classification function with more detailed responses
function classifyWaste(input: string | File): Promise<{
  type: string
  confidence: number
  item: string
  suggestions: string
  recyclingTips: string
  environmentalImpact: string
}> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock classification logic based on keywords
      const inputText = typeof input === "string" ? input.toLowerCase() : input.name.toLowerCase()

      if (
        inputText.includes("plastic") ||
        inputText.includes("bottle") ||
        inputText.includes("bag") ||
        inputText.includes("container")
      ) {
        resolve({
          type: "Plastic",
          confidence: Math.floor(Math.random() * 10) + 90, // 90-99%
          item: typeof input === "string" ? input : "Plastic Item",
          suggestions: "Clean the item and place in plastic recycling bin. Remove caps and labels if possible.",
          recyclingTips: "Plastic bottles can be recycled into new bottles, clothing, or carpeting.",
          environmentalImpact: "Recycling this plastic saves energy and reduces landfill waste.",
        })
      } else if (
        inputText.includes("organic") ||
        inputText.includes("food") ||
        inputText.includes("banana") ||
        inputText.includes("apple") ||
        inputText.includes("peel") ||
        inputText.includes("core") ||
        inputText.includes("vegetable")
      ) {
        resolve({
          type: "Organic",
          confidence: Math.floor(Math.random() * 8) + 92, // 92-99%
          item: typeof input === "string" ? input : "Organic Waste",
          suggestions: "Compost this item or dispose in organic waste bin. Great for home composting!",
          recyclingTips: "Organic waste creates nutrient-rich compost for gardens and plants.",
          environmentalImpact: "Composting reduces methane emissions from landfills.",
        })
      } else if (
        inputText.includes("electronic") ||
        inputText.includes("phone") ||
        inputText.includes("computer") ||
        inputText.includes("battery") ||
        inputText.includes("laptop") ||
        inputText.includes("tablet") ||
        inputText.includes("charger")
      ) {
        resolve({
          type: "E-Waste",
          confidence: Math.floor(Math.random() * 8) + 92, // 92-99%
          item: typeof input === "string" ? input : "Electronic Device",
          suggestions: "Take to certified e-waste recycling center. Many retailers offer take-back programs.",
          recyclingTips: "E-waste contains valuable metals that can be recovered and reused.",
          environmentalImpact: "Proper e-waste recycling prevents toxic materials from entering landfills.",
        })
      } else if (
        inputText.includes("paper") ||
        inputText.includes("cardboard") ||
        inputText.includes("newspaper") ||
        inputText.includes("magazine") ||
        inputText.includes("box")
      ) {
        resolve({
          type: "Paper",
          confidence: Math.floor(Math.random() * 10) + 85, // 85-94%
          item: typeof input === "string" ? input : "Paper Product",
          suggestions: "Remove any plastic tape or staples, then place in paper recycling bin.",
          recyclingTips: "Recycled paper can become new paper products, reducing tree harvesting.",
          environmentalImpact: "Paper recycling saves trees, water, and reduces greenhouse gas emissions.",
        })
      } else {
        resolve({
          type: "General",
          confidence: Math.floor(Math.random() * 15) + 70, // 70-84%
          item: typeof input === "string" ? input : "General Waste Item",
          suggestions: "Dispose in general waste bin. Check if any parts can be separated for recycling.",
          recyclingTips: "Consider if this item can be repaired, donated, or repurposed before disposal.",
          environmentalImpact: "Reducing general waste helps minimize landfill burden.",
        })
      }
    }, 1500)
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const description = formData.get("description") as string

    if (!image && !description) {
      return NextResponse.json({ error: "Please provide either an image or description" }, { status: 400 })
    }

    // Use the provided input for classification
    const input = image || description
    const result = await classifyWaste(input)

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      processingTime: "1.5s",
    })
  } catch (error) {
    console.error("Classification error:", error)
    return NextResponse.json({ error: "Classification failed" }, { status: 500 })
  }
}
