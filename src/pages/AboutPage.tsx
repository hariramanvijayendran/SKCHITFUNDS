import { Mail, ShieldCheck } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'

export default function AboutPage() {
  const { lang } = useLang()
  const t = copy[lang]

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-deep tracking-tight">
            {t.introTitle}
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-medium">
            {t.introLead}
          </p>
        </div>

        {/* Heritage Visual & Story Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-6 text-charcoal/80 leading-relaxed text-sm sm:text-base">
            <p>{t.introBody}</p>

            <div className="rounded-3xl glass-surface p-6 sm:p-8 space-y-4 border border-brand/20 shadow-md">
              <h2 className="text-xl font-bold text-deep">
                {lang === 'en' ? 'Statutory Mandate & Safeguards' : 'சட்டரீதியான பாதுகாப்பு'}
              </h2>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                {t.notice}
              </p>
              <div className="pt-2">
                <a
                  href="https://www.indiacode.nic.in/indiacode/handle/123456789/1797?col=123456789%2F1362&view_type=search"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                >
                  {t.actReference} ↗
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl glass-card p-5 space-y-1">
                <p className="font-bold text-deep text-sm">{t.addressTitle}</p>
                <p className="text-xs text-charcoal/70">{t.regAddress}</p>
              </div>
              <div className="rounded-2xl glass-card p-5 space-y-1">
                <p className="font-bold text-deep text-sm">{t.adminTitle}</p>
                <p className="text-xs text-charcoal/70">{t.adminAddress}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Identity Card & Cultural Monument */}
          <div className="space-y-6">
            <div className="rounded-3xl glass-deep text-cream p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gold/15 blur-2xl" aria-hidden="true" />
              <div className="flex items-center gap-3 text-gold">
                <ShieldCheck size={28} />
                <span className="font-bold text-sm tracking-wide">{t.tagline}</span>
              </div>
              <h3 className="text-xl font-black text-cream">
                {t.companyName}
              </h3>
              <div className="space-y-2 text-xs text-cream/80 leading-relaxed pt-2">
                <p><b className="text-cream">Registration:</b> {t.regAct}</p>
                <p><b className="text-cream">Corporate ID:</b> {t.cin}</p>
                <p><b className="text-cream">Tax Accounts:</b> {t.pan} · {t.tan}</p>
                <p><b className="text-cream">Jurisdiction:</b> {t.locationSalem}</p>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:${t.emailAddress}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline"
                >
                  <Mail size={14} /> {t.emailAddress}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

