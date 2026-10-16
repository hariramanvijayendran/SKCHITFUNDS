import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SchemesPage from './pages/SchemesPage'
import BenefitsPage from './pages/BenefitsPage'
import FaqPage from './pages/FaqPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* 404 fallback */}
            <Route path="*" element={
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
                <p className="text-6xl font-black text-brand">404</p>
                <p className="text-xl font-bold text-deep">Page not found</p>
                <a href="/" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-wine px-6 font-bold text-white">Go home</a>
              </div>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LangProvider>
  )
}

