"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Sparkles, Upload, ImageIcon, Home, ShoppingCart, MessageCircle, Moon, Sun } from "lucide-react"
import { ColorPaletteSelector } from "./color-palette-selector"
import { LayoutSelector } from "./layout-selector"
import { useTheme } from "../contexts/theme-context"

const presetPrompts = [
  {
    icon: Home,
    title: "Design a Website",
    description: "Create a modern website design",
    prompt: "Design a modern, responsive website with clean UI and smooth animations",
  },
  {
    icon: MessageCircle,
    title: "Create a Chat UI",
    description: "Build a real-time chat interface",
    prompt: "Create a chat user interface with real-time messaging capabilities",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Website",
    description: "Build an online store",
    prompt: "Create an e-commerce website with product catalog and shopping cart",
  },
]

export function Dashboard() {
  const [prompt, setPrompt] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const [enhancing, setEnhancing] = useState(false)

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt)
  }

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || enhancing) {
      return
    }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      setEnhancing(true)
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to enhance prompt")
      }
      setPrompt(data.result)
    } catch (err: any) {
      const message = err?.name === "AbortError" ? "Request timed out" : err?.message || "Unexpected error"
      toast({
        variant: "destructive",
        title: "Enhance Prompt Failed",
        description: message,
      })
    } finally {
      clearTimeout(timeout)
      setEnhancing(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file && file.type.startsWith("image/")) {
      setPrompt((prev) => `${prev} (with uploaded screenshot reference)`)
    }
  }

  const handleLayoutSelect = (layoutText: string) => {
    setPrompt((prev) => (prev ? `${prev} and ${layoutText}` : layoutText))
  }

  const handleColorSelect = (colorText: string) => {
    setPrompt((prev) => (prev ? `${prev} and ${colorText}` : colorText))
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, John Doe! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400">What would you like to build today?</p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme} className="p-2 bg-transparent">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>

        {/* Preset Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {presetPrompts.map((preset, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePresetClick(preset.prompt)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <preset.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{preset.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{preset.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Prompt Area */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Describe what you want to build..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleEnhancePrompt}
                  disabled={enhancing || !prompt.trim()}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <Sparkles className={`w-4 h-4 ${enhancing ? "animate-spin" : ""}`} />
                  <span>{enhancing ? "Enhancing..." : "Enhance Prompt"}</span>
                </Button>

                <div
                  className={`relative ${dragActive ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Screenshot</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                  />
                </div>

                <LayoutSelector onSelect={handleLayoutSelect} />
                <ColorPaletteSelector onSelect={handleColorSelect} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end generate-btn">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={!prompt.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>

              {/* Character Count */}
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">{prompt.length}/1000</div>
            </div>
          </CardContent>
        </Card>

        {/* Drag and Drop Overlay */}
        {dragActive && (
          <div className="fixed inset-0 bg-blue-500/20 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-blue-500 mb-4" />
              <p className="text-lg font-medium">Drop your screenshot here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
