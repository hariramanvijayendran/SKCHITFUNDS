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
    <div className="rounded-2xl bg-deep text-cream p-6 sm:p-10 lg:p-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">
          {t.estimatorTitle}
        </h2>
        <p className="mt-3 text-base text-cream/90 max-w-2xl leading-relaxed">
          {t.estimatorSubtitle}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
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
                  className={`min-h-12 rounded-lg font-bold text-sm transition-colors text-center px-3 py-2 ${
                    selectedDuration === d
                      ? 'bg-gold text-deep font-extrabold'
                      : 'bg-white/10 text-cream hover:bg-white/15'
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
              className="w-full min-h-12 rounded-lg bg-white/15 border border-white/20 text-cream px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
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
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    selectedValue === s.value
                      ? 'bg-cream text-deep font-bold'
                      : 'bg-white/10 text-cream/90 hover:bg-white/20'
                  }`}
                >
                  {currency(s.value)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-baseline justify-between gap-2"><span className="text-3xl sm:text-4xl font-extrabold text-cream tabular-nums">{currency(selectedValue)}</span><span className="text-sm font-bold text-gold">{t.chitValue}</span></div>

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

          <div className="rounded-lg bg-white/5 p-4 text-sm sm:text-sm text-cream/80 leading-relaxed">
            <b className="text-gold font-bold">Estimated Net Payable:</b> Typically reduced to{' '}
            <span className="font-bold text-cream tabular-nums">
              {currency(estEffectiveMinMonthly)} – {currency(estEffectiveMaxMonthly)}
            </span>{' '}
            per month after applying subscriber auction dividend shares.
          </div>

          <Link
            to={`/contact?duration=${selectedDuration}&value=${selectedValue}`}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-wine px-6 font-bold text-white transition-opacity hover:opacity-90 text-sm tracking-wide"
          >
            {t.estimatorAction} ({currency(selectedValue)})
          </Link>
        </div>
      </div>
    </div>
  )
}

