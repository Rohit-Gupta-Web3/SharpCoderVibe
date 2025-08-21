"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Figma,
  Link,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Code2,
  Palette,
  Type,
  Square,
  ImageIcon,
} from "lucide-react"

const figmaProjects = [
  {
    id: 1,
    name: "E-commerce Mobile App",
    url: "https://figma.com/file/abc123",
    status: "Ready",
    lastSync: "2 hours ago",
    components: 24,
    screens: 12,
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 2,
    name: "Dashboard Design System",
    url: "https://figma.com/file/def456",
    status: "Syncing",
    lastSync: "Syncing now...",
    components: 45,
    screens: 8,
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 3,
    name: "Landing Page Wireframes",
    url: "https://figma.com/file/ghi789",
    status: "Error",
    lastSync: "Failed 1 hour ago",
    components: 12,
    screens: 5,
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
]

const importHistory = [
  { name: "Button Components", type: "Components", status: "Success", date: "2024-01-15", files: 8 },
  { name: "Color Palette", type: "Styles", status: "Success", date: "2024-01-14", files: 1 },
  { name: "Typography System", type: "Styles", status: "Success", date: "2024-01-13", files: 3 },
  { name: "Icon Library", type: "Assets", status: "Failed", date: "2024-01-12", files: 24 },
]

export function ImportFigma() {
  const [figmaUrl, setFigmaUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const handleImport = async () => {
    if (!figmaUrl.trim()) return

    setIsImporting(true)
    setImportProgress(0)

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsImporting(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready":
      case "Success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Syncing":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "Error":
      case "Failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Figma className="w-8 h-8 mr-3 text-purple-500" />
              Import from Figma
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Convert your Figma designs into code components</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Import Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Import New Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Figma File URL</label>
                  <Input
                    placeholder="https://www.figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                  />
                </div>

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importing design...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={handleImport}
                    disabled={!figmaUrl.trim() || isImporting}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isImporting ? "Importing..." : "Import Design"}
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="projects" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="projects">Connected Projects</TabsTrigger>
                <TabsTrigger value="history">Import History</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                {figmaProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={project.thumbnail || "/placeholder.svg"}
                          alt={project.name}
                          className="w-32 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(project.status)}
                              <Badge
                                variant={
                                  project.status === "Ready"
                                    ? "default"
                                    : project.status === "Error"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{project.url}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span>{project.components} components</span>
                            <span>{project.screens} screens</span>
                            <span>Last sync: {project.lastSync}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Code2 className="w-4 h-4 mr-2" />
                              Generate Code
                            </Button>
                            <Button size="sm" variant="outline">
                              Sync Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {importHistory.map((item, index) => (
                        <div key={index} className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.type} • {item.files} files • {item.date}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Components</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Styles & Colors</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Typography</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Assets & Images</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" defaultChecked />
                  <span className="text-sm">React Components</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" />
                  <span className="text-sm">Vue Components</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" />
                  <span className="text-sm">HTML/CSS</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" />
                  <span className="text-sm">Tailwind CSS</span>
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Square className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Components</span>
                  </div>
                  <span className="font-medium">81</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Color Styles</span>
                  </div>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Text Styles</span>
                  </div>
                  <span className="font-medium">16</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Assets</span>
                  </div>
                  <span className="font-medium">52</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
