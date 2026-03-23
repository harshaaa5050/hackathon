'use client'

import { CRISIS_RESOURCES } from '@/lib/matriai-data'
import { Phone, ShieldCheck } from 'lucide-react'

interface CrisisModalProps {
  onContinue: () => void
}

export function CrisisModal({ onContinue }: CrisisModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: '#1A1814' }}>
      <div className="w-full max-w-md mx-auto px-6 py-12 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl text-white mb-4">
          You&apos;re not alone
        </h1>

        {/* Body */}
        <p className="text-white/80 text-base leading-relaxed mb-8">
          It takes courage to acknowledge how you&apos;re feeling.
          Please reach out to someone who can help right now.
        </p>

        {/* Resource Cards */}
        <div className="space-y-3 mb-8">
          {CRISIS_RESOURCES.map((resource) => (
            <a
              key={resource.number}
              href={`tel:${resource.number.replace(/-/g, '')}`}
              className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
            >
              <div className="text-left">
                <p className="text-white font-medium text-sm">{resource.name}</p>
                <p className="text-white/70 text-lg font-mono">{resource.number}</p>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Tap to call
              </div>
            </a>
          ))}
        </div>

        {/* Safe acknowledgement */}
        <button
          onClick={onContinue}
          className="w-full py-3 px-6 rounded-xl border border-white/30 text-white/90 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          I&apos;m safe right now — continue
        </button>
      </div>
    </div>
  )
}
