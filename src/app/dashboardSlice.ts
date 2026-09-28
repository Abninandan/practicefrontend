import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type DashboardSection = 'overview' | 'orders' | 'customers' | 'inventory' | 'reports'
export type DateRange = '7d' | '30d' | '90d'

interface DashboardState {
  activeSection: DashboardSection
  dateRange: DateRange
  searchTerm: string
}

const initialState: DashboardState = {
  activeSection: 'overview',
  dateRange: '30d',
  searchTerm: '',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<DashboardSection>) {
      state.activeSection = action.payload
      state.searchTerm = ''
    },
    setDateRange(state, action: PayloadAction<DateRange>) {
      state.dateRange = action.payload
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload
    },
  },
})

export const { setActiveSection, setDateRange, setSearchTerm } = dashboardSlice.actions
export default dashboardSlice.reducer
