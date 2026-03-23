import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import DoctorRegister from '@/pages/DoctorRegister'
import DoctorLogin from '@/pages/DoctorLogin'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import DailyCheckIn from '@/pages/DailyCheckIn'
import Chat from '@/pages/Chat'
import Community from '@/pages/Community'
import CommunityThread from '@/pages/CommunityThread'
import Analytics from '@/pages/Analytics'
import Education from '@/pages/Education'
import DoctorDashboard from '@/pages/DoctorDashboard'
import AdminPanel from '@/pages/AdminPanel'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />

        {/* Protected user routes */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><DailyCheckIn /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/community/:id" element={<ProtectedRoute><CommunityThread /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

        {/* Doctor portal */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

        {/* Fallback */}
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
