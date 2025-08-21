/** @vitest-environment jsdom */

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, it, expect } from "vitest"
import "@testing-library/jest-dom/vitest"
import { ColorPaletteSelector, colorPalettes } from "../components/color-palette-selector"

describe("ColorPaletteSelector", () => {
  it("exposes application-friendly palettes", () => {
    expect(colorPalettes).toHaveLength(5)
    colorPalettes.forEach((p) => expect(p.colors).toHaveLength(5))
  })

  it("emits selected palette code", () => {
    const onSelect = vi.fn()
    render(<ColorPaletteSelector onSelect={onSelect} />)
    fireEvent.click(screen.getByText("Select Colors"))
    fireEvent.click(screen.getByText(colorPalettes[0].name))
    expect(onSelect).toHaveBeenCalledWith(
      expect.stringContaining(colorPalettes[0].code)
    )
  })
})
