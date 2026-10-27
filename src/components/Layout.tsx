import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone, Mail, Landmark } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'
import { companyImages } from '../data/images'

export default function Layout({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang()
  const t = copy[lang]
  const [menu, setMenu] = useState(false)

  const nav = [
    { to: '/', label: t.home },
    { to: '/about', label: t.about },
    { to: '/schemes', label: t.schemes },
    { to: '/benefits', label: t.benefits },
    { to: '/faq', label: t.faq },
    { to: '/contact', label: t.contact },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold transition-colors rounded-md ${
      isActive
        ? 'text-deep bg-brand/10'
        : 'text-charcoal hover:text-brand hover:bg-black/5'
    }`

  return (
    <div className="relative overflow-x-hidden min-h-[100dvh] flex flex-col bg-cream text-charcoal">
      {/* Ambient Glassmorphism Glow Orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] rounded-full bg-brand/12 blur-3xl" />
        <div className="absolute top-2/3 -left-20 w-80 h-80 rounded-full bg-deep/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 bg-white p-3 font-bold text-deep rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Credentials Utility Bar */}
      <div className="bg-deep/95 backdrop-blur-md text-cream/90 text-sm py-2 px-4 sm:px-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide text-gold flex items-center gap-1.5">
              <Landmark size={13} /> {t.tagline}
            </span>
            <span className="hidden md:inline text-cream/40">|</span>
            <span className="hidden md:inline text-cream/80">{t.regAct}</span>
          </div>
          <div className="flex items-center gap-4 text-cream/80">
            <a href="tel:+919360066669" className="hover:text-gold flex items-center gap-1 font-semibold transition-colors">
              <Phone size={12} /> +91 93600 66669
            </a>
            <span className="text-cream/40">|</span>
            <a href="mailto:skchitfundspvtltd@yahoo.com" className="hover:text-gold hidden sm:flex items-center gap-1 transition-colors">
              <Mail size={12} /> {t.emailAddress}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header & Floating Glass Navigation */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 py-2.5 transition-all">
        <div className="glass-surface mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 rounded-2xl shadow-[0_8px_32px_rgba(20,83,45,0.06)] border border-white/80">
          {/* Logo */}
          <Link
            to="/"
            className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
            onClick={() => setMenu(false)}
            aria-label="Senthilkumar Chit Funds home"
          >
            <img
              src={companyImages.icon}
              width="1024"
              height="744"
              className="h-9 w-auto sm:h-11 object-contain shrink-0 drop-shadow-sm"
              alt="Velu Senthilkumar Chit Funds icon"
            />
            <img
              src={companyImages.logo}
              width="1024"
              height="235"
              className="h-6 w-auto sm:h-8 max-w-[12rem] sm:max-w-[17rem] object-contain drop-shadow-sm"
              alt="Velu Senthilkumar Chit Funds logo"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary Navigation">
            {nav.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="min-h-10 rounded-xl glass-pill px-3.5 text-xs sm:text-sm font-extrabold text-deep hover:bg-white transition-all active:scale-95 shadow-sm"
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              aria-label="Switch between English and Tamil"
            >
              {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
            <Link
              to="/contact"
              className="hidden min-h-10 items-center justify-center rounded-xl bg-wine px-5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-wine/90 active:scale-95 shadow-md shadow-wine/20 sm:inline-flex"
            >
              {t.enquire}
            </Link>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-xl glass-pill text-deep lg:hidden transition-transform active:scale-95 shadow-sm"
              aria-expanded={menu}
              aria-controls="mobile-nav"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle navigation menu"
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Frosted Glass */}
        {menu && (
          <nav id="mobile-nav" className="glass-surface mt-2 rounded-2xl p-4 lg:hidden border border-white/80 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200" aria-label="Mobile Primary">
            <div className="space-y-1">
              {nav.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenu(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive ? 'bg-deep text-cream shadow-sm' : 'text-charcoal hover:bg-black/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <Link
              to="/contact"
              onClick={() => setMenu(false)}
              className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-wine px-4 py-3 text-center text-base font-bold text-white shadow-md shadow-wine/20"
            >
              {t.enquire}
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main" className="flex-1">
        {children}
      </main>

      {/* Premium Editorial Footer */}
      <footer className="bg-charcoal text-cream/80 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 items-start">
            {/* Col 1: Brand & Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={companyImages.icon}
                  width="1024"
                  height="744"
                  className="h-10 w-auto object-contain shrink-0"
                  alt="Velu Senthilkumar Chit Funds mark"
                />
                <img
                  src={companyImages.logo}
                  width="1024"
                  height="235"
                  className="h-7 w-auto object-contain"
                  alt="Velu Senthilkumar Chit Funds"
                />
              </div>
              <p className="text-sm font-semibold text-gold">
                {t.tagline}
              </p>
              <p className="text-sm leading-relaxed text-cream/70">
                {t.companyName}
              </p>
              <div className="pt-2 text-sm space-y-1 text-cream/60">
                <p>{t.cin}</p>
                <p>{t.pan} · {t.tan}</p>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <p className="text-sm font-bold  text-cream mb-4">
                {lang === 'en' ? 'Quick Navigation' : 'விரைவு இணைப்புகள்'}
              </p>
              <ul className="space-y-2.5 text-sm">
                {nav.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-gold transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Addresses */}
            <div className="space-y-4 text-sm leading-relaxed text-cream/75">
              <div>
                <p className="text-sm font-bold  text-cream mb-1">
                  {t.addressTitle}
                </p>
                <p>{t.regAddress}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm font-bold  text-cream mb-1">
                  {t.adminTitle}
                </p>
                <p>{t.adminAddress}</p>
              </div>
            </div>

            {/* Col 4: Direct Contacts */}
            <div className="space-y-3">
              <p className="text-sm font-bold  text-cream mb-2">
                {lang === 'en' ? 'Direct Leadership' : 'நேரடித் தொடர்புகள்'}
              </p>
              <div className="text-sm space-y-2 text-cream/80">
                <p>
                  <b className="text-cream">Rtn. Velu Senthilkumar</b>
                  <br />
                  <a href="tel:+919360066669" className="text-gold font-bold hover:underline">
                    +91 93600 66669
                  </a>
                </p>
                <p className="pt-1">
                  <b className="text-cream">Prabu (Director)</b>
                  <br />
                  <a href="tel:+919842550345" className="text-gold font-bold hover:underline">
                    +91 98425 50345
                  </a>{' '}
                  / +91 97501 50150
                </p>
                <p className="pt-1">
                  <a href="mailto:skchitfundspvtltd@yahoo.com" className="text-cream/90 hover:text-gold underline">
                    {t.emailAddress}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimers & Credits */}
          <div className="pt-8 space-y-4 text-sm text-cream/60 leading-relaxed">
            <p>{t.footerDisclaimer}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 text-cream/50">
              <p>© {new Date().getFullYear()} {t.companyName}. {t.allRightsReserved}</p>
              <p>{t.locationSalem}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


