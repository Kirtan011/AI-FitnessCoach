export function fixAndParseJSON(text: string): any {
  let cleaned = text.trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  cleaned = cleaned.replace(/```json\n?|\n?```/g, "").trim()

  cleaned = cleaned
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/(['\"])?([a-zA-Z0-9_]+)(['\"])?:/g, '"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r/g, "")

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    throw new Error("Could not parse JSON response")
  }
}
