"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  Globe,
  Code2,
  Smartphone,
  ShoppingCart,
  MessageCircle,
  Calendar,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const projects = [
  {
    id: 1,
    name: "E-commerce Dashboard",
    type: "Web App",
    status: "Completed",
    lastModified: "2 hours ago",
    created: "2024-01-15",
    icon: ShoppingCart,
    color: "bg-blue-500",
    description: "Modern e-commerce admin dashboard with analytics",
    technologies: ["React", "Next.js", "Tailwind"],
    starred: true,
  },
  {
    id: 2,
    name: "Chat Application",
    type: "Mobile App",
    status: "In Progress",
    lastModified: "1 day ago",
    created: "2024-01-10",
    icon: MessageCircle,
    color: "bg-green-500",
    description: "Real-time messaging app with voice calls",
    technologies: ["React Native", "Socket.io", "Node.js"],
    starred: false,
  },
  {
    id: 3,
    name: "Portfolio Website",
    type: "Website",
    status: "Completed",
    lastModified: "3 days ago",
    created: "2024-01-05",
    icon: Globe,
    color: "bg-purple-500",
    description: "Personal portfolio with blog and contact form",
    technologies: ["Next.js", "MDX", "Framer Motion"],
    starred: true,
  },
  {
    id: 4,
    name: "Task Manager",
    type: "Web App",
    status: "Draft",
    lastModified: "1 week ago",
    created: "2023-12-28",
    icon: Calendar,
    color: "bg-orange-500",
    description: "Team collaboration and task management tool",
    technologies: ["Vue.js", "Express", "MongoDB"],
    starred: false,
  },
  {
    id: 5,
    name: "Landing Page",
    type: "Website",
    status: "Completed",
    lastModified: "2 weeks ago",
    created: "2023-12-20",
    icon: Code2,
    color: "bg-pink-500",
    description: "SaaS product landing page with pricing",
    technologies: ["HTML", "CSS", "JavaScript"],
    starred: false,
  },
  {
    id: 6,
    name: "Mobile Banking App",
    type: "Mobile App",
    status: "In Progress",
    lastModified: "3 weeks ago",
    created: "2023-12-15",
    icon: Smartphone,
    color: "bg-indigo-500",
    description: "Secure mobile banking application",
    technologies: ["Flutter", "Firebase", "Stripe"],
    starred: true,
  },
]

export function RecentProjects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [projectList, setProjectList] = useState(projects)

  const toggleStar = (projectId: number) => {
    setProjectList((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, starred: !project.starred } : project)),
    )
  }

  const filteredProjects = projectList.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recent Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track your development projects</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Code2 className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === "in progress" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("in progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant={filterStatus === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("draft")}
                >
                  Draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${project.color}`}>
                      <project.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{project.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleStar(project.id)} className="p-1">
                      <Star
                        className={`w-4 h-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.lastModified}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
