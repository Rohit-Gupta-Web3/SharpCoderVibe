import { describe, it, expect, vi } from "vitest"
import { extractFigmaFileKey, importFigmaFile } from "../lib/figma"

describe("extractFigmaFileKey", () => {
  it("parses keys from url", () => {
    expect(
      extractFigmaFileKey("https://www.figma.com/file/abc12345/My-file")
    ).toBe("abc12345")
  })

  it("returns null for invalid inputs", () => {
    expect(extractFigmaFileKey("bad")).toBeNull()
  })
})

describe("importFigmaFile", () => {
  const token = "TOKEN"

  it("imports figma file successfully", async () => {
    const mockRes = {
      ok: true,
      json: async () => ({
        name: "Demo",
        components: { a: {}, b: {} },
        styles: {
          s1: { styleType: "FILL" },
          s2: { styleType: "TEXT" },
        },
      }),
    }
    const fetchFn = vi.fn().mockResolvedValue(mockRes as any)
    const result = await importFigmaFile("https://www.figma.com/file/abc12345", {
      token,
      fetchFn,
    })
    expect(result.components).toBe(2)
    expect(result.colorStyles).toBe(1)
    expect(result.textStyles).toBe(1)
  })

  it("throws on invalid url", async () => {
    const fetchFn = vi.fn()
    await expect(importFigmaFile("bad", { token, fetchFn })).rejects.toThrow(
      "Invalid Figma URL or key"
    )
  })

  it("throws when token missing", async () => {
    const fetchFn = vi.fn()
    await expect(
      importFigmaFile("https://www.figma.com/file/abc12345", {
        token: undefined,
        fetchFn,
      })
    ).rejects.toThrow("Missing FIGMA_TOKEN")
  })

  it("surfaces api errors", async () => {
    const mockRes = {
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: async () => "Forbidden",
    }
    const fetchFn = vi.fn().mockResolvedValue(mockRes as any)
    await expect(
      importFigmaFile("https://www.figma.com/file/abc12345", { token, fetchFn })
    ).rejects.toThrow("Figma API error 403")
  })

  it("handles network failures", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error("boom"))
    await expect(
      importFigmaFile("https://www.figma.com/file/abc12345", { token, fetchFn })
    ).rejects.toThrow("Network error")
  })

  it("handles timeouts", async () => {
    const fetchFn = () =>
      new Promise((_, reject) => setTimeout(() => reject({ name: "AbortError" }), 5))
    await expect(
      importFigmaFile("https://www.figma.com/file/abc12345", {
        token,
        fetchFn,
        timeoutMs: 1,
      })
    ).rejects.toThrow("Request timed out")
  })
})
