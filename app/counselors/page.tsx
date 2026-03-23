'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ClipboardCheck, Lightbulb, Stethoscope, Phone, Shield, Globe } from 'lucide-react'
import { STAGE_COLORS, COUNSELORS, CRISIS_RESOURCES } from '@/lib/matriai-data'
import { getUser } from '@/lib/matriai-storage'
import { toast } from 'sonner'

export default function CounselorsPage() {
  const [user, setUser] = useState(getUser())
  const stage = user?.lifeStage || 'unsure'
  const stageColor = STAGE_COLORS[stage] || STAGE_COLORS.unsure

  useEffect(() => { setUser(getUser()) }, [])

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl font-medium">Talk to someone</h1>
      </div>

      <div className="px-4 max-w-2xl mx-auto space-y-4">
        {/* ═══ CRISIS BANNER ═══ */}
        <Card className="border-0 shadow-md bg-red-500/5 border-l-4 border-l-red-500">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-semibold text-red-600 mb-3">If you&apos;re in crisis right now:</p>
            <div className="space-y-2">
              {CRISIS_RESOURCES.map(r => (
                <a
                  key={r.number}
                  href={`tel:${r.number.replace(/-/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="text-sm font-mono">{r.number}</span>
                  </div>
                  <Phone className="h-4 w-4 text-red-500" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ═══ COUNSELOR CARDS ═══ */}
        {COUNSELORS.map((c, idx) => (
          <Card key={idx} className="border-0 shadow-md">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ backgroundColor: stageColor.accent + '20', color: stageColor.accent }}
                >
                  {c.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.credentials}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-600 shrink-0">
                      <Shield className="h-3 w-3" /> RCI Verified
                    </span>
                  </div>

                  {/* Specialisations */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.specialisations.map(s => (
                      <span key={s} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${stageColor.light} ${stageColor.text}`}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {c.languages.join(', ')}
                  </div>

                  {/* Availability */}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Next available: <span className="font-medium text-foreground">{c.available}</span>
                  </p>

                  {/* Book button */}
                  <Button
                    size="sm"
                    className="mt-3 gap-1 text-xs"
                    onClick={() => toast.info('Coming soon! This feature is under development.')}
                  >
                    Book a session <Stethoscope className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2">
          {[
            { href: '/dashboard',  icon: Home,           label: 'Home' },
            { href: '/dashboard',  icon: ClipboardCheck, label: 'Check-in' },
            { href: '/techniques', icon: Lightbulb,      label: 'Techniques' },
            { href: '/counselors', icon: Stethoscope,    label: 'Counselors', active: true },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                item.active ? stageColor.text : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
