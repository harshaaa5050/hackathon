import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
