"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Plus,
  Link,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Eye,
  GitFork,
  Code2,
} from "lucide-react"

const connectedRepos = [
  {
    id: 1,
    name: "sharp-coder-frontend",
    fullName: "johndoe/sharp-coder-frontend",
    status: "Connected",
    lastSync: "2 minutes ago",
    branch: "main",
    commits: 45,
    stars: 12,
    language: "TypeScript",
    private: false,
  },
  {
    id: 2,
    name: "ecommerce-dashboard",
    fullName: "johndoe/ecommerce-dashboard",
    status: "Syncing",
    lastSync: "Syncing now...",
    branch: "develop",
    commits: 128,
    stars: 8,
    language: "JavaScript",
    private: true,
  },
  {
    id: 3,
    name: "mobile-chat-app",
    fullName: "johndoe/mobile-chat-app",
    status: "Error",
    lastSync: "Failed 1 hour ago",
    branch: "main",
    commits: 67,
    stars: 24,
    language: "React Native",
    private: false,
  },
]

const recentCommits = [
  {
    id: "abc123",
    message: "Add user authentication flow",
    author: "John Doe",
    date: "2 hours ago",
    repo: "sharp-coder-frontend",
    branch: "main",
  },
  {
    id: "def456",
    message: "Fix responsive design issues",
    author: "John Doe",
    date: "1 day ago",
    repo: "ecommerce-dashboard",
    branch: "develop",
  },
  {
    id: "ghi789",
    message: "Implement real-time messaging",
    author: "John Doe",
    date: "2 days ago",
    repo: "mobile-chat-app",
    branch: "feature/messaging",
  },
]

const pullRequests = [
  {
    id: 1,
    title: "Add dark mode support",
    repo: "sharp-coder-frontend",
    status: "Open",
    author: "John Doe",
    created: "3 hours ago",
    comments: 2,
  },
  {
    id: 2,
    title: "Update dependencies",
    repo: "ecommerce-dashboard",
    status: "Merged",
    author: "John Doe",
    created: "1 day ago",
    comments: 0,
  },
]

export function ConnectGit() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!repoUrl.trim()) return

    setIsConnecting(true)
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false)
      setRepoUrl("")
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Syncing":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "Error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPRStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Merged":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Github className="w-8 h-8 mr-3" />
              Connect to Git
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your Git repositories and sync your code</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Github className="w-4 h-4 mr-2" />
            Connect GitHub
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Connect Repository
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Repository URL</label>
                  <Input
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleConnect}
                  disabled={!repoUrl.trim() || isConnecting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect Repository"}
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="repositories" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="commits">Recent Commits</TabsTrigger>
                <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="repositories" className="space-y-4">
                {connectedRepos.map((repo) => (
                  <Card key={repo.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{repo.name}</h3>
                            {repo.private && <Badge variant="secondary">Private</Badge>}
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(repo.status)}
                              <Badge
                                variant={
                                  repo.status === "Connected"
                                    ? "default"
                                    : repo.status === "Error"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {repo.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{repo.fullName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-4 h-4" />
                              <span>{repo.branch}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GitCommit className="w-4 h-4" />
                              <span>{repo.commits} commits</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{repo.stars}</span>
                            </div>
                            <span>{repo.language}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last sync: {repo.lastSync}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="commits" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {recentCommits.map((commit) => (
                        <div key={commit.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <GitCommit className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium">{commit.message}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span>{commit.author}</span>
                                <span>{commit.repo}</span>
                                <span>{commit.branch}</span>
                                <span>{commit.date}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Code2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pulls" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {pullRequests.map((pr) => (
                        <div key={pr.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <GitPullRequest className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium">{pr.title}</p>
                                <Badge className={getPRStatusColor(pr.status)}>{pr.status}</Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>{pr.repo}</span>
                                <span>by {pr.author}</span>
                                <span>{pr.created}</span>
                                <span>{pr.comments} comments</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
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
                <CardTitle className="text-lg">Git Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Repositories</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitCommit className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Total Commits</span>
                  </div>
                  <span className="font-medium">240</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitPullRequest className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Pull Requests</span>
                  </div>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Active Branches</span>
                  </div>
                  <span className="font-medium">8</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Repository
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <GitFork className="w-4 h-4 mr-2" />
                  Fork Repository
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <GitPullRequest className="w-4 h-4 mr-2" />
                  New Pull Request
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <GitCommit className="w-3 h-3 text-blue-500" />
                    <span className="font-medium">Pushed to main</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <GitPullRequest className="w-3 h-3 text-green-500" />
                    <span className="font-medium">Merged PR #24</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">1 day ago</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="font-medium">Starred repository</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">2 days ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
