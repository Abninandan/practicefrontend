import type { ReactNode } from 'react'
import type { NavigateFunction } from 'react-router-dom'
import type { DashboardSection } from '../../app/dashboardSlice'
import type { User } from '../../app/userSlice'
import AdminFooter from './AdminFooter'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  activeSection: DashboardSection
  children: ReactNode
  currentUser: User | null
  dashboardError: boolean
  dashboardLoading: boolean
  mobileNavOpen: boolean
  navigate: NavigateFunction
  onCloseMobileNav: () => void
  onLogout: () => void
  onOpenMobileNav: () => void
  onSearchChange: (value: string) => void
  searchTerm: string
}

export default function AdminLayout(props: AdminLayoutProps) {
  return <div className="app-shell">
    <AdminSidebar
      activeSection={props.activeSection}
      currentUser={props.currentUser}
      mobileNavOpen={props.mobileNavOpen}
      navigate={props.navigate}
      onCloseMobileNav={props.onCloseMobileNav}
      onLogout={props.onLogout}
    />
    <main className="main-area">
      <AdminHeader
        activeSection={props.activeSection}
        dashboardError={props.dashboardError}
        dashboardLoading={props.dashboardLoading}
        onOpenMobileNav={props.onOpenMobileNav}
        onSearchChange={props.onSearchChange}
        searchTerm={props.searchTerm}
      />
      <div className="page-content">{props.children}<AdminFooter /></div>
    </main>
  </div>
}
