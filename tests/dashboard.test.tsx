/** @vitest-environment jsdom */

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import "@testing-library/jest-dom/vitest"

import { SYSTEM_PROMPT } from "../lib/chatService"

const mockToast = vi.fn()
vi.mock("../hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast })
}))

vi.mock("../components/color-palette-selector", () => ({
  ColorPaletteSelector: () => <div data-testid="color-selector" />
}))

vi.mock("../components/layout-selector", () => ({
  LayoutSelector: () => <div data-testid="layout-selector" />
}))

vi.mock("../contexts/theme-context", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() })
}))

import { Dashboard } from "../components/dashboard"

describe("Dashboard", () => {
  beforeEach(() => {
    mockToast.mockReset()
  })

  it("enhances the textarea prompt via ChatGPT", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ result: "refined" }) })
    ;(global as any).fetch = fetchSpy

    render(<Dashboard onImportFigma={() => {}} />)

    const textarea = screen.getAllByPlaceholderText("Describe what you want to build...")[0] as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "original" } })
    fireEvent.click(screen.getAllByText("Enhance Prompt")[0])

    await screen.findByDisplayValue("refined")

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/improve-prompt",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ prompt: "original", systemPrompt: SYSTEM_PROMPT })
      })
    )
  })

  it("shows an error toast when enhancement fails", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "boom" })
      })
    ;(global as any).fetch = fetchSpy

    render(<Dashboard onImportFigma={() => {}} />)

    const textarea = screen.getAllByPlaceholderText("Describe what you want to build...")[0] as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "original" } })
    fireEvent.click(screen.getAllByText("Enhance Prompt")[0])

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Enhance Prompt Failed" })
      )
    })

    expect(textarea).toHaveValue("original")
  })

  it("handles network errors gracefully", async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error("network"))
    ;(global as any).fetch = fetchSpy

    render(<Dashboard onImportFigma={() => {}} />)

    const textarea = screen.getAllByPlaceholderText("Describe what you want to build...")[0] as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "original" } })
    fireEvent.click(screen.getAllByText("Enhance Prompt")[0])

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Enhance Prompt Failed" })
      )
    })

    expect(textarea).toHaveValue("original")
  })
})
