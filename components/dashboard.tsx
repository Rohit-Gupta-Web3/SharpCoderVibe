"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Sparkles, ImageIcon, Home, ShoppingCart, MessageCircle, Moon, Sun, Figma } from "lucide-react"
import { ColorPaletteSelector } from "./color-palette-selector"
import { LayoutSelector } from "./layout-selector"
import { useTheme } from "../contexts/theme-context"
import { SYSTEM_PROMPT } from "@/lib/chatService"

const presetPrompts = [
  {
    icon: Home,
    title: "Design a Website",
    description: "Create a modern website design",
    prompt: "Design a modern, responsive website with clean UI and smooth animations",
  },
  {
    icon: MessageCircle,
    title: "Create an Application",
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

interface DashboardProps {
  onImportFigma: () => void
}

export function Dashboard({ onImportFigma }: DashboardProps) {
  const [prompt, setPrompt] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const [enhancing, setEnhancing] = useState(false)
  const [lastApiResponse, setLastApiResponse] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt)
  }

  const handleEnhancePrompt = async () => {
    const currentText = textareaRef.current?.value ?? ""
    if (!currentText.trim() || enhancing) {
      return
    }
    const controller = new AbortController()
    // Increase client-side timeout to 60s to match the server's default
    // AI model timeout. The previous 15s value frequently aborted long
    // model runs before receiving the improved prompt.
    const timeout = setTimeout(() => controller.abort(), 60000)
    try {
      setEnhancing(true)
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentText, systemPrompt: SYSTEM_PROMPT }),
        signal: controller.signal,
      })
        let data: any
        let parsedOk = true
        try {
          data = await res.json()
        } catch (e) {
          // If response wasn't JSON, fall back to text
          parsedOk = false
          try {
            const txt = await res.text()
            data = txt
          } catch {
            data = null
          }
        }

        console.debug("/api/improve-prompt status ->", res.status, "parsedJson->", parsedOk, "type->", typeof data)
        console.debug("/api/improve-prompt ->", data)
        // store a richer debug payload so we can inspect status + parsed flag in the UI
        try {
          setLastApiResponse(JSON.stringify({ status: res.status, parsedOk, data }, null, 2))
        } catch {
          setLastApiResponse(String(data))
        }
        if (!res.ok) {
          // try to extract an error message from JSON or text
          const errMsg = data?.error || (typeof data === "string" ? data : undefined) || "Failed to enhance prompt"
          throw new Error(errMsg)
        }

      // Be defensive about the response shape. Accept string or nested shapes.
      // Defensive parsing: accept either string responses or { result: string }
      let resultText: string = ""
      if (typeof data === "string") {
        resultText = data
      } else if (data && typeof data === "object") {
        if (typeof data.result === "string") {
          resultText = data.result
        } else if (data.result && typeof data.result === "object") {
          resultText = data.result.text || data.result.body || data.result.output || JSON.stringify(data.result)
        } else if (typeof data.text === "string") {
          resultText = data.text
        } else {
          // fallback: stringify non-empty object
          try {
            const s = JSON.stringify(data)
            if (s && s !== "{}") resultText = s
          } catch {
            resultText = ""
          }
        }
      }

      console.debug("Parsed improved prompt ->", resultText)
      if (!resultText || !resultText.trim()) {
        toast({ variant: "destructive", title: "No enhanced prompt returned", description: "The service returned no text to replace the prompt." })
      } else {
        const cleanedResult = resultText.trim()
  setPrompt(cleanedResult)
  console.debug("dashboard: setPrompt ->", cleanedResult)
        // ensure the textarea shows the new value and is focused for the user
        // defer caret positioning to the next macrotask so React has applied the new value
        try {
          const el = textareaRef.current
          if (el) {
            setTimeout(() => {
              try {
                el.selectionStart = el.selectionEnd = cleanedResult.length
                el.focus()
              } catch {
                // ignore focusing/selection errors
              }
            }, 0)
          }
        } catch {
          // ignore focusing errors
        }
      }
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
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setPrompt((prev) => `${prev} (with uploaded screenshot reference)`)
      }
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
                ref={textareaRef}
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
                    onClick={onImportFigma}
                    className="flex items-center space-x-2"
                  >
                    <Figma className="w-4 h-4" />
                    <span>Import from Figma</span>
                  </Button>
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
              {/* Debug: show last API response for troubleshooting enhance flow */}
              {lastApiResponse && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API response (debug)</div>
                  <pre className="max-h-48 overflow-auto text-xs whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-2 rounded">{lastApiResponse}</pre>
                </div>
              )}
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
