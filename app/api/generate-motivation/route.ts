import { NextResponse } from "next/server"

function fixAndParseJSONArray(text: string): string[] {
  let cleaned = text.trim()

  // Extract JSON array from response
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  // Remove markdown
  cleaned = cleaned.replace(/```json\n?|\n?```/g, "").trim()

  // Fix common JSON issues
  cleaned = cleaned
    .replace(/,\s*]/g, "]") // Remove trailing commas
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r/g, "")

  try {
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    throw new Error("Not a valid array")
  } catch {
    throw new Error("Could not parse JSON")
  }
}

async function generateWithPollinations(prompt: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000) // 15s timeout

  try {
    const response = await fetch("https://text.pollinations.ai/" + encodeURIComponent(prompt), {
      method: "GET",
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error("Failed to generate text")
    }

    return response.text()
  } finally {
    clearTimeout(timeout)
  }
}

const fallbackQuotes = [
  [
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The only bad workout is the one that didn't happen.",
    "Success isn't always about greatness. It's about consistency.",
  ],
  [
    "Sweat is just fat crying. Make it weep today!",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Don't stop when you're tired. Stop when you're done.",
  ],
  [
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Your health is an investment, not an expense.",
    "The body achieves what the mind believes.",
  ],
  [
    "Wake up with determination. Go to bed with satisfaction.",
    "A one-hour workout is 4% of your day. No excuses.",
    "Champions train, losers complain.",
  ],
]

export async function GET() {
  try {
    const prompt = `Generate 3 unique fitness motivation quotes. Short, powerful, 1 sentence each. Return ONLY a JSON array: ["quote1","quote2","quote3"]`

    const text = await generateWithPollinations(prompt)
    const quotes = fixAndParseJSONArray(text)

    return NextResponse.json({ quotes })
  } catch (error) {
    console.error("Error generating motivation:", error)
    const randomSet = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    return NextResponse.json({ quotes: randomSet })
  }
}
