import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Download,
  Package,
  Search,
  Users,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardSection, DateRange } from './app/dashboardSlice'
import { setActiveSection, setDateRange, setSearchTerm } from './app/dashboardSlice'
import { adminApi, useGetDashboardQuery } from './app/api'
import { clearToken } from './app/authSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'
import LoginPage from './app/LoginPage'
import ProtectedRoute from './app/ProtectedRoute'
import { clearUser, setUser } from './app/userSlice'
import AdminLayout from './components/admin/AdminLayout'
import './App.css'

const chartByRange: Record<DateRange, { label: string; revenue: number; expenses: number }[]> = {
  '7d': [
    { label: 'Mon', revenue: 22, expenses: 12 }, { label: 'Tue', revenue: 31, expenses: 16 },
    { label: 'Wed', revenue: 27, expenses: 14 }, { label: 'Thu', revenue: 39, expenses: 19 },
    { label: 'Fri', revenue: 34, expenses: 17 }, { label: 'Sat', revenue: 46, expenses: 23 },
    { label: 'Sun', revenue: 42, expenses: 20 },
  ],
  '30d': [
    { label: 'Aug 29', revenue: 23, expenses: 12 }, { label: 'Sep 03', revenue: 34, expenses: 15 },
    { label: 'Sep 08', revenue: 28, expenses: 13 }, { label: 'Sep 13', revenue: 46, expenses: 21 },
    { label: 'Sep 18', revenue: 39, expenses: 17 }, { label: 'Sep 23', revenue: 57, expenses: 25 },
    { label: 'Sep 28', revenue: 51, expenses: 22 },
  ],
  '90d': [
    { label: 'Jul 01', revenue: 20, expenses: 13 }, { label: 'Jul 15', revenue: 31, expenses: 16 },
    { label: 'Jul 29', revenue: 27, expenses: 14 }, { label: 'Aug 12', revenue: 39, expenses: 20 },
    { label: 'Aug 26', revenue: 36, expenses: 18 }, { label: 'Sep 09', revenue: 52, expenses: 25 },
    { label: 'Sep 23', revenue: 61, expenses: 27 },
  ],
}

const channelData = [
  { name: 'Direct', value: 42, color: '#277c69' },
  { name: 'Social', value: 28, color: '#e88365' },
  { name: 'Referral', value: 18, color: '#e8b34e' },
  { name: 'Email', value: 12, color: '#7a9cce' },
]

const orders = [
  { id: '#OR-2841', customer: 'Maya Chen', initials: 'MC', item: 'Studio Headphones', date: 'Sep 28, 2026', amount: '$248.00', status: 'Paid' },
  { id: '#OR-2840', customer: 'Elliot Park', initials: 'EP', item: 'Field Notes Set', date: 'Sep 28, 2026', amount: '$86.50', status: 'Processing' },
  { id: '#OR-2839', customer: 'Amara Okafor', initials: 'AO', item: 'Ceramic Pour-over', date: 'Sep 27, 2026', amount: '$124.00', status: 'Paid' },
  { id: '#OR-2838', customer: 'Jonah Miller', initials: 'JM', item: 'Canvas Weekender', date: 'Sep 27, 2026', amount: '$310.00', status: 'Refunded' },
  { id: '#OR-2837', customer: 'Sofia Alvarez', initials: 'SA', item: 'Linen Desk Mat', date: 'Sep 26, 2026', amount: '$72.00', status: 'Paid' },
]

const sectionContent: Record<Exclude<DashboardSection, 'overview'>, { title: string; subtitle: string; columns: string[] }> = {
  orders: { title: 'Orders', subtitle: 'Track and manage recent customer orders.', columns: ['Order', 'Customer', 'Item', 'Date', 'Amount', 'Status'] },
  customers: { title: 'Customers', subtitle: 'The people behind your growing community.', columns: ['Customer', 'Latest order', 'Orders', 'Lifetime value', 'Joined', 'Status'] },
  inventory: { title: 'Inventory', subtitle: 'Keep an eye on stock levels across your catalog.', columns: ['Product', 'SKU', 'Category', 'In stock', 'Reorder at', 'Status'] },
  reports: { title: 'Reports', subtitle: 'A clear view of your store performance.', columns: ['Report', 'Period', 'Updated', 'Owner', 'Format', 'Status'] },
}

const sectionRows: Record<Exclude<DashboardSection, 'overview'>, string[][]> = {
  orders: orders.map((order) => [order.id, order.customer, order.item, order.date, order.amount, order.status]),
  customers: [
    ['Maya Chen', 'Studio Headphones', '12', '$2,840.00', 'Mar 12, 2026', 'Active'],
    ['Elliot Park', 'Field Notes Set', '8', '$1,126.50', 'Apr 02, 2026', 'Active'],
    ['Amara Okafor', 'Ceramic Pour-over', '6', '$984.00', 'May 18, 2026', 'Active'],
    ['Jonah Miller', 'Canvas Weekender', '4', '$1,310.00', 'Jun 21, 2026', 'At risk'],
    ['Sofia Alvarez', 'Linen Desk Mat', '3', '$472.00', 'Aug 04, 2026', 'Active'],
  ],
  inventory: [
    ['Studio Headphones', 'ST-HDP-04', 'Audio', '18', '12', 'In stock'],
    ['Field Notes Set', 'FN-SET-02', 'Stationery', '7', '10', 'Low stock'],
    ['Ceramic Pour-over', 'CP-CLR-01', 'Kitchen', '32', '8', 'In stock'],
    ['Canvas Weekender', 'CW-BLK-03', 'Travel', '4', '8', 'Low stock'],
    ['Linen Desk Mat', 'LD-SND-05', 'Workspace', '0', '6', 'Out of stock'],
  ],
  reports: [
    ['Monthly revenue', 'Sep 2026', 'Today, 9:42 AM', 'Finance team', 'CSV', 'Ready'],
    ['Customer cohort', 'Q3 2026', 'Yesterday', 'Growth team', 'PDF', 'Ready'],
    ['Inventory snapshot', 'Sep 2026', 'Sep 27, 2026', 'Operations', 'CSV', 'Ready'],
    ['Channel attribution', 'Q3 2026', 'Sep 25, 2026', 'Marketing', 'PDF', 'Ready'],
    ['Order fulfillment', 'Sep 2026', 'Sep 24, 2026', 'Operations', 'CSV', 'Ready'],
  ],
}

const metrics = [
  { label: 'Gross revenue', value: '$48,294', change: '12.8%', trend: 'up', icon: CreditCard, note: 'vs previous period' },
  { label: 'Orders placed', value: '1,284', change: '8.2%', trend: 'up', icon: Package, note: 'vs previous period' },
  { label: 'New customers', value: '382', change: '3.1%', trend: 'down', icon: Users, note: 'vs previous period' },
  { label: 'Avg. order value', value: '$86.40', change: '6.4%', trend: 'up', icon: Activity, note: 'vs previous period' },
]

function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { section } = useParams<{ section?: string }>()
  const { activeSection, dateRange, searchTerm } = useAppSelector((state) => state.dashboard)
  const currentUser = useAppSelector((state) => state.user.currentUser)
  const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError } = useGetDashboardQuery()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const chartData = chartByRange[dateRange]
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || 'there'

  useEffect(() => {
    const routeSection = section || 'overview'
    if (routeSection === 'overview' || routeSection in sectionContent) {
      dispatch(setActiveSection(routeSection as DashboardSection))
    } else {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [dispatch, navigate, section])

  useEffect(() => {
    if (dashboardData?.user) dispatch(setUser(dashboardData.user))
  }, [dashboardData?.user, dispatch])

  const handleLogout = () => {
    dispatch(clearToken())
    dispatch(clearUser())
    dispatch(adminApi.util.resetApiState())
  }

  const visibleRows = useMemo(() => {
    if (activeSection === 'overview') return []
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return sectionRows[activeSection].filter((row) => row.join(' ').toLowerCase().includes(normalizedSearch))
  }, [activeSection, searchTerm])

  const exportReport = () => {
    const csv = ['Order,Customer,Item,Date,Amount,Status', ...orders.map((order) =>
      [order.id, order.customer, order.item, order.date, order.amount, order.status].join(','),
    )].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'northstar-orders.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      currentUser={currentUser}
      dashboardError={dashboardError}
      dashboardLoading={dashboardLoading}
      mobileNavOpen={mobileNavOpen}
      navigate={navigate}
      onCloseMobileNav={() => setMobileNavOpen(false)}
      onLogout={handleLogout}
      onOpenMobileNav={() => setMobileNavOpen(true)}
      onSearchChange={(value) => dispatch(setSearchTerm(value))}
      searchTerm={searchTerm}
    >
          {activeSection === 'overview' ? (
            <>
              <section className="page-heading">
                <div><p className="eyebrow">MONDAY, SEPTEMBER 28, 2026</p><h1>Good morning, {firstName} <span className="greeting-mark">✳</span></h1><p className="page-subtitle">Here&apos;s what&apos;s happening with your store today.</p></div>
                <div className="heading-actions"><button className="button button--secondary" onClick={exportReport}><Download size={16} />Export report</button><button className="button button--primary"><span className="button-plus">+</span> New order</button></div>
              </section>

              <section className="metric-grid" aria-label="Store metrics">
                {metrics.map(({ label, value, change, trend, icon: Icon, note }, index) => <article className={`metric-card metric-card--${index + 1}`} key={label}><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17} /></span></div><div className="metric-value">{value}</div><div className="metric-foot"><span className={`metric-change metric-change--${trend}`}>{trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}</span><span>{note}</span></div></article>)}
              </section>

              <section className="analytics-grid">
                <article className="panel revenue-panel">
                  <div className="panel-header"><div><p className="panel-kicker">PERFORMANCE</p><h2>Revenue overview</h2></div><select className="range-select" aria-label="Revenue date range" value={dateRange} onChange={(event) => dispatch(setDateRange(event.target.value as DateRange))}><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option></select></div>
                  <div className="chart-summary"><strong>$48,294.00</strong><span className="metric-change metric-change--up"><ArrowUpRight size={14} />12.8%</span><span>compared to previous period</span></div>
                  <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#277c69" stopOpacity={0.22} /><stop offset="95%" stopColor="#277c69" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#e9ece7" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8b938e', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b938e', fontSize: 11 }} tickFormatter={(value: number) => `$${value}k`} /><Tooltip contentStyle={{ border: '1px solid #e6e9e4', borderRadius: 8, fontSize: 12 }} formatter={(value) => [`$${value}k`, '']} /><Area type="monotone" dataKey="revenue" stroke="#277c69" strokeWidth={2.5} fill="url(#revenueFill)" /><Area type="monotone" dataKey="expenses" stroke="#e88365" strokeWidth={2} fill="transparent" strokeDasharray="5 5" /></AreaChart></ResponsiveContainer></div>
                  <div className="chart-legend"><span><i className="legend-dot legend-dot--green" />Revenue</span><span><i className="legend-dot legend-dot--coral" />Expenses</span><span className="chart-updated">Updated just now</span></div>
                </article>

                <article className="panel channel-panel">
                  <div className="panel-header"><div><p className="panel-kicker">ACQUISITION</p><h2>Sales by channel</h2></div><button className="more-button" aria-label="More channel options"><span>···</span></button></div>
                  <div className="channel-chart-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={channelData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={83} paddingAngle={3} stroke="none">{channelData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'Share']} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>1,284</strong><span>total orders</span></div></div>
                  <div className="channel-legend">{channelData.map((channel) => <div className="channel-row" key={channel.name}><span><i style={{ backgroundColor: channel.color }} />{channel.name}</span><strong>{channel.value}%</strong></div>)}</div>
                </article>
              </section>

              <section className="panel orders-panel">
                <div className="panel-header orders-header"><div><p className="panel-kicker">THE LATEST</p><h2>Recent orders</h2></div><button className="text-link" onClick={() => navigate('/admin/dashboard/orders')}>View all orders <ArrowRight size={15} /></button></div>
                <div className="table-scroll"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>ITEM</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{orders.slice(0, 4).map((order) => <tr key={order.id}><td className="order-id">{order.id}</td><td><span className="customer-cell"><span className="customer-avatar">{order.initials}</span>{order.customer}</span></td><td>{order.item}</td><td>{order.date}</td><td className="amount-cell">{order.amount}</td><td><span className={`status status--${order.status.toLowerCase()}`}>{order.status}</span></td></tr>)}</tbody></table></div>
              </section>
            </>
          ) : (
            <>
              <section className="page-heading section-heading"><div><p className="eyebrow">NORTHSTAR GOODS / WORKSPACE</p><h1>{sectionContent[activeSection].title}</h1><p className="page-subtitle">{sectionContent[activeSection].subtitle}</p></div><div className="heading-actions"><button className="button button--secondary" onClick={exportReport}><Download size={16} />Export report</button><button className="button button--primary"><span className="button-plus">+</span> Add {activeSection === 'orders' ? 'order' : activeSection === 'customers' ? 'customer' : activeSection === 'inventory' ? 'product' : 'report'}</button></div></section>
              <section className="panel data-panel"><div className="panel-header data-panel-header"><div><p className="panel-kicker">{visibleRows.length} RECORDS</p><h2>{sectionContent[activeSection].title} directory</h2></div><label className="table-search"><Search size={15} /><input placeholder={`Search ${activeSection}...`} value={searchTerm} onChange={(event) => dispatch(setSearchTerm(event.target.value))} />{searchTerm && <button aria-label="Clear search" onClick={() => dispatch(setSearchTerm(''))}><X size={14} /></button>}</label></div><div className="table-scroll"><table><thead><tr>{sectionContent[activeSection].columns.map((column) => <th key={column}>{column.toUpperCase()}</th>)}</tr></thead><tbody>{visibleRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{index === row.length - 1 ? <span className={`status status--${cell.toLowerCase().replaceAll(' ', '-')}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table>{visibleRows.length === 0 && <div className="empty-state"><Search size={18} /><span>No matching {activeSection} found.</span></div>}</div></section>
            </>
          )}
    </AdminLayout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/dashboard/:section" element={<DashboardPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}

export default App
