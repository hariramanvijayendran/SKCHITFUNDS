import { FormEvent, useEffect, useState, useId, type ReactNode } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'
import { currency, schemes } from '../data/schemes'

type FormState = { name: string; mobile: string; duration: string; value: string; message: string }
const blankForm: FormState = { name: '', mobile: '', duration: '', value: '', message: '' }

function submitDemoEnquiry(_: FormState) {
  return new Promise<void>(resolve => window.setTimeout(resolve, 600))
}

export default function ContactPage() {
  const { lang } = useLang()
  const t = copy[lang]
  const [searchParams] = useSearchParams()

  const nameInputId = useId()
  const mobileInputId = useId()
  const durationSelectId = useId()
  const valueSelectId = useId()
  const messageTextareaId = useId()

  const [form, setForm] = useState<FormState>(blankForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  useEffect(() => {
    const dur = searchParams.get('duration')
    const val = searchParams.get('value')
    if (dur || val) {
      setForm(f => ({
        ...f,
        duration: dur ?? f.duration,
        value: val ?? f.value,
        message: dur && val ? `${dur}-month scheme, ${currency(Number(val))} chit value.` : f.message,
      }))
    }
  }, [searchParams])

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
    <div className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-deep tracking-tight">
            {t.contactTitle}
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-medium">
            {t.contactLead}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
          {/* Contact Details & Leadership */}
          <div className="space-y-6">
            {/* Leadership Cards */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 space-y-5">
              <span className="inline-block text-xs font-bold text-wine ">
                {t.leadershipTitle}
              </span>

              <div className="space-y-4">
                <div>
                  <p className="text-base font-extrabold text-deep">Rtn. Velu Senthilkumar</p>
                  <p className="text-xs text-charcoal/60">{t.mdRole}</p>
                  <a href="tel:+919360066669" className="text-sm font-bold text-brand hover:underline inline-flex items-center gap-1.5 mt-1">
                    <Phone size={14} /> +91 93600 66669
                  </a>
                </div>

                <div className="pt-2">
                  <p className="text-base font-extrabold text-deep">Prabu</p>
                  <p className="text-xs text-charcoal/60">{t.directorRole}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <a href="tel:+919842550345" className="text-sm font-bold text-brand hover:underline inline-flex items-center gap-1.5">
                      <Phone size={14} /> +91 98425 50345
                    </a>
                    <a href="tel:+919750150150" className="text-sm font-bold text-brand hover:underline inline-flex items-center gap-1.5">
                      <Phone size={14} /> +91 97501 50150
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Cards */}
            <div className="rounded-2xl bg-brand/5 p-6 sm:p-8 space-y-4 text-xs sm:text-sm leading-relaxed text-charcoal/80">
              <div>
                <b className="text-deep font-bold block">{t.addressTitle}</b>
                <p className="mt-1">{t.regAddress}</p>
              </div>
              <div className="pt-2">
                <b className="text-deep font-bold block">{t.adminTitle}</b>
                <p className="mt-1">{t.adminAddress}</p>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:${t.emailAddress}`}
                  className="inline-flex items-center gap-2 font-bold text-brand hover:underline"
                >
                  <Mail size={16} /> {t.emailAddress}
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            noValidate
            className="rounded-2xl bg-white p-6 sm:p-10 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={nameInputId} className="block text-xs font-bold text-deep  mb-2">
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
                  <span role="alert" className="mt-1 block text-xs text-wine font-semibold">
                    {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor={mobileInputId} className="block text-xs font-bold text-deep  mb-2">
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
                  <span role="alert" className="mt-1 block text-xs text-wine font-semibold">
                    {errors.mobile}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor={durationSelectId} className="block text-xs font-bold text-deep  mb-2">
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
                  <span role="alert" className="mt-1 block text-xs text-wine font-semibold">
                    {errors.duration}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor={valueSelectId} className="block text-xs font-bold text-deep  mb-2">
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
                  <span role="alert" className="mt-1 block text-xs text-wine font-semibold">
                    {errors.value}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={messageTextareaId} className="block text-xs font-bold text-deep  mb-2">
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
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-wine px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === 'loading' ? t.submitting : t.submit}
            </button>

            {status === 'success' && (
              <p className="rounded-lg bg-brand/10 p-4 text-xs font-bold text-deep" role="status">
                {t.demoSuccess}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

