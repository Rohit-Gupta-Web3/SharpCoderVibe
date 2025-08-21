"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "../contexts/theme-context"
import { Sidebar } from "../components/sidebar"
import { Dashboard } from "../components/dashboard"
import { AIEditor } from "../components/ai-editor"
import { Database } from "../components/database"
import { RecentProjects } from "../components/recent-projects"
import { ImportFigma } from "../components/import-figma"
import { ConnectGit } from "../components/connect-git"
import { ProfileSettings } from "../components/profile-settings"
import { Settings } from "../components/settings"

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
        case "dashboard":
          return <Dashboard onImportFigma={() => setActiveTab("figma")} />
      case "editor":
        return <AIEditor />
      case "database":
        return <Database />
      case "recent":
        return <RecentProjects />
      case "figma":
        return <ImportFigma />
      case "git":
        return <ConnectGit />
      case "profile":
        return <ProfileSettings />
      case "settings":
        return <Settings />
        default:
          return <Dashboard onImportFigma={() => setActiveTab("figma")} />
    }
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  )
}

export default function App() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('scv_token')
    const email = localStorage.getItem('scv_user_email')
    const exp = localStorage.getItem('scv_token_expiry')
    if (!token || !email) {
      router.replace('/signup')
      return
    }
    if (!exp || Number(exp) < Date.now()) {
      router.replace('/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
