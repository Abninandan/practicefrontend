import { useState } from 'react'
import { Bell, CalendarDays, Menu, Search } from 'lucide-react'
import type { DashboardSection } from '../../app/dashboardSlice'

interface AdminHeaderProps {
  activeSection: DashboardSection
  dashboardError: boolean
  dashboardLoading: boolean
  onOpenMobileNav: () => void
  onSearchChange: (value: string) => void
  searchTerm: string
}

const sectionTitles: Record<DashboardSection, string> = {
  overview: 'Overview', orders: 'Orders', customers: 'Customers', inventory: 'Inventory', reports: 'Reports',
}

export default function AdminHeader({ activeSection, dashboardError, dashboardLoading, onOpenMobileNav, onSearchChange, searchTerm }: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return <header className="topbar">
    <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={onOpenMobileNav}><Menu size={19} /></button>
    <div className="breadcrumbs"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{sectionTitles[activeSection]}</strong></div>
    <div className="topbar-actions">
      <label className="global-search"><Search size={16} /><input aria-label="Search current page" placeholder="Search anything..." value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} /><kbd>⌘ K</kbd></label>
      <div className="notification-wrap"><button className={`icon-button notification-button ${notificationsOpen ? 'is-active' : ''}`} aria-label="Notifications" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18} /><span /></button>{notificationsOpen && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><span>2 new</span></div><p><i className="notification-dot" />New order <b>#OR-2841</b> has been paid.</p><p><i className="notification-dot notification-dot--amber" />Only 7 units left of Field Notes Set.</p></div>}</div>
      <div className={`api-indicator ${dashboardError ? 'api-indicator--error' : ''}`} title={dashboardError ? 'The dashboard API request failed.' : 'Protected dashboard API status'}><i />{dashboardLoading ? 'Connecting' : dashboardError ? 'API unavailable' : 'API connected'}</div>
      <div className="topbar-divider" />
      <div className="topbar-date"><CalendarDays size={16} /><span>Sep 28, 2026</span></div>
    </div>
  </header>
}
