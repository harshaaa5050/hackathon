import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import API from '@/api/axios'

export default function DoctorRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', licenseNumber: '', experience: '', bio: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/doctor/register', { ...form, experience: Number(form.experience) })
      navigate('/doctor/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'specialization', label: 'Specialization', type: 'text', placeholder: 'e.g. Psychiatry, OB-GYN' },
    { key: 'licenseNumber', label: 'License / Registration No.', type: 'text' },
    { key: 'experience', label: 'Years of Experience', type: 'number' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Stethoscope className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">MatriAI — Doctor</h1>
          </div>
          <p className="text-muted-foreground text-sm">Join our network of verified professionals</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Doctor Registration</h2>
          {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium mb-1 block">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                  placeholder={f.placeholder || ''} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1 block">Bio (optional)</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Registering...' : 'Register as Doctor'}
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-muted-foreground">After registration, your profile will be reviewed and verified by our team.</p>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already registered? <Link to="/doctor/login" className="text-blue-500 hover:underline font-medium">Doctor Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
