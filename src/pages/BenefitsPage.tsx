import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'

export default function BenefitsPage() {
  const { lang } = useLang()
  const t = copy[lang]

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-deep tracking-tight">
            {t.benefitTitle}
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-medium">
            {t.benefitLead}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {t.benefitsList.map((b, i) => (
            <div key={i} className="rounded-2xl bg-white p-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-brand shrink-0" size={22} />
                <h2 className="text-xl font-bold text-deep">
                  {b.title}
                </h2>
              </div>
              <p className="text-sm text-charcoal/80 leading-relaxed pl-8">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* How Chit Works Section */}
        <div className="rounded-3xl bg-deep text-cream p-8 sm:p-12 space-y-10">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-cream tracking-tight">
              {t.howTitle}
            </h2>
            <p className="text-base text-cream/80 leading-relaxed">
              {t.howLead}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((st, i) => (
              <div key={i} className="rounded-2xl bg-white/5 p-6 space-y-3">
                <p className="text-xs font-bold text-gold ">
                  {lang === 'en' ? `Step ${i + 1}` : `படி ${i + 1}`}
                </p>
                <h3 className="text-lg font-bold text-cream">
                  {st.title}
                </h3>
                <p className="text-xs text-cream/75 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-cream/70">
            <p>{t.notice}</p>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 text-xs font-bold text-deep transition-opacity hover:opacity-90"
            >
              {t.enquire} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

