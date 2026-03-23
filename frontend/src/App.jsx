import HeroPage from "@/pages/Hero";
import LoginPage from "./pages/Register";

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
