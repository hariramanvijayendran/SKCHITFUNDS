import { useState, useId } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'
import { currency, schemes, type Scheme } from '../data/schemes'

export default function ChitEstimator() {
  const { lang } = useLang()
  const t = copy[lang]
  const durationSelectId = useId()
  const valueSelectId = useId()

  const [selectedDuration, setSelectedDuration] = useState<Scheme['duration']>(20)
  const availableSchemesForDuration = schemes.filter(s => s.duration === selectedDuration)
  const [selectedValue, setSelectedValue] = useState<number>(availableSchemesForDuration[2]?.value || 1000000)

  const currentScheme = schemes.find(s => s.duration === selectedDuration && s.value === selectedValue) || availableSchemesForDuration[0]
  const baseMonthly = currentScheme ? currentScheme.monthly : Math.round(selectedValue / selectedDuration)
  const estMinDividend = Math.round(baseMonthly * 0.10)
  const estMaxDividend = Math.round(baseMonthly * 0.22)
  const estEffectiveMinMonthly = baseMonthly - estMaxDividend
  const estEffectiveMaxMonthly = baseMonthly - estMinDividend

  const handleDurationChange = (d: Scheme['duration']) => {
    setSelectedDuration(d)
    const validInNewDuration = schemes.find(s => s.duration === d && s.value === selectedValue)
    if (!validInNewDuration) {
      const fallback = schemes.filter(s => s.duration === d)[0]
      if (fallback) setSelectedValue(fallback.value)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl glass-deep text-cream p-6 sm:p-10 lg:p-12 shadow-[0_25px_60px_-15px_rgba(20,83,45,0.4)]">
      {/* Ambient Internal Glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">
          {t.estimatorTitle}
        </h2>
        <p className="mt-3 text-base text-cream/90 max-w-2xl leading-relaxed">
          {t.estimatorSubtitle}
        </p>
      </div>

      <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-6">
          <div>
            <label htmlFor={durationSelectId} className="block text-sm font-bold text-gold mb-3">
              {t.selectDuration}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {([10, 20, 25, 40] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDurationChange(d)}
                  className={`min-h-12 rounded-xl font-bold text-sm transition-all text-center px-3 py-2 active:scale-95 ${
                    selectedDuration === d
                      ? 'bg-gold text-deep font-extrabold shadow-lg shadow-gold/25 ring-2 ring-white/40'
                      : 'bg-white/10 hover:bg-white/18 text-cream backdrop-blur-sm border border-white/15'
                  }`}
                >
                  {d} {t.months}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={valueSelectId} className="block text-sm font-bold text-gold mb-3">
              {t.selectValue}
            </label>
            <select
              id={valueSelectId}
              value={selectedValue}
              onChange={e => setSelectedValue(Number(e.target.value))}
              className="w-full min-h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-cream px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gold/80"
            >
              {availableSchemesForDuration.map(s => (
                <option key={s.id} value={s.value} className="bg-deep text-cream">
                  {currency(s.value)} ({s.duration} {t.months} · {currency(s.monthly)}/mo)
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap gap-2">
              {availableSchemesForDuration.slice(0, 5).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedValue(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                    selectedValue === s.value
                      ? 'bg-cream text-deep font-bold shadow-md shadow-white/20'
                      : 'bg-white/10 hover:bg-white/20 text-cream/90 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  {currency(s.value)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 p-6 sm:p-8 space-y-6 shadow-inner">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-cream tabular-nums">{currency(selectedValue)}</span>
            <span className="text-sm font-bold text-gold">{t.chitValue}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-cream/80 font-medium">
                {t.monthlyInstalment} (Gross)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-cream tabular-nums mt-1">
                {currency(baseMonthly)}
              </p>
            </div>
            <div>
              <p className="text-sm text-cream/80 font-medium">
                {t.totalDividendPool}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gold tabular-nums mt-1">
                ~ {currency(estMinDividend)} – {currency(estMaxDividend)}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 p-4 text-sm text-cream/90 leading-relaxed">
            <b className="text-gold font-bold">Estimated Net Payable:</b> Typically reduced to{' '}
            <span className="font-bold text-cream tabular-nums">
              {currency(estEffectiveMinMonthly)} – {currency(estEffectiveMaxMonthly)}
            </span>{' '}
            per month after applying subscriber auction dividend shares.
          </div>

          <Link
            to={`/contact?duration=${selectedDuration}&value=${selectedValue}`}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-wine px-6 font-bold text-white transition-all hover:bg-wine/90 active:scale-[0.98] text-sm tracking-wide shadow-lg shadow-wine/30"
          >
            {t.estimatorAction} ({currency(selectedValue)})
          </Link>
        </div>
      </div>
    </div>
  )
}

