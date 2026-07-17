export function fixAndParseJSON(text: string): any {
  // First, try parsing the raw text directly
  try {
    return JSON.parse(text)
  } catch (e) {
    // Continue to fallback strategies
  }

  let cleaned = text.trim()

  // Remove markdown code blocks and try again
  cleaned = cleaned.replace(/```json\n?|\n?```/g, "").trim()
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Continue
  }

  // Extract just the JSON object if there's surrounding text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
    try {
      return JSON.parse(cleaned)
    } catch (e) {
      // Continue
    }
  }

  // As a last resort, fix common syntax errors like trailing commas
  cleaned = cleaned
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    throw new Error("Could not parse JSON response")
  }
}
