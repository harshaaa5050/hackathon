import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import API from '@/api/axios'

export default function DoctorLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/doctor/login', { email, password })
      navigate('/doctor/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Stethoscope className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Doctor Portal</h1>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Doctor Login</h2>
          {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Not registered? <Link to="/doctor/register" className="text-blue-500 hover:underline font-medium">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
