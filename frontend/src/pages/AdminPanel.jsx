import { useState, useEffect } from 'react'
import API from '@/api/axios'
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function AdminPanel() {
  const [doctors, setDoctors] = useState([])
  const [allDoctors, setAllDoctors] = useState([])
  const [tab, setTab] = useState('pending')

  const fetchDoctors = () => {
    API.get('/admin/doctors/pending').then(r => setDoctors(r.data)).catch(() => {})
    API.get('/admin/doctors').then(r => setAllDoctors(r.data)).catch(() => {})
  }

  useEffect(() => { fetchDoctors() }, [])

  const approve = async (id) => {
    await API.post(`/admin/doctors/${id}/approve`)
    fetchDoctors()
  }

  const reject = async (id) => {
    const reason = prompt('Rejection reason (optional):')
    await API.post(`/admin/doctors/${id}/reject`, { reason })
    fetchDoctors()
  }

  const displayList = tab === 'pending' ? doctors : allDoctors

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-purple-500" />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-purple-500 text-white' : 'bg-muted'}`}>
          <Clock className="inline h-3.5 w-3.5 mr-1" /> Pending ({doctors.length})
        </button>
        <button onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-purple-500 text-white' : 'bg-muted'}`}>
          All Doctors ({allDoctors.length})
        </button>
      </div>

      <div className="space-y-3">
        {displayList.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No doctors to display.</p>}
        {displayList.map(d => (
          <div key={d._id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">Dr. {d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.specialization} · {d.experience} yrs · License: {d.licenseNumber}</p>
                {d.bio && <p className="text-xs text-muted-foreground mt-1">{d.bio}</p>}
              </div>
              <div className="flex items-center gap-2">
                {d.verificationStatus === 'approved' && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
                {d.verificationStatus === 'rejected' && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                    <XCircle className="h-3 w-3" /> Rejected
                  </span>
                )}
                {d.verificationStatus === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => approve(d._id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button onClick={() => reject(d._id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600">
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
