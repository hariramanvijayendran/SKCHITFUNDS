import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Phone, ShieldCheck, Sparkles, Home, Scale, TrendingUp } from 'lucide-react'
import { useLang } from '../context/LangContext'

export type HeroSlideItem = {
  id: string
  image: string
  badge: { en: string; ta: string }
  badgeIcon: typeof ShieldCheck
  title: { en: string; ta: string }
  subtitle: { en: string; ta: string }
  primaryCta: { en: string; ta: string; href: string }
  secondaryCta: { en: string; ta: string; href: string; isPhone?: boolean }
}

const slides: HeroSlideItem[] = [
  {
    id: 'daddys-trust',
    image: '/assets/banners/hero-slide-1.jpg',
    badge: {
      en: "This is Daddy's Trust · Regulated under Act 1982",
      ta: '“இது டாடிஸ் டிரஸ்ட்” · மத்திய சிட் ஃபண்ட் சட்டம் 1982',
    },
    badgeIcon: ShieldCheck,
    title: {
      en: 'Government-Registered Financial Security',
      ta: 'அரசால் முறைப்படுத்தப்பட்ட நிதிப் பாதுகாப்பு',
    },
    subtitle: {
      en: 'Built on unwavering personal integrity, statutory transparency, and lifelong subscriber protection in Salem and across Tamil Nadu.',
      ta: 'சட்டப்பூர்வ பாதுகாப்பு, வெளிப்படையான நிர்வாகம் மற்றும் தலைமுறை தலைமுறையாய் குடும்பங்களின் அசைக்க முடியாத நம்பிக்கை.',
    },
    primaryCta: {
      en: 'Explore Schemes',
      ta: 'திட்டங்களை காண்க',
      href: '#schemes',
    },
    secondaryCta: {
      en: 'Call Leadership',
      ta: 'நேரடியாக அழைக்க',
      href: 'tel:+919360066669',
      isPhone: true,
    },
  },
  {
    id: 'family-milestones',
    image: '/assets/banners/hero-slide-2.jpg',
    badge: {
      en: 'Family Milestones · Homes & Education',
      ta: 'குடும்ப சேமிப்பு · கனவு இல்லம் & உயர்கல்வி',
    },
    badgeIcon: Home,
    title: {
      en: "Build Your Family's Dream Future",
      ta: 'உங்கள் குடும்பத்தின் கனவுகளை நனவாக்குங்கள்',
    },
    subtitle: {
      en: "Disciplined monthly savings to fund children's higher education, marriage, and dream home purchases without bank loan stress.",
      ta: 'வங்கி கடன் வட்டி சுமையின்றி பிள்ளைகளின் உயர்கல்வி, திருமணம் மற்றும் சொந்த இல்லத்திற்கான திட்டமிட்ட மாதாந்திர சேமிப்பு.',
    },
    primaryCta: {
      en: 'Calculate Plan',
      ta: 'கணக்கீடு செய்ய',
      href: '#estimator',
    },
    secondaryCta: {
      en: 'Enquire Today',
      ta: 'இப்போதே இணைவீர்',
      href: '/contact',
    },
  },
  {
    id: 'transparent-advisory',
    image: '/assets/banners/hero-slide-3.jpg',
    badge: {
      en: 'Personalized Advisory · Fair Monthly Auctions',
      ta: 'நேரடி வழிகாட்டுதல் · நியாயமான மாதாந்திர ஏலம்',
    },
    badgeIcon: Scale,
    title: {
      en: 'Transparent & Ethical Chit Guidance',
      ta: 'நேர்மையான நிர்வாகம் & முழுமையான டிவிடெண்ட்',
    },
    subtitle: {
      en: 'Competitive auction bidding with full dividend surplus shared equally among non-prized subscribers to reduce monthly instalments.',
      ta: 'சட்டரீதியான ஏல முறை மற்றும் ஏலம் எடுக்காத அனைத்து சந்தாதாரர்களுக்கும் சமமாகப் பகிர்ந்தளிக்கப்படும் மாதாந்திர டிவிடெண்ட் கழிவு.',
    },
    primaryCta: {
      en: 'Why Chit Funds?',
      ta: 'நன்மைகளை அறிய',
      href: '/benefits',
    },
    secondaryCta: {
      en: 'Direct Leadership',
      ta: 'தொடர்பு கொள்ள',
      href: '/contact',
    },
  },
  {
    id: 'wealth-growth',
    image: '/assets/banners/hero-slide-4.jpg',
    badge: {
      en: 'Business Liquidity · ₹50,000 to ₹1 Crore',
      ta: 'வணிக மூலதனம் · ரூ. 50,000 முதல் ரூ. 1 கோடி வரை',
    },
    badgeIcon: TrendingUp,
    title: {
      en: 'Empower Your Business & Wealth Goals',
      ta: 'வணிக வளர்ச்சிக்கான உடனடி மூலதனம்',
    },
    subtitle: {
      en: 'Rapid capital disbursement for working capital, equipment, and commercial growth backed by approved statutory sureties.',
      ta: 'வணிக விரிவாக்கம் மற்றும் அவசர பணத்தேவைகளுக்கான உடனடி நிதி விடுவிப்பு, எளிய நடைமுறைகள் மற்றும் நம்பகமான சேவை.',
    },
    primaryCta: {
      en: 'Browse 40 Schemes',
      ta: 'அனைத்து திட்டங்கள்',
      href: '/schemes',
    },
    secondaryCta: {
      en: 'Enquire Now',
      ta: 'விவரம் பெற',
      href: '/contact',
    },
  },
]

export default function HeroSlider() {
  const { lang } = useLang()
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const total = slides.length

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev - 1 + total) % total)
  }, [total])

  // Auto-play (5.5s)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) nextSlide()
    else if (diff < -50) prevSlide()
    touchStartX.current = null
    touchEndX.current = null
  }

  const slide = slides[current]
  const BadgeIcon = slide.badgeIcon

  return (
    <div
      className="relative overflow-hidden rounded-3xl mx-3 sm:mx-6 mt-2 shadow-[0_20px_50px_-15px_rgba(20,83,45,0.22)] border border-white/70 bg-cream min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero Highlights Banner Slider"
    >
      {/* ── Slide Background Images (Cross-Fade Layer) ── */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
          }`}
          aria-hidden={index !== current}
        >
          <img
            src={s.image}
            alt={s.title[lang]}
            className="w-full h-full object-cover object-right sm:object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* ── Soft Gradient Readability Mask on Left ── */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/85 to-transparent sm:via-cream/65 md:w-3/5 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* ── Ambient Background Lighting ── */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gold/20 blur-3xl z-[2]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 left-1/4 w-80 h-80 rounded-full bg-brand/15 blur-3xl z-[2]" aria-hidden="true" />

      {/* ── Foreground Content on Left ── */}
      <div className="relative z-10 max-w-2xl px-6 py-12 sm:px-10 lg:px-14 space-y-5 taste-enter">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-deep bg-white/80 backdrop-blur-md border border-brand/20 shadow-sm">
          <BadgeIcon size={14} className="text-brand" />
          <span>{slide.badge[lang]}</span>
        </span>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-deep leading-[1.12]">
          {slide.title[lang]}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-charcoal/85 leading-relaxed max-w-xl font-medium">
          {slide.subtitle[lang]}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-3.5 items-center">
          {slide.primaryCta.href.startsWith('#') ? (
            <a
              href={slide.primaryCta.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-7 font-extrabold text-deep transition-all hover:bg-gold/90 active:scale-95 text-sm sm:text-base tracking-wide shadow-lg shadow-gold/25"
            >
              {slide.primaryCta[lang]} <ArrowRight size={17} />
            </a>
          ) : (
            <Link
              to={slide.primaryCta.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-7 font-extrabold text-deep transition-all hover:bg-gold/90 active:scale-95 text-sm sm:text-base tracking-wide shadow-lg shadow-gold/25"
            >
              {slide.primaryCta[lang]} <ArrowRight size={17} />
            </Link>
          )}

          {slide.secondaryCta.isPhone ? (
            <a
              href={slide.secondaryCta.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl glass-pill px-6 font-bold text-deep text-sm sm:text-base hover:bg-white transition-all active:scale-95 shadow-sm"
            >
              <Phone size={16} /> {slide.secondaryCta[lang]}
            </a>
          ) : (
            <Link
              to={slide.secondaryCta.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl glass-pill px-6 font-bold text-deep text-sm sm:text-base hover:bg-white transition-all active:scale-95 shadow-sm"
            >
              {slide.secondaryCta[lang]}
            </Link>
          )}
        </div>
      </div>

      {/* ── Slide Progress Indicators (Bottom Left on Desktop) ── */}
      <div className="absolute bottom-5 left-6 sm:bottom-8 sm:left-14 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              current === i
                ? 'w-8 h-2.5 bg-brand shadow-sm'
                : 'w-2.5 h-2.5 bg-brand/25 hover:bg-brand/50'
            }`}
          />
        ))}
      </div>

      {/* ── Navigation Arrows (Bottom Right) ── */}
      <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="grid size-11 place-items-center rounded-xl glass-pill text-deep hover:bg-white hover:text-brand transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="grid size-11 place-items-center rounded-xl glass-pill text-deep hover:bg-white hover:text-brand transition-all active:scale-95 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
