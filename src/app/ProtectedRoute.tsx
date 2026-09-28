import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useGetDashboardQuery } from './api'
import { useAppSelector } from './hooks'

export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)
  const location = useLocation()
  const { isLoading, isError, refetch } = useGetDashboardQuery(undefined, { skip: !token })

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (isLoading) {
    return <main className="route-check-state" role="status">Verifying your session...</main>
  }

  if (isError) {
    return (
      <main className="route-check-state">
        <p>Your session could not be verified.</p>
        <button type="button" onClick={() => void refetch()}>Try again</button>
      </main>
    )
  }

  return <Outlet />
}
