"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatabaseIcon, Plus, Search, Filter, Download, Upload, Trash2, Edit, Eye, TableIcon, Key } from "lucide-react"

const databases = [
  { name: "ecommerce_db", type: "PostgreSQL", status: "Connected", tables: 12, size: "2.4 GB" },
  { name: "user_analytics", type: "MongoDB", status: "Connected", tables: 8, size: "1.2 GB" },
  { name: "cache_store", type: "Redis", status: "Disconnected", tables: 0, size: "256 MB" },
]

const tables = [
  { name: "users", rows: 1250, columns: 8, size: "45 MB", lastModified: "2 hours ago" },
  { name: "products", rows: 890, columns: 12, size: "78 MB", lastModified: "1 day ago" },
  { name: "orders", rows: 3420, columns: 15, size: "156 MB", lastModified: "30 minutes ago" },
  { name: "categories", rows: 45, columns: 5, size: "2 MB", lastModified: "1 week ago" },
]

const sampleData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
]

export function Database() {
  const [selectedDb, setSelectedDb] = useState(databases[0])
  const [selectedTable, setSelectedTable] = useState(tables[0])
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Database Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your databases, tables, and data</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="w-4 h-4 mr-2" />
              New Database
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Databases */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DatabaseIcon className="w-5 h-5 mr-2" />
                  Databases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {databases.map((db, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDb.name === db.name
                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedDb(db)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{db.name}</span>
                      <Badge variant={db.status === "Connected" ? "default" : "secondary"}>{db.status}</Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div>{db.type}</div>
                      <div>
                        {db.tables} tables • {db.size}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TableIcon className="w-5 h-5 mr-2" />
                  Tables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tables.map((table, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                      selectedTable.name === table.name
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="font-medium">{table.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{table.rows} rows</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="data" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="query">Query</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <TableIcon className="w-5 h-5 mr-2" />
                        {selectedTable.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Search data..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Row
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.role}</TableCell>
                            <TableCell>
                              <Badge variant={row.status === "Active" ? "default" : "secondary"}>{row.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="structure" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Table Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Null</TableHead>
                          <TableHead>Key</TableHead>
                          <TableHead>Default</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">id</TableCell>
                          <TableCell>INTEGER</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>
                            <Key className="w-4 h-4" />
                          </TableCell>
                          <TableCell>AUTO_INCREMENT</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">name</TableCell>
                          <TableCell>VARCHAR(255)</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>NULL</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">email</TableCell>
                          <TableCell>VARCHAR(255)</TableCell>
                          <TableCell>NO</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>NULL</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="query" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>SQL Query Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800"
                      placeholder="SELECT * FROM users WHERE status = 'Active';"
                    />
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500">Execute Query</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Connection String</label>
                        <Input placeholder="postgresql://user:pass@host:port/db" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Max Connections</label>
                        <Input placeholder="100" />
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">Save Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
