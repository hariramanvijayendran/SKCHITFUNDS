import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'
import { currency, schemes, type Scheme } from '../data/schemes'

// Handpicked flagship schemes across all 4 statutory durations
const featuredSchemeIds = [
  '20-1000000',  // 20 mo, 10 Lakh (Most popular systematic saver)
  '25-5000000',  // 25 mo, 50 Lakh (Business milestone)
  '10-2500000',  // 10 mo, 25 Lakh (Quick liquidity capital)
  '40-10000000', // 40 mo, 1 Crore (High net worth long-term fund)
  '20-500000',   // 20 mo, 5 Lakh (Family essential reserve)
  '25-2000000',  // 25 mo, 20 Lakh (Commercial working capital)
]

export default function CardCarousel() {
  const { lang } = useLang()
  const t = copy[lang]

  const featuredSchemes: Scheme[] = featuredSchemeIds
    .map(id => schemes.find(s => s.id === id))
    .filter((s): s is Scheme => Boolean(s))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const [visibleCards, setVisibleCards] = useState(1)

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3)
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2)
      } else {
        setVisibleCards(1)
      }
    }
    updateVisible()
    window.addEventListener('resize', updateVisible)
    return () => window.removeEventListener('resize', updateVisible)
  }, [])

  const total = featuredSchemes.length
  const maxIndex = Math.max(0, total - visibleCards)

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-play timer (4.5s)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50
    if (diff > minSwipeDistance) {
      nextSlide()
    } else if (diff < -minSwipeDistance) {
      prevSlide()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const headings = {
    badge: lang === 'en' ? 'Flagship Opportunities' : 'சிறப்பு சிட் வாய்ப்புகள்',
    title: lang === 'en' ? 'Curated Chit Schemes' : 'பிரபலமான சிட் திட்டங்கள்',
    subtitle: lang === 'en'
      ? 'Explore our most requested systematic savings & liquidity plans. Swipe or browse through curated tenures.'
      : 'அதிகம் விரும்பப்படும் சேமிப்பு மற்றும் உடனடி நிதித் திட்டங்களை ஆராயுங்கள்.',
    dividendLabel: lang === 'en' ? 'Est. Monthly Dividend' : 'மதிப்பிடப்பட்ட மாத டிவிடெண்ட்',
    tenure: lang === 'en' ? 'Tenure' : 'கால அளவு',
    monthlyGross: lang === 'en' ? 'Monthly Gross' : 'மாதத் தவணை (மொத்தம்)',
    viewDetails: lang === 'en' ? 'Enquire Plan' : 'விவரம் பெற',
    step: lang === 'en' ? 'Scheme' : 'திட்டம்',
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured Chit Schemes Carousel"
    >
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-deep bg-brand/10 border border-brand/20 mb-2">
            <Sparkles size={13} className="text-brand" /> {headings.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-deep tracking-tight">
            {headings.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal/80 max-w-xl leading-relaxed">
            {headings.subtitle}
          </p>
        </div>

        {/* Navigation Buttons (Desktop + Tablet) */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous scheme"
            className="grid size-11 place-items-center rounded-xl glass-pill text-deep hover:bg-white hover:text-brand transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next scheme"
            className="grid size-11 place-items-center rounded-xl glass-pill text-deep hover:bg-white hover:text-brand transition-all active:scale-95 shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel Viewport */}
      <div className="overflow-hidden py-4 -mx-2 px-2">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          }}
        >
          {featuredSchemes.map((s, idx) => {
            const isCurrent = idx >= currentIndex && idx < currentIndex + visibleCards
            const estMinDiv = Math.round(s.monthly * 0.10)
            const estMaxDiv = Math.round(s.monthly * 0.22)

            return (
              <div
                key={s.id}
                className="shrink-0 px-2 sm:px-3"
                style={{
                  width: `${100 / visibleCards}%`,
                }}
              >
                <div
                  className={`h-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    isCurrent
                      ? 'glass-card ring-1 ring-gold/60 shadow-[0_16px_36px_-8px_rgba(20,107,56,0.12)]'
                      : 'glass-card opacity-90'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Tenure Badge & Safety Insignia */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-deep bg-brand/10 border border-brand/20">
                        <TrendingUp size={13} className="text-brand" />
                        {s.duration} {t.months} {headings.tenure}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-deep/70">
                        <ShieldCheck size={14} className="text-brand" /> {t.regAct}
                      </span>
                    </div>

                    {/* Chit Value Highlight */}
                    <div>
                      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
                        {t.chitValue}
                      </p>
                      <p className="text-3xl sm:text-4xl font-black text-deep tabular-nums tracking-tight mt-0.5">
                        {currency(s.value)}
                      </p>
                    </div>

                    {/* Financial Metrics Split */}
                    <div className="grid grid-cols-2 gap-3 pt-2 pb-1 border-y border-brand/10">
                      <div>
                        <p className="text-xs text-charcoal/60 font-medium">{headings.monthlyGross}</p>
                        <p className="text-base sm:text-lg font-bold text-deep tabular-nums mt-0.5">
                          {currency(s.monthly)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/60 font-medium">{headings.dividendLabel}</p>
                        <p className="text-sm sm:text-base font-bold text-gold-deep tabular-nums mt-0.5">
                          ~ {currency(estMinDiv)} - {currency(estMaxDiv)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6">
                    <Link
                      to={`/contact?duration=${s.duration}&value=${s.value}`}
                      className="group flex min-h-12 w-full items-center justify-between rounded-xl bg-wine px-5 text-sm font-bold text-white transition-all hover:bg-wine/90 active:scale-[0.98] shadow-md shadow-wine/20"
                    >
                      <span>{headings.viewDetails}</span>
                      <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === i
                ? 'w-8 h-2.5 bg-brand shadow-sm'
                : 'w-2.5 h-2.5 bg-brand/20 hover:bg-brand/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
