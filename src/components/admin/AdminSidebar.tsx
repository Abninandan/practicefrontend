import {
  Activity,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
} from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import type { DashboardSection } from '../../app/dashboardSlice'
import type { User } from '../../app/userSlice'

interface AdminSidebarProps {
  activeSection: DashboardSection
  currentUser: User | null
  mobileNavOpen: boolean
  navigate: NavigateFunction
  onCloseMobileNav: () => void
  onLogout: () => void
}

const navigation: { id: DashboardSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: CreditCard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'reports', label: 'Reports', icon: Activity },
]

export default function AdminSidebar({ activeSection, currentUser, mobileNavOpen, navigate, onCloseMobileNav, onLogout }: AdminSidebarProps) {
  const initials = currentUser?.name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'AD'

  return <>
    {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={onCloseMobileNav} />}
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar--open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Activity size={17} strokeWidth={2.5} /></span><span>northstar</span><span className="brand-tag">ADMIN</span></div>
      <div className="workspace-switcher"><div className="workspace-avatar">N</div><div className="workspace-copy"><strong>Northstar Goods</strong><span>Workspace</span></div><ChevronDown size={15} /></div>
      <p className="nav-caption">WORKSPACE</p>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${activeSection === id ? 'nav-item--active' : ''}`} onClick={() => { navigate(id === 'overview' ? '/admin/dashboard' : `/admin/dashboard/${id}`); onCloseMobileNav() }}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{id === 'orders' && <span className="nav-count">8</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-note"><span className="note-icon"><Activity size={15} /></span><div><strong>Store health</strong><span>Everything is running smoothly.</span></div><span className="health-dot" /></div>
      <div className="sidebar-footer">
        <button className="nav-item"><Settings size={18} strokeWidth={1.8} /><span>Settings</span></button>
        <button className="nav-item"><CircleHelp size={18} strokeWidth={1.8} /><span>Help center</span></button>
        <button className="nav-item" onClick={onLogout}><LogOut size={18} strokeWidth={1.8} /><span>Sign out</span></button>
        <div className="profile-row"><div className="profile-avatar">{initials}</div><div className="profile-copy"><strong>{currentUser?.name || 'Administrator'}</strong><span>{currentUser?.role || currentUser?.email || 'Store owner'}</span></div></div>
      </div>
    </aside>
  </>
}
