"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Save, Download, Copy, Code2, Eye, Zap, RefreshCw } from "lucide-react"

const codeTemplates = [
  {
    name: "React Component",
    language: "tsx",
    code: `import React from 'react';\n\nconst MyComponent = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default MyComponent;`,
  },
  {
    name: "Next.js API Route",
    language: "ts",
    code: `import { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  return NextResponse.json({ message: 'Hello World' });\n}`,
  },
  {
    name: "Express Server",
    language: "js",
    code: `const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Hello World' });\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});`,
  },
]

export function AIEditor() {
  const [code, setCode] = useState(codeTemplates[0].code)
  const [language, setLanguage] = useState("tsx")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [fileName, setFileName] = useState("component.tsx")

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI code generation
    setTimeout(() => {
      setCode(`// Generated code based on: "${prompt}"\n${code}`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleTemplateSelect = (template: (typeof codeTemplates)[0]) => {
    setCode(template.code)
    setLanguage(template.language)
    setFileName(`${template.name.toLowerCase().replace(/\s+/g, "-")}.${template.language}`)
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Code Editor</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate and edit code with AI assistance</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Templates & Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {codeTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{template.name}</span>
                      <Badge variant="secondary">{template.language}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe what you want to generate or modify..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">File Name</label>
                  <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter file name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tsx">TypeScript React</SelectItem>
                      <SelectItem value="ts">TypeScript</SelectItem>
                      <SelectItem value="js">JavaScript</SelectItem>
                      <SelectItem value="jsx">JavaScript React</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-5 h-5" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="code" className="h-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code" className="flex items-center space-x-2">
                      <Code2 className="w-4 h-4" />
                      <span>Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="mt-0">
                    <div className="relative">
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="min-h-[600px] font-mono text-sm border-0 resize-none focus:ring-0"
                        placeholder="Start coding or use AI to generate code..."
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
                        Lines: {code.split("\n").length} | Characters: {code.length}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-0">
                    <div className="h-[600px] bg-white dark:bg-gray-800 border rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Preview will appear here</p>
                        <p className="text-sm">Run your code to see the output</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
