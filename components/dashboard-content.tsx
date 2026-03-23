'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoodCheckin } from '@/components/mood-checkin'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  MessageCircle, ChevronDown, Home, ClipboardCheck,
  Lightbulb, Stethoscope, TrendingUp, Flame,
} from 'lucide-react'
import { STAGE_COLORS } from '@/lib/matriai-data'
import {
  getUser, saveUser, createNewUser, generateSeedData, todayCheckedIn,
  getWeeklyData, getAvgScore7d, getStreak, generateContextBullets,
  type MatriAIUser,
} from '@/lib/matriai-storage'

interface CheckinData {
  id: string
  mood: number
  energy: number
  sleep_quality: number
  notes: string | null
  created_at: string
}

interface ProfileData {
  full_name: string | null
  life_stage: string | null
}

interface DashboardContentProps {
  profile: ProfileData
  recentCheckins: CheckinData[]
  hasCheckedInToday: boolean
}

export function DashboardContent({
  profile,
  recentCheckins: _recentCheckins,
  hasCheckedInToday: _hasCheckedInToday,
}: DashboardContentProps) {
  const [localUser, setLocalUser] = useState<MatriAIUser | null>(null)
  const [showCheckin, setShowCheckin] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const firstName = profile.full_name?.split(' ')[0] || localUser?.pseudonym || 'there'
  const stage = localUser?.lifeStage || profile.life_stage || 'unsure'
  const stageColor = STAGE_COLORS[stage] || STAGE_COLORS.unsure

  // Time-based greeting (client-only)
  const [greeting, setGreeting] = useState('')
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Load local user data
  useEffect(() => {
    let user = getUser()
    if (!user) {
      // Create with seed data if no localStorage user
      const newUser = createNewUser()
      newUser.lifeStage = stage
      newUser.pseudonym = firstName
      newUser.onboardingComplete = true
      const seed = generateSeedData(stage)
      newUser.checkIns = seed.checkIns
      newUser.screenings = [seed.screening]
      saveUser(newUser)
      user = newUser
    }
    setLocalUser(user)

    // Show check-in if not done today
    if (!todayCheckedIn(user.checkIns)) {
      setShowCheckin(true)
    }
  }, [stage, firstName])

  // Computed data
  const weeklyData = useMemo(() => localUser ? getWeeklyData(localUser.checkIns) : [], [localUser])
  const avgScore = useMemo(() => localUser ? getAvgScore7d(localUser.checkIns) : -1, [localUser])
  const streak = useMemo(() => localUser ? getStreak(localUser.checkIns) : 0, [localUser])
  const contextBullets = useMemo(() => localUser ? generateContextBullets(localUser) : [], [localUser])

  const latestCheckIn = localUser?.checkIns[localUser.checkIns.length - 1]
  const latestScreening = localUser?.screenings[localUser.screenings.length - 1]
  const weekCheckIns = localUser?.checkIns.filter(c => {
    const diff = Date.now() - new Date(c.date).getTime()
    return diff <= 7 * 86400000
  }).length || 0

  const maxBarScore = 100

  const getSeverityClass = (s: number) => {
    if (s >= 70) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Low' }
    if (s >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Moderate' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Severe' }
  }

  // ─── CHECK-IN MODAL ────────────────────────────────────
  if (showCheckin) {
    return (
      <>
        <main className="px-4 py-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-medium">{greeting}, {firstName}</h1>
            <p className="text-muted-foreground mt-1">Your daily check-in is ready</p>
          </div>
        </main>
        <MoodCheckin onComplete={() => {
          setShowCheckin(false)
          setLocalUser(getUser())
        }} />
      </>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <main className="px-4 py-6 max-w-2xl mx-auto pb-24 space-y-5">


        {/* ═══ HEADER ═══ */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-medium">{greeting}, {firstName}</h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageColor.light} ${stageColor.text}`}>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </span>
            {streak >= 2 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600">
                <Flame className="h-3.5 w-3.5" /> {streak} day streak
              </span>
            )}
          </div>
        </div>

        {/* ═══ WEEKLY MOOD CHART ═══ */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your week at a glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-36">
              {weeklyData.map((d, i) => {
                const hasData = d.score >= 0
                const heightPct = hasData ? (d.score / maxBarScore) * 100 : 0
                const sev = hasData ? getSeverityClass(d.score) : null
                const isToday = d.date === today
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    {hasData ? (
                      <div className="w-full relative flex flex-col justify-end h-full">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${sev?.bg} ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                          style={{ height: `${Math.max(heightPct, 8)}%` }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-end">
                        <div className="w-full h-2 rounded-t-md bg-muted/30" />
                      </div>
                    )}
                    <span className={`text-[10px] ${isToday ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                      {d.day}
                    </span>
                  </div>
                )
              })}
            </div>
            {avgScore > 0 && (
              <p className="text-sm text-center mt-3">
                Average this week: <span className={`font-semibold ${stageColor.text}`}>{avgScore}/100</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* ═══ STATUS CARD ═══ */}
        {avgScore > 0 && (
          <Card className={`border-0 shadow-md ${
            avgScore >= 70 ? 'bg-green-500/5' : avgScore >= 40 ? 'bg-amber-500/5' : 'bg-red-500/5'
          }`}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  avgScore >= 70 ? 'bg-green-500/10' : avgScore >= 40 ? 'bg-amber-500/10' : 'bg-red-500/10'
                }`}>
                  {avgScore >= 70 ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14s1.5-2 4-2 5 4 8 4 4-2 4-2" strokeLinecap="round" /></svg>
                  ) : avgScore >= 40 ? (
                    <svg viewBox="0 0 40 40" className="w-5 h-5 text-amber-500"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="14" cy="16" r="2" fill="currentColor" /><circle cx="26" cy="16" r="2" fill="currentColor" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-base font-medium">
                    {avgScore >= 70 ? "You're maintaining well" : avgScore >= 40 ? 'Some days are harder than others' : 'It might help to talk to someone'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {avgScore >= 70 ? 'Your recent check-ins show positive patterns. Keep nurturing yourself.' :
                     avgScore >= 40 ? 'Here are techniques that may help with what you\'re experiencing.' :
                     'Your scores suggest you may benefit from professional support. You don\'t have to navigate this alone.'}
                  </p>
                  <Button asChild variant="ghost" size="sm" className="mt-2 gap-1 px-0 hover:bg-transparent">
                    <Link href={avgScore >= 70 ? '#' : avgScore >= 40 ? '/techniques' : '/counselors'}>
                      {avgScore >= 70 ? 'View affirmations' : avgScore >= 40 ? 'See techniques for you' : 'Find a counselor'}
                      <ChevronDown className="h-3 w-3 -rotate-90" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ═══ QUICK STATS ═══ */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Latest score</p>
              <p className={`text-xl font-bold ${latestCheckIn ? getSeverityClass(latestCheckIn.computedScore).text : ''}`}>
                {latestCheckIn ? latestCheckIn.computedScore : '--'}
                <span className="text-xs font-normal text-muted-foreground">/100</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">This week</p>
              <p className="text-xl font-bold">
                {weekCheckIns}<span className="text-xs font-normal text-muted-foreground">/7</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">{latestScreening?.type || 'Screening'}</p>
              <p className={`text-xl font-bold ${latestScreening ? getSeverityClass(latestScreening.severity === 'low' ? 70 : latestScreening.severity === 'moderate' ? 50 : 20).text : ''}`}>
                {latestScreening ? latestScreening.score : '--'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ═══ AI COMPANION CONTEXT ═══ */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-5">
            <h3 className="font-serif text-base font-medium mb-3">Your companion knows:</h3>
            <ul className="space-y-2 mb-4">
              {contextBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {b}
                </li>
              ))}
              {contextBullets.length === 0 && (
                <li className="text-sm text-muted-foreground">Complete your first check-in to see personalised insights.</li>
              )}
            </ul>
            <Button asChild className="w-full gap-2">
              <Link href="/chat">
                <MessageCircle className="h-4 w-4" />
                Chat with your companion
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* ═══ SCREENING HISTORY ═══ */}
        {localUser && localUser.screenings.length > 0 && (
          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
            <Card className="border-0 shadow-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-secondary/50 rounded-t-xl transition-colors py-4">
                  <CardTitle className="font-serif text-sm flex items-center justify-between">
                    Your screening history
                    <ChevronDown className={`h-4 w-4 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  {localUser.screenings.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{s.type}</p>
                        <p className="text-xs text-muted-foreground">{s.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{s.score}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          s.severity === 'low' ? 'bg-green-500/10 text-green-600' :
                          s.severity === 'moderate' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>{s.severity}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}
      </main>

      {/* ═══ BOTTOM NAVIGATION ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2">
          {[
            { href: '/dashboard',  icon: Home,           label: 'Home',       active: true },
            { href: '/dashboard',  icon: ClipboardCheck, label: 'Check-in',   active: false, onClick: () => setShowCheckin(true) },
            { href: '/techniques', icon: Lightbulb,      label: 'Techniques', active: false },
            { href: '/counselors', icon: Stethoscope,    label: 'Counselors', active: false },
          ].map(item => (
            item.onClick ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ) : (
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
            )
          ))}
        </div>
      </nav>
    </>
  )
}
