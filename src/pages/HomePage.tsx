import { useState, useMemo, useId, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Scale,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'
import { companyImages } from '../data/images'
import { currency, schemes, type Scheme } from '../data/schemes'
import ChitEstimator from '../components/ChitEstimator'
import CardCarousel from '../components/CardCarousel'
import HeroSlider from '../components/HeroSlider'

type FormState = { name: string; mobile: string; duration: string; value: string; message: string }
const blankForm: FormState = { name: '', mobile: '', duration: '', value: '', message: '' }

function submitDemoEnquiry(_: FormState) {
  return new Promise<void>(resolve => window.setTimeout(resolve, 600))
}

export default function HomePage() {
  const { lang } = useLang()
  const t = copy[lang]
  const nameInputId = useId()
  const mobileInputId = useId()
  const durationSelectId = useId()
  const valueSelectId = useId()
  const messageTextareaId = useId()

  const [duration, setDuration] = useState<Scheme['duration'] | 'all'>('all')
  const [search, setSearch] = useState('')
  const [comparison, setComparison] = useState<Scheme[]>([])

  const [form, setForm] = useState<FormState>(blankForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs: [string, string][] = lang === 'en' ? [
    ['How are chit funds regulated in India and Tamil Nadu?', 'All chit schemes operated by Velu Senthilkumar Chit Funds Private Limited comply strictly with the central Chit Funds Act, 1982 and the Tamil Nadu Chit Funds Rules. Each scheme group is registered with the Chit Registrar before commencing subscriber enrolments.'],
    ['How is the monthly chit auction prize winner determined?', 'In every monthly auction, participating subscribers who require funds submit competitive discount bids up to the statutory ceiling. The subscriber offering the highest auction discount receives the prized sum. In months with multiple ceiling bids or standard draws, the statutory draw procedure is conducted openly.'],
    ['What happens to the auction discount (dividend)?', 'After deducting the statutory foreman commission (regulated under the Act), the entire remaining auction discount is distributed equally among all non-prized subscribers as dividend. This dividend directly reduces your next month’s instalment amount.'],
    ['What security or documentation is required to withdraw prized money?', 'Prized subscribers must furnish standard surety/security documentation as mandated by statutory guidelines and the approved chit agreement to ensure mutual protection for all group members throughout the remaining tenure.'],
    ['Can I enrol in multiple schemes simultaneously?', 'Yes. Subscribers frequently pair different scheme durations — for example, a 10-month quick liquidity scheme alongside a 25 or 40-month systematic milestone savings scheme.'],
    ['Where can I verify your corporate credentials?', 'You can verify our corporate credentials directly with the Ministry of Corporate Affairs using CIN: U64990TZ2024PTC033243, or visit our registered and administrative offices in Salem.'],
  ] : [
    ['சிட் ஃபண்ட்ஸ் எவ்வாறு முறைப்படுத்தப்படுகிறது?', 'வேலு செந்தில்குமார் சிட் ஃபண்ட்ஸ் பிரைவேட் லிமிடெட் நடத்தும் அனைத்து திட்டங்களும் மத்திய சிட் ஃபண்ட்ஸ் சட்டம் 1982 மற்றும் தமிழ்நாடு சிட் ஃபண்ட்ஸ் விதிகளுக்கு உட்பட்டு பதிவு செய்யப்படுகின்றன. ஒவ்வொரு குழுவும் அரசு பதிவாளரிடம் முன்-அனுமதி பெற்ற பின்னரே தொடங்கப்படுகிறது.'],
    ['மாதாந்திர ஏல பரிசுத்தொகை எவ்வாறு வழங்கப்படுகிறது?', 'ஒவ்வொரு மாதமும் நிதி தேவைப்படும் சந்தாதாரர்கள் ஏலத்தில் பங்கேற்று கழிவுத் தொகையைக் குறிப்பிடுகிறார்கள். சட்டப்பூர்வ வரம்பிற்குள் அதிகபட்ச தள்ளுபடி கோருபவருக்கு பரிசுத் தொகை விடுவிக்கப்படும்.'],
    ['ஏலத் தள்ளுபடி (டிவிடெண்ட்) யாருக்குச் செல்லும்?', 'நிறுவனக் கட்டணம் கழித்த பிறகு மீதமுள்ள முழு ஏலக் கழிவும் ஏலம் எடுக்காத அனைத்து சந்தாதாரர்களுக்கும் சமமாகப் பகிர்ந்து வழங்கப்பட்டு அவர்களின் அடுத்த மாதத் தவணையில் கழிக்கப்படும்.'],
    ['பரிசுத் தொகையைப் பெற என்ன ஆவணங்கள் தேவை?', 'குழுவின் அனைத்து சந்தாதாரர்களின் நிதிப் பாதுகாப்பை உறுதிசெய்ய, பரிசுத் தொகை பெறுபவர் சட்ட விதிகளின்படி தேவையான பிணை ஆவணங்களை வழங்க வேண்டும்.'],
  ]

  const available = useMemo(() =>
    schemes.filter(s =>
      (duration === 'all' || s.duration === duration) &&
      (!search || currency(s.value).includes(search.replace(/[^0-9]/g, '')) || String(s.value).includes(search.replace(/[^0-9]/g, '')))
    ), [duration, search])

  const choose = (scheme: Scheme) => {
    setForm({
      name: '',
      mobile: '',
      duration: String(scheme.duration),
      value: String(scheme.value),
      message: `${scheme.duration}-month scheme, ${currency(scheme.value)} chit value.`,
    })
    setErrors({})
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleCompare = (scheme: Scheme) =>
    setComparison(current =>
      current.some(s => s.id === scheme.id)
        ? current.filter(s => s.id !== scheme.id)
        : current.length < 3 ? [...current, scheme] : current
    )

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = t.errors.name
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) next.mobile = t.errors.mobile
    if (!form.duration) next.duration = t.errors.duration
    if (!form.value) next.value = t.errors.value
    setErrors(next)
    return !Object.keys(next).length
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setStatus('loading')
    await submitDemoEnquiry(form)
    setStatus('success')
  }

  return (
    <div>
      {/* ── 1. Hero Highlights Banner Slider ── */}
      <HeroSlider />

      {/* ── 2. Statutory Credentials & Transparency Strip ── */}
      <section className="mx-3 sm:mx-6 my-6 rounded-2xl glass-surface py-4 px-4 sm:px-6 shadow-sm border border-white/70">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-sm font-medium">
          <div className="flex items-center gap-3 font-bold text-deep">
            <img src={companyImages.icon} width="36" height="36" className="size-9 object-contain drop-shadow-sm" alt="Senthilkumar Chit Funds official insignia" />
            <span>{t.regAct}</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-charcoal/90 font-semibold">
            <span>{t.cin}</span>
            <span>{t.pan}</span>
            <span>{t.tan}</span>
            <span>{t.locationSalem}</span>
          </div>
        </div>
      </section>

      {/* ── 3. Company Introduction & Cultural Grounding ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-deep tracking-tight">
              {t.introTitle}
            </h2>
            <p className="text-base sm:text-lg text-charcoal leading-relaxed font-semibold">
              {t.introLead}
            </p>
            <p className="text-base text-charcoal leading-relaxed">
              {t.introBody}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-bold text-brand hover:underline text-base"
              >
                {t.aboutCta} <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl glass-surface p-6 sm:p-8 space-y-3 border border-brand/20 shadow-md">
              <div className="flex items-center gap-3 text-deep font-bold text-base">
                <Scale size={20} className="text-brand" />
                <span>{lang === 'en' ? 'Statutory Oversight' : 'சட்டரீதியான பாதுகாப்பு'}</span>
              </div>
              <p className="text-sm text-charcoal leading-relaxed">
                {t.notice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The Live Thing: Interactive Estimator ── */}
      <section id="estimator" className="py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <ChitEstimator />
        </div>
      </section>

      {/* ── 5. Flagship Scheme Card Carousel Slider ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <CardCarousel />
        </div>
      </section>

      {/* ── 5. Scheme Showcase ── */}
      <section id="schemes" className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-deep tracking-tight">
              {t.featured}
            </h2>
            <p className="mt-2 text-base text-charcoal max-w-3xl leading-relaxed">
              {t.featuredText}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold text-deep mb-2">
                {t.filter}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDuration('all')}
                  className={`min-h-11 rounded-xl px-4 text-sm font-bold transition-all active:scale-95 ${
                    duration === 'all'
                      ? 'bg-deep text-cream shadow-md'
                      : 'glass-pill text-charcoal hover:bg-white'
                  }`}
                >
                  {t.allDurations}
                </button>
                {([10, 20, 25, 40] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`min-h-11 rounded-xl px-4 text-sm font-bold transition-all active:scale-95 ${
                      duration === d
                        ? 'bg-deep text-cream shadow-md'
                        : 'glass-pill text-charcoal hover:bg-white'
                    }`}
                  >
                    {d} {t.months}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="scheme-search-input" className="block text-sm font-bold text-deep mb-2">
                {t.search}
              </label>
              <input
                id="scheme-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="field min-h-11 lg:w-64"
              />
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {available.map(s => (
              <article
                key={s.id}
                className="glass-card rounded-2xl p-6 sm:p-7 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-2xl sm:text-3xl font-black text-deep tabular-nums">
                      {currency(s.value)}
                    </div>
                    <span className="rounded-lg bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-bold text-deep">
                      {s.duration} {t.months}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-charcoal/80">
                    {currency(s.monthly)} per month (Gross)
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => choose(s)}
                    className="min-h-11 flex-1 rounded-xl bg-wine px-3 text-sm font-bold text-white transition-all hover:bg-wine/90 active:scale-95 shadow-md shadow-wine/20"
                  >
                    {t.enquire}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(s)}
                    aria-pressed={comparison.some(x => x.id === s.id)}
                    className="min-h-11 rounded-xl glass-pill px-3 text-sm font-bold text-deep hover:bg-white transition-all active:scale-95 shadow-sm"
                  >
                    {comparison.some(x => x.id === s.id) ? <Check size={16} /> : t.compare}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {!available.length && (
            <p className="p-8 text-center text-charcoal glass-surface rounded-2xl text-base">
              {lang === 'en' ? 'No scheme matches that value search.' : 'இந்தத் தேடலுக்கு திட்டம் இல்லை.'}
            </p>
          )}

          {/* Comparison Matrix */}
          {comparison.length > 0 && (
            <div data-ui="table" className="rounded-3xl glass-surface p-6 sm:p-8 space-y-4 border border-white/80 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-deep">
                  {t.compareTitle} ({comparison.length}/3 {t.selected})
                </h3>
                <button
                  type="button"
                  onClick={() => setComparison([])}
                  className="text-sm font-bold text-wine hover:underline"
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
                  <tbody>
                    <tr className="even:bg-brand/5">
                      <th className="p-3.5 text-charcoal font-semibold">{t.chitValue}</th>
                      {comparison.map(s => (
                        <td key={s.id} className="p-3.5 font-extrabold text-deep tabular-nums">
                          {currency(s.value)}
                        </td>
                      ))}
                    </tr>
                    <tr className="even:bg-brand/5">
                      <th className="p-3.5 text-charcoal font-semibold">{t.monthlyInstalment}</th>
                      {comparison.map(s => (
                        <td key={s.id} className="p-3.5 font-bold tabular-nums">
                          {currency(s.monthly)}
                        </td>
                      ))}
                    </tr>
                    <tr className="even:bg-brand/5">
                      <th className="p-3.5"></th>
                      {comparison.map(s => (
                        <td key={s.id} className="p-3.5">
                          <button
                            type="button"
                            onClick={() => toggleCompare(s)}
                            className="text-sm font-bold text-wine hover:underline"
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
      </section>

      {/* ── 6. How It Works ── */}
      <section className="mx-3 sm:mx-6 my-10 rounded-3xl glass-deep text-cream py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(20,83,45,0.35)]">
        {/* Internal Glow Orbs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-12">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-cream tracking-tight">
              {t.howTitle}
            </h2>
            <p className="text-base text-cream/90 leading-relaxed font-normal">
              {t.howLead}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((st, i) => (
              <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 space-y-4 hover:border-gold/50 transition-all hover:-translate-y-1 shadow-inner">
                <span className="inline-block text-xs font-bold text-gold uppercase tracking-wider">
                  {lang === 'en' ? `Stage ${i + 1}` : `நிலை ${i + 1}`}
                </span>
                <h3 className="text-lg font-bold text-cream">
                  {st.title}
                </h3>
                <p className="text-sm text-cream/80 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="https://www.indiacode.nic.in/indiacode/handle/123456789/1797?col=123456789%2F1362&view_type=search"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-base font-bold text-gold hover:underline"
            >
              {t.actReference} ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. Genuine Benefits ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-deep tracking-tight">
              {t.benefitTitle}
            </h2>
            <p className="text-base text-charcoal/80 leading-relaxed font-medium">
              {t.benefitLead}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {t.benefitsList.map((b, i) => (
              <div key={i} className="glass-card rounded-2xl p-7 sm:p-8 space-y-3">
                <h3 className="text-lg font-bold text-deep">
                  {b.title}
                </h3>
                <p className="text-base text-charcoal/80 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Leadership ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-deep tracking-tight">
              {t.leadershipTitle}
            </h2>
            <p className="text-base text-charcoal/80 leading-relaxed">
              {t.leadershipLead}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-7 sm:p-8 space-y-4">
              <span className="inline-block text-xs font-bold text-wine uppercase tracking-wider">
                {t.mdRole}
              </span>
              <h3 className="text-xl font-black text-deep">
                Rtn. Velu Senthilkumar
              </h3>
              <p className="text-base text-charcoal/80 leading-relaxed">
                {t.companyName}
              </p>
              <div className="pt-2">
                <a
                  href="tel:+919360066669"
                  className="inline-flex items-center gap-2 text-base font-bold text-brand hover:underline"
                >
                  <Phone size={16} /> +91 93600 66669
                </a>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-7 sm:p-8 space-y-4">
              <span className="inline-block text-xs font-bold text-wine uppercase tracking-wider">
                {t.directorRole}
              </span>
              <h3 className="text-xl font-black text-deep">
                Prabu
              </h3>
              <p className="text-base text-charcoal/80 leading-relaxed">
                {t.companyName}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="tel:+919842550345"
                  className="inline-flex items-center gap-2 text-base font-bold text-brand hover:underline"
                >
                  <Phone size={16} /> +91 98425 50345
                </a>
                <a
                  href="tel:+919750150150"
                  className="inline-flex items-center gap-2 text-base font-bold text-brand hover:underline"
                >
                  <Phone size={16} /> +91 97501 50150
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Frequently Answered Questions ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-deep tracking-tight">
              {t.faqTitle}
            </h2>
            <p className="text-base text-charcoal/80 leading-relaxed">
              {t.faqLead}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map(([q, a], i) => (
              <div key={q} className="glass-card rounded-2xl overflow-hidden">
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-6 text-left font-bold text-deep text-base transition-colors hover:text-brand"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="shrink-0 text-brand" size={19} />
                  ) : (
                    <ChevronDown className="shrink-0 text-charcoal/40" size={19} />
                  )}
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-5 text-base text-charcoal/80 leading-relaxed">
                    {a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Contact & Direct Enquiry Form ── */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-deep tracking-tight">
              {t.contactTitle}
            </h2>
            <p className="text-base text-charcoal/80 leading-relaxed">
              {t.contactLead}
            </p>

            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-charcoal/85">
              <div>
                <b className="text-deep font-bold block">{t.addressTitle}</b>
                <p className="mt-1">{t.regAddress}</p>
              </div>
              <div>
                <b className="text-deep font-bold block">{t.adminTitle}</b>
                <p className="mt-1">{t.adminAddress}</p>
              </div>
              <div className="pt-2">
                <a
                  href="mailto:skchitfundspvtltd@yahoo.com"
                  className="inline-flex items-center gap-2 font-bold text-brand hover:underline"
                >
                  <Mail size={16} /> {t.emailAddress}
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={submit}
            noValidate
            className="rounded-3xl glass-surface p-6 sm:p-10 space-y-5 border border-white/80 shadow-xl"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={nameInputId} className="block text-sm font-bold text-deep mb-2">
                  {t.name}
                </label>
                <input
                  id={nameInputId}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="field"
                  autoComplete="name"
                />
                {errors.name && (
                  <span role="alert" className="mt-1 block text-sm text-wine font-semibold">
                    {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor={mobileInputId} className="block text-sm font-bold text-deep mb-2">
                  {t.mobile}
                </label>
                <input
                  id={mobileInputId}
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  className="field"
                  inputMode="numeric"
                  autoComplete="tel"
                />
                {errors.mobile && (
                  <span role="alert" className="mt-1 block text-sm text-wine font-semibold">
                    {errors.mobile}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor={durationSelectId} className="block text-sm font-bold text-deep mb-2">
                  {t.duration}
                </label>
                <select
                  id={durationSelectId}
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  className="field"
                >
                  <option value="">— Select —</option>
                  {[10, 20, 25, 40].map(d => (
                    <option key={d} value={d}>
                      {d} {t.months}
                    </option>
                  ))}
                </select>
                {errors.duration && (
                  <span role="alert" className="mt-1 block text-sm text-wine font-semibold">
                    {errors.duration}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor={valueSelectId} className="block text-sm font-bold text-deep mb-2">
                  {t.chit}
                </label>
                <select
                  id={valueSelectId}
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                  className="field"
                >
                  <option value="">— Select —</option>
                  {schemes
                    .filter(s => !form.duration || s.duration === Number(form.duration))
                    .map(s => (
                      <option key={s.id} value={s.value}>
                        {currency(s.value)} ({s.duration}m)
                      </option>
                    ))}
                </select>
                {errors.value && (
                  <span role="alert" className="mt-1 block text-sm text-wine font-semibold">
                    {errors.value}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={messageTextareaId} className="block text-sm font-bold text-deep mb-2">
                {t.message}
              </label>
              <textarea
                id={messageTextareaId}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="field min-h-24 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-wine px-6 text-sm font-bold text-white transition-all hover:bg-wine/90 active:scale-95 disabled:opacity-50 shadow-md shadow-wine/25"
            >
              {status === 'loading' ? t.submitting : t.submit}
            </button>

            {status === 'success' && (
              <p className="rounded-xl bg-brand/10 border border-brand/20 p-4 text-sm font-bold text-deep" role="status">
                {t.demoSuccess}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}



