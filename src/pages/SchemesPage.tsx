import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'
import { currency, schemes, type Scheme } from '../data/schemes'
import ChitEstimator from '../components/ChitEstimator'

export default function SchemesPage() {
  const { lang } = useLang()
  const t = copy[lang]
  const [duration, setDuration] = useState<Scheme['duration'] | 'all'>('all')
  const [search, setSearch] = useState('')
  const [comparison, setComparison] = useState<Scheme[]>([])

  const available = useMemo(() =>
    schemes.filter(s =>
      (duration === 'all' || s.duration === duration) &&
      (!search || currency(s.value).includes(search.replace(/[^0-9]/g, '')) || String(s.value).includes(search.replace(/[^0-9]/g, '')))
    ), [duration, search])

  const toggleCompare = (scheme: Scheme) =>
    setComparison(current =>
      current.some(s => s.id === scheme.id)
        ? current.filter(s => s.id !== scheme.id)
        : current.length < 3 ? [...current, scheme] : current
    )

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-deep tracking-tight">
            {t.featured}
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-medium">
            {t.featuredText}
          </p>
        </div>

        {/* Live Estimator Component */}
        <ChitEstimator />

        {/* Filters and Scheme Grid */}
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold text-deep  mb-2">
                {t.filter}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDuration('all')}
                  className={`min-h-11 rounded-lg px-4 text-xs font-bold transition-colors ${
                    duration === 'all'
                      ? 'bg-deep text-cream'
                      : 'bg-white text-charcoal hover:bg-black/5'
                  }`}
                >
                  {t.allDurations}
                </button>
                {([10, 20, 25, 40] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`min-h-11 rounded-lg px-4 text-xs font-bold transition-colors ${
                      duration === d
                        ? 'bg-deep text-cream'
                        : 'bg-white text-charcoal hover:bg-black/5'
                    }`}
                  >
                    {d} {t.months}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="schemes-search-field" className="block text-xs font-bold text-deep  mb-2">
                {t.search}
              </label>
              <input
                id="schemes-search-field"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="min-h-11 w-full rounded-lg bg-white px-3.5 text-sm text-charcoal border border-brand/20 focus:outline-none focus:border-brand lg:w-64"
              />
            </div>
          </div>

          {/* Scheme Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {available.map(s => (
              <article
                key={s.id}
                className="rounded-2xl bg-white p-6 transition-transform hover:-translate-y-0.5 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-brand/10 px-3 py-1 text-xs font-bold text-deep">
                    {s.duration} {t.months}
                  </span>
                  <span className="text-xs text-charcoal/50 font-medium">
                    {lang === 'en' ? 'Brochure Plan' : 'சிற்றேட்டுத் திட்டம்'}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-charcoal/60 font-medium">
                    {t.chitValue}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-deep tabular-nums mt-0.5">
                    {currency(s.value)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-charcoal/60 font-medium">
                    {t.monthlyInstalment} (Gross)
                  </p>
                  <p className="text-lg font-bold text-charcoal tabular-nums">
                    {currency(s.monthly)}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <Link
                    to={`/contact?duration=${s.duration}&value=${s.value}`}
                    className="min-h-11 flex-1 rounded-lg bg-wine px-3 text-xs font-bold text-white transition-opacity hover:opacity-90 flex items-center justify-center"
                  >
                    {t.enquire}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleCompare(s)}
                    aria-pressed={comparison.some(x => x.id === s.id)}
                    className="min-h-11 rounded-lg bg-brand/10 hover:bg-brand/15 px-3 text-xs font-bold text-deep transition-colors"
                  >
                    {comparison.some(x => x.id === s.id) ? <Check size={16} /> : t.compare}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {!available.length && (
            <p className="p-8 text-center text-charcoal/70 bg-white rounded-xl">
              {lang === 'en' ? 'No scheme matches that search.' : 'இந்தத் தேடலுக்கு திட்டம் இல்லை.'}
            </p>
          )}

          {/* Comparison Matrix */}
          {comparison.length > 0 && (
            <div className="rounded-2xl bg-white p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-deep">
                  {t.compareTitle} ({comparison.length}/3 {t.selected})
                </h2>
                <button
                  type="button"
                  onClick={() => setComparison([])}
                  className="text-xs font-bold text-wine hover:underline"
                >
                  {t.close}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left text-sm">
                  <thead className="bg-brand/5">
                    <tr>
                      <th className="p-3.5 font-bold text-deep">{lang === 'en' ? 'Attribute' : 'விவரம்'}</th>
                      {comparison.map(s => (
                        <th key={s.id} className="p-3.5 font-bold text-deep">
                          {s.duration} {t.months}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="">
                    <tr>
                      <th className="p-3.5 text-charcoal/70 font-semibold">{t.chitValue}</th>
                      {comparison.map(s => (
                        <td key={s.id} className="p-3.5 font-extrabold text-deep tabular-nums">
                          {currency(s.value)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="p-3.5 text-charcoal/70 font-semibold">{t.monthlyInstalment}</th>
                      {comparison.map(s => (
                        <td key={s.id} className="p-3.5 font-bold tabular-nums">
                          {currency(s.monthly)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="p-3.5"></th>
                      {comparison.map(s => (
                        <td key={s.id} className="p-3.5">
                          <button
                            type="button"
                            onClick={() => toggleCompare(s)}
                            className="text-xs font-bold text-wine hover:underline"
                          >
                            {t.remove}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

