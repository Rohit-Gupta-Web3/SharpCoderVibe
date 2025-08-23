export interface FigmaImportResult {
  fileKey: string
  name: string
  components: number
  colorStyles: number
  textStyles: number
}

/**
 * Extracts the file key from a Figma URL or returns the input if it already
 * looks like a key.
 */
export function extractFigmaFileKey(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  const urlMatch = trimmed.match(/figma\.com\/file\/([a-zA-Z0-9]+)[\/\?]?/)
  if (urlMatch) return urlMatch[1]
  // if input is a probable key (alphanumeric) return it
  if (/^[a-zA-Z0-9]{10,}$/i.test(trimmed)) return trimmed
  return null
}

interface ImportOptions {
  token?: string
  timeoutMs?: number
  fetchFn?: typeof fetch
}

/**
 * Fetches a Figma file and returns summary information about its contents.
 */
export async function importFigmaFile(
  urlOrKey: string,
  { token = process.env.FIGMA_TOKEN, timeoutMs = 10000, fetchFn = fetch }: ImportOptions = {}
): Promise<FigmaImportResult> {
  const fileKey = extractFigmaFileKey(urlOrKey)
  if (!fileKey) throw new Error("Invalid Figma URL or key")
  if (!token) throw new Error("Missing FIGMA_TOKEN")

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetchFn(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        "X-Figma-Token": token,
      },
      signal: controller.signal as any,
    })
  } catch (err: any) {
    clearTimeout(timeout)
    if (err?.name === "AbortError") {
      throw new Error("Request timed out")
    }
    throw new Error("Network error")
  }

  clearTimeout(timeout)

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Figma API error ${res.status}: ${text || res.statusText}`)
  }

  const data = await res.json()

  const components = data.components ? Object.keys(data.components).length : 0
  let colorStyles = 0
  let textStyles = 0
  if (data.styles) {
    Object.values<any>(data.styles).forEach((style) => {
      if (style.styleType === "FILL") colorStyles++
      if (style.styleType === "TEXT") textStyles++
    })
  }

  return {
    fileKey,
    name: data.name || "",
    components,
    colorStyles,
    textStyles,
  }
}

