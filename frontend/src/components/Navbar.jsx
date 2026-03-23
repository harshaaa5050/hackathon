import { useAuth } from '@/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, Heart } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return null

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/checkin', label: 'Check-in' },
    { to: '/chat', label: 'Chat' },
    { to: '/community', label: 'Community' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/education', label: 'Learn' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">MatriAI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <button onClick={handleLogout} className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background p-3 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-accent">
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-destructive rounded-md hover:bg-accent">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
