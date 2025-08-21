"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { SettingsIcon, Palette, Code2, Download, Upload, Trash2, RefreshCw } from "lucide-react"
import { useTheme } from "../contexts/theme-context"

export function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    autoSave: true,
    codeCompletion: true,
    lineNumbers: true,
    wordWrap: false,
    minimap: true,
    fontSize: [14],
    tabSize: [2],
    autoFormat: true,
    livePreview: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <SettingsIcon className="w-8 h-8 mr-3" />
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your Sharp Coder experience</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Save</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your work</p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Live Preview</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show live preview while coding</p>
                    </div>
                    <Switch
                      checked={settings.livePreview}
                      onCheckedChange={(checked) => handleSettingChange("livePreview", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select defaultValue="typescript">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Framework</Label>
                    <Select defaultValue="react">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue.js</SelectItem>
                        <SelectItem value="angular">Angular</SelectItem>
                        <SelectItem value="svelte">Svelte</SelectItem>
                        <SelectItem value="nextjs">Next.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workspace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Project Location</Label>
                  <div className="flex space-x-2">
                    <Input value="/Users/johndoe/Projects" readOnly />
                    <Button variant="outline">Browse</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Remember Last Project</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Open last project on startup</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code2 className="w-5 h-5 mr-2" />
                  Editor Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Line Numbers</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show line numbers in editor</p>
                    </div>
                    <Switch
                      checked={settings.lineNumbers}
                      onCheckedChange={(checked) => handleSettingChange("lineNumbers", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Word Wrap</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Wrap long lines</p>
                    </div>
                    <Switch
                      checked={settings.wordWrap}
                      onCheckedChange={(checked) => handleSettingChange("wordWrap", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Minimap</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show code minimap</p>
                    </div>
                    <Switch
                      checked={settings.minimap}
                      onCheckedChange={(checked) => handleSettingChange("minimap", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Format</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Format code on save</p>
                    </div>
                    <Switch
                      checked={settings.autoFormat}
                      onCheckedChange={(checked) => handleSettingChange("autoFormat", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Code Completion</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable intelligent code suggestions</p>
                    </div>
                    <Switch
                      checked={settings.codeCompletion}
                      onCheckedChange={(checked) => handleSettingChange("codeCompletion", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Font Size: {settings.fontSize[0]}px</Label>
                    <Slider
                      value={settings.fontSize}
                      onValueChange={(value) => handleSettingChange("fontSize", value)}
                      max={24}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Tab Size: {settings.tabSize[0]} spaces</Label>
                    <Slider
                      value={settings.tabSize}
                      onValueChange={(value) => handleSettingChange("tabSize", value)}
                      max={8}
                      min={2}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Editor Theme</Label>
                  <Select defaultValue="vs-dark">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs-dark">Dark</SelectItem>
                      <SelectItem value="vs-light">Light</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="dracula">Dracula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Light</span>
                      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                      <span className="text-sm">Dark</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-purple-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-red-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 border cursor-pointer"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sidebar Position</Label>
                  <Select defaultValue="left">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing for more content</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">GH</span>
                    </div>
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Connected as johndoe</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">F</span>
                    </div>
                    <div>
                      <p className="font-medium">Figma</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Gemini API Key</Label>
                  <div className="flex space-x-2">
                    <Input type="password" placeholder="AIza..." />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Anthropic API Key</Label>
                  <div className="flex space-x-2">
                    <Input type="password" placeholder="sk-ant-..." />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hardware Acceleration</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use GPU for better performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Preload Projects</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Load recent projects in background</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cache Size</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current: 2.4 GB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="font-medium text-red-600 mb-2">Reset All Settings</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    This will reset all your preferences to default values.
                  </p>
                  <Button variant="destructive" size="sm">
                    Reset Settings
                  </Button>
                </div>
                <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="font-medium text-red-600 mb-2">Delete Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
