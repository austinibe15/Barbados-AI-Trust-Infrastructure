import { useState } from "react"
import type { ReactNode } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[270px]">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  )
}