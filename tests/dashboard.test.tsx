/** @vitest-environment jsdom */

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, it, expect } from "vitest"
import "@testing-library/jest-dom/vitest"

vi.mock("../hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() })
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
  it("renders application preset and handles Figma import", () => {
    const onImportFigma = vi.fn()
    render(<Dashboard onImportFigma={onImportFigma} />)

    expect(screen.getByText("Create an Application")).toBeInTheDocument()
    fireEvent.click(screen.getByText("Import from Figma"))
    expect(onImportFigma).toHaveBeenCalled()
  })
})
